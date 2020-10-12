import React, {useContext, useState} from 'react';
import {makeStyles} from '@material-ui/styles';

import EntitiesTable from '../../Component/EntitiesTable/EntitiesTable';
import EntitiesToolbar from '../../Component/EntitiesToolbar/EntitiesToolbar';

import {Typography} from '@material-ui/core';
import {AppContext} from '../../_context/AppContext';

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

  const {setTitle} = useContext(AppContext);

  setTitle('CSV to Teamwork Tool');

  const [entries, setEntries] = useState([]);

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="subtitle1">
        This tool imports all the data you put here to the accound and projecto you select on Teamwork
      </Typography>
      <EntitiesToolbar entriesState={{entries, setEntries}} />
      <div className={classes.content}>
        <EntitiesTable timeEntries={entries} />
      </div>
    </div>
  );
};

export default CsvTeamworkImporter;
