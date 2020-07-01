import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Button, TextField, Grid, Card, CardContent, CardHeader} from '@material-ui/core';

import * as Papa from 'papaparse';

import Axios from 'axios';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
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

const EntitiesToolbar = props => {
  const {className, entriesState, ...rest} = props;

  const {entries, setEntries} = entriesState;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [projectId, setProjectId] = useState('');

  const classes = useStyles();

  const onFileSelected = e => {
    const files = Object.values(e.currentTarget.files);
    Promise.all(
      files.map(
        file =>
          new Promise((res, rej) => {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = event => {
              var results = Papa.parse(event.target.result, {
                header: true,
                skipEmptyLines: true,
              });

              console.log(results.data);
              res(results.data);
            };
            reader.onerror = rej;
          }),
      ),
    ).then(data => {
      setEntries(data.reduce((c, i) => [...c, ...i], []));
    });
  };

  const sendEntities = async () => {
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    console.log(token);
    console.log(username);
    console.log(password);

    await Promise.all(
      entries
        .map(entry => {
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
            },
          };
        })
        .map(payload =>
          Axios.post(`https://${domain}/projects/${projectId}/time_entries.json`, payload, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }),
        ),
    );
    console.log('CSV file successfully processed');
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={'Import time entries'} />
      <CardContent>
        <form noValidate>
          <Grid container spacing={1}>
            <Grid container item xs={12}></Grid>
            <Grid container item sm={6} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-user"
                label="Teamwork User"
                onChange={e => setUsername(e.target.value)}
                value={username}
                variant="outlined"
              />
            </Grid>
            <Grid container item sm={6} xs={12}>
              <TextField
                autoComplete="off"
                fullWidth
                id="teamwork-importer-password"
                label="Teamwork Password"
                onChange={e => setPassword(e.target.value)}
                type="password"
                value={password}
                variant="outlined"
              />
            </Grid>
            <Grid container item sm={6} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-project"
                label="Teamwork Deafult Project"
                onChange={e => setProjectId(e.target.value)}
                value={projectId}
                variant="outlined"
              />
            </Grid>
            <Grid container item sm={6} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-domain"
                label="Teamwork Domain"
                onChange={e => setDomain(e.target.value)}
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
                onChange={onFileSelected}
                type="file"
              />
              <label className={classes.fileLabel} htmlFor="teamwork-importer-files">
                <Button component="span" fullWidth variant="outlined">
                  Select files
                </Button>
              </label>
            </Grid>
          </Grid>
          <div className={classes.row}>
            <span className={classes.spacer} />
            <Button color="primary" onClick={sendEntities} variant="contained">
              Send to Teamwork
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

EntitiesToolbar.propTypes = {
  className: PropTypes.string,
};

export default EntitiesToolbar;
