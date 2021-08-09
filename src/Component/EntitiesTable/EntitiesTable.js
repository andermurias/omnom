import React, {useState} from 'react';
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
  TextField,
  TableHead,
  TableRow,
  CardHeader,
  Checkbox,
  Grid,
  Button,
  IconButton,
} from '@material-ui/core';
import {Clear} from '@material-ui/icons';

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
  filterSection: {
    padding: theme.spacing(2),
  },
  tableRowHidden: {
    display: 'none',
  },
}));

const EntitiesTable = ({className, timeEntries, selectedEntities, ...props}) => {
  const {setSelected, selected} = selectedEntities;
  const [filter, setFilter] = useState('');

  const classes = useStyles();

  const cleanFilter = () => setFilter('');

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

  const shouldCheckTimeEntry = (id, entry) => (selected.indexOf(id) === -1 ? id : null);

  const checkVisible = () => {
    const checked = timeEntries
      .map((entry, i) => !shouldHideRow(entry) && shouldCheckTimeEntry(i, entry))
      .filter((e) => !!e);

    const newSelected = [...selected, ...checked];

    setSelected(newSelected);
  };

  const shouldHideRow = (entry) => filter && entry.description.toLowerCase().indexOf(filter.toLowerCase()) === -1;
  return (
    <Card {...props} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={`Entries to import (${timeEntries.length})`} />
      <div className={classes.filterSection}>
        <Grid container spacing={4}>
          <Grid container item md={10} xs={12}>
            <TextField
              autoComplete="off"
              fullWidth
              id="teamwork-importer-filter"
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
              type="text"
              value={filter}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton aria-label="Clean Filter" onClick={cleanFilter}>
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid container item md={2} xs={12}>
            <span className={classes.spacer} />
            <Button color="secondary" onClick={checkVisible} fullWidth variant="outlined">
              Check Visible
            </Button>
          </Grid>
        </Grid>
      </div>
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
                  <TableRow
                    className={clsx({
                      [classes.tableRow]: true,
                      [classes.tableRowHidden]: shouldHideRow(timeEntry),
                    })}
                    hover
                    key={i}
                  >
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
                      {timeEntry.project &&
                        timeEntry.project.id !== 0 &&
                        timeEntry.project.id + ' - ' + timeEntry.project.name}
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
