import React, {useContext, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Autocomplete from '@material-ui/lab/Autocomplete';

import * as Papa from 'papaparse';

import Axios from 'axios';
import moment from 'moment';
import {AppContext} from '../../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    width: '100%',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(2),
  },
}));

const EntitiesToolbar = (props) => {
  const {className, entriesState, ...rest} = props;

  const {entries, setEntries, selected, setSelected} = entriesState;

  const {setLoading} = useContext(AppContext);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [domain, setDomain] = useState(localStorage.getItem('domain') || '');
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogState] = useState(false);

  const projectMap = (project) => ({id: project.id, name: project.name});

  const transformProjects = (response) => response.data.projects.map(projectMap);

  const closeDialog = () => {
    setSelected([]);
    setDialogState(false);
  };
  const openDialog = async () => {
    if (projects.length === 0) {
      setLoading(true);
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      const projectsResponse = await Axios.get(`https://${domain}/projects.json`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      const projects = transformProjects(projectsResponse);
      setProjects(projects);
      setLoading(false);
    }
    setDialogState(true);
  };

  const fileInput = useRef(null);

  const saveUsername = (username) => {
    localStorage.setItem('username', username);
    setUsername(username);
  };

  const savePassword = (password) => {
    localStorage.setItem('password', password);
    setPassword(password);
  };

  const saveDomain = (domain) => {
    localStorage.setItem('domain', domain);
    setDomain(domain);
  };

  const classes = useStyles();

  const cleanEntries = () => {
    fileInput.current.value = '';
    setEntries([]);
  };

  const onFileSelected = (e) => {
    const files = Object.values(e.currentTarget.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((res, rej) => {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event) => {
              var results = Papa.parse(event.target.result, {
                header: true,
                skipEmptyLines: true,
              });
              res(results.data);
            };
            reader.onerror = rej;
          }),
      ),
    ).then((data) => {
      const entries = data.reduce((carry, item) => [...carry, ...item], []);
      const finalEntries = entries.map((item) => ({...item, project: {id: 0, name: ''}}));
      setEntries(finalEntries);
    });
  };

  const setProjectToTasks = (project) => {
    const updatedEntries = entries.map((entry, id) => {
      if (selected.indexOf(id) === -1) {
        return entry;
      }

      return {...entry, project};
    });
    setEntries(updatedEntries);
  };

  const processEntries = async (entries, token) => {
    const dataEntries = entries.map((entry) => {
      const start = moment(entry.start, 'HH:mm');
      const end = moment(entry.end, 'HH:mm');
      const date = moment(entry.date, 'YYYYY-MM-DD');

      const diff = moment.duration(end.diff(start));
      return {
        data: {
          project: entry.project,
        },
        payload: {
          'time-entry': {
            description: entry.description.replace(/[^a-z0-9\s\-_]/gi, ''),
            date: date.format('YYYYMMDD'),
            time: entry.start,
            hours: diff.hours(),
            minutes: entry.start === entry.end ? 1 : diff.minutes(),
            isbillable: 'true',
          },
        },
      };
    });

    let count = 1;
    for (let entry of dataEntries) {
      try {
        setLoading(true, `Sending ${count++} of ${dataEntries.length}`);
        await Axios.post(`https://${domain}/projects/${entry.data.project.id}/time_entries.json`, entry.payload, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        console.log('Entry sent succesfully!');
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    return true;
  };

  const sendEntities = async () => {
    setLoading(true);
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    const success = await processEntries(entries, token);

    if (success) {
      setSuccess(true);
      cleanEntries();
    } else {
      setError(true);
    }
    setLoading(false);
    console.log('CSV file processed');
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={'Import time entries'} />
      <CardContent>
        <form noValidate>
          <Grid container spacing={4}>
            <Grid container item md={4} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-user"
                label="Teamwork User"
                onChange={(e) => saveUsername(e.target.value)}
                value={username}
                variant="outlined"
              />
            </Grid>
            <Grid container item md={4} xs={12}>
              <TextField
                autoComplete="off"
                fullWidth
                id="teamwork-importer-password"
                label="Teamwork Password"
                onChange={(e) => savePassword(e.target.value)}
                type="password"
                value={password}
                variant="outlined"
              />
            </Grid>
            <Grid container item md={4} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-domain"
                label="Teamwork Domain"
                onChange={(e) => saveDomain(e.target.value)}
                value={domain}
                variant="outlined"
              />
            </Grid>
            <Grid container item xs={12}>
              <input
                accept=".csv"
                className={classes.fileInput}
                id="teamwork-importer-files"
                multiple
                ref={fileInput}
                onChange={onFileSelected}
                type="file"
              />
              <label className={classes.fileLabel} htmlFor="teamwork-importer-files">
                <Button component="span" variant="outlined" color="secondary" fullWidth>
                  Select files
                </Button>
              </label>
            </Grid>
            <Grid container item md={6} xs={12}>
              <span className={classes.spacer} />
              <Button
                color="primary"
                fullWidth
                onClick={cleanEntries}
                variant="outlined"
                disabled={entries.length === 0}
              >
                Clean
              </Button>
            </Grid>
            <Grid container item md={6} xs={12}>
              <span className={classes.spacer} />
              <Button
                color="primary"
                fullWidth
                onClick={sendEntities}
                variant="contained"
                disabled={!(username && password && domain && entries.length)}
              >
                Send to Teamwork
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      >
        <Alert elevation={6} variant="filled" severity="success" style={{maxWidth: '100%', width: 400}}>
          Export to teamwork succed!
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      >
        <Alert elevation={6} variant="filled" severity="error" style={{maxWidth: '100%', width: 400}}>
          An error has occurred! Please try again later :(
        </Alert>
      </Snackbar>
      <Dialog onClose={closeDialog} aria-labelledby="select-project" open={dialogOpen}>
        <DialogTitle id="select-project">Pick project for selected Tasks</DialogTitle>
        <DialogContent>
          <DialogContentText>Select the project you want to attach the selected tasks</DialogContentText>
          <br />
          <Autocomplete
            id="combo-box"
            options={projects}
            getOptionLabel={(option) => option.name}
            style={{width: '100%'}}
            onChange={(event, newValue) => {
              setProjectToTasks(newValue);
            }}
            renderOption={(option) => <Typography variant="subtitle1">{option.name}</Typography>}
            renderInput={(params) => <TextField {...params} label="Projects" variant="outlined" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      <Fab
        color="primary"
        disabled={!(selected.length && username && password && domain && entries.length)}
        variant="extended"
        aria-label="Select Project"
        className={classes.fab}
        onClick={openDialog}
      >
        <AccountTreeIcon className={classes.extendedIcon} />
        Select Project
      </Fab>
    </Card>
  );
};

EntitiesToolbar.propTypes = {
  className: PropTypes.string,
};

export default EntitiesToolbar;
