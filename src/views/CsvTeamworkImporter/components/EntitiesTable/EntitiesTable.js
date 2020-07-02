import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';
import {Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, CardHeader} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

const EntitiesTable = (props) => {
  const {className, timeEntries, ...rest} = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={`Entries to import (${timeEntries.length})`} />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map((timeEntry, i) => (
                  <TableRow className={classes.tableRow} hover key={i}>
                    <TableCell>{timeEntry.description}</TableCell>
                    <TableCell>{timeEntry.start}</TableCell>
                    <TableCell>{timeEntry.end}</TableCell>
                    <TableCell>{timeEntry.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

EntitiesTable.propTypes = {
  className: PropTypes.string,
  timeEntries: PropTypes.array.isRequired,
};

export default EntitiesTable;
