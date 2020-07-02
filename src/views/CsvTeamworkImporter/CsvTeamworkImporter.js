import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';

import {EntitiesToolbar, EntitiesTable} from './components';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const CsvTeamworkImporter = () => {
  const classes = useStyles();

  const [entries, setEntries] = useState([]);

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h1">
        CSV To Teamwork Importer
      </Typography>

      <EntitiesToolbar entriesState={{entries, setEntries}} />
      <div className={classes.content}>
        <EntitiesTable timeEntries={entries} />
      </div>
    </div>
  );
};

export default CsvTeamworkImporter;
