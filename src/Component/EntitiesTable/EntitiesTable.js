import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardHeader,
  Checkbox,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    // minWidth: 1050,
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

const EntitiesTable = ({className, timeEntries, selectedEntities, ...props}) => {
  const {setSelected, selected} = selectedEntities;

  const classes = useStyles();

  const toggleTimeEntry = (id, entry) => (e) => {
    const newSelected = [...selected];

    const idx = selected.indexOf(id);

    if (e.target.checked && idx === -1) {
      newSelected.push(id);
    } else if (!e.target.checked && idx !== -1) {
      newSelected.splice(idx, 1);
    }
    setSelected(newSelected);
  };

  return (
    <Card {...props} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={`Entries to import (${timeEntries.length})`} />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map((timeEntry, i) => (
                  <TableRow className={classes.tableRow} hover key={i}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={toggleTimeEntry(i, timeEntry)}
                        checked={selected.indexOf(i) !== -1}
                        inputProps={{
                          'aria-labelledby': timeEntry.description,
                        }}
                      />
                    </TableCell>
                    <TableCell>{timeEntry.description}</TableCell>
                    <TableCell>
                      {timeEntry.project.id !== 0 && timeEntry.project.id + ' - ' + timeEntry.project.name}
                    </TableCell>
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
