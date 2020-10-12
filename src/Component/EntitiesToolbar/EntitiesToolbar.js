import React, {useContext, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Button, TextField, Grid, Card, CardContent, CardHeader, Snackbar} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

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
}));

const EntitiesToolbar = (props) => {
  const {className, entriesState, ...rest} = props;

  const {entries, setEntries} = entriesState;

  const {setLoading} = useContext(AppContext);

  const [success, setSuccess] = useState(false);

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [domain, setDomain] = useState(localStorage.getItem('domain') || '');
  const [projectId, setProjectId] = useState(localStorage.getItem('projectId') || '');

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

  const saveProjectId = (projectId) => {
    localStorage.setItem('projectId', projectId);
    setProjectId(projectId);
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

              console.log(results.data);
              res(results.data);
            };
            reader.onerror = rej;
          })
      )
    ).then((data) => {
      setEntries(data.reduce((c, i) => [...c, ...i], []));
    });
  };

  const sendEntities = async () => {
    setLoading(true);
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    await Promise.all(
      entries
        .map((entry) => {
          const start = moment(entry.start, 'HH:mm');
          const end = moment(entry.end, 'HH:mm');
          const date = moment(entry.date, 'YYYYY-MM-DD');

          const diff = moment.duration(end.diff(start));
          return {
            'time-entry': {
              description: entry.description.replace(/[^a-z0-9\s\-_]/gi, ''),
              date: date.format('YYYYMMDD'),
              time: entry.start,
              hours: diff.hours(),
              minutes: entry.start === entry.end ? 1 : diff.minutes(),
              isbillable: 'true',
            },
          };
        })
        .map((payload) =>
          Axios.post(`https://${domain}/projects/${projectId}/time_entries.json`, payload, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          })
        )
    ).then(() => {
      setSuccess(true);
      setLoading(false);
      cleanEntries();
    });
    console.log('CSV file successfully processed');
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={'Import time entries'} />
      <CardContent>
        <form noValidate>
          <Grid container spacing={4}>
            <Grid container item md={6} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-user"
                label="Teamwork User"
                onChange={(e) => saveUsername(e.target.value)}
                value={username}
                variant="outlined"
              />
            </Grid>
            <Grid container item md={6} xs={12}>
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
            <Grid container item md={6} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-project"
                label="Teamwork Deafult Project"
                onChange={(e) => saveProjectId(e.target.value)}
                value={projectId}
                variant="outlined"
              />
            </Grid>
            <Grid container item md={6} xs={12}>
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
                disabled={!(username && password && projectId && domain && entries.length)}
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
    </Card>
  );
};

EntitiesToolbar.propTypes = {
  className: PropTypes.string,
};

export default EntitiesToolbar;
