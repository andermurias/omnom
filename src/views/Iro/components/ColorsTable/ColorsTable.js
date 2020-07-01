import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, CardHeader} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
  colorBox: {
    borderRadius: '100%',
    height: 33,
    width: 33,
    border: 'solid 1px #ccc',
  },
  monospaced: {
    padding: '5px 10%',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    backgroundColor: '#EEE',
    border: 'solid 1px #ccc',
    // eslint-disable-next-line quotes
    fontFamily: "'IBM Plex Mono', monospace",
  },
}));

const ColorsTable = props => {
  const {className, colors, ...rest} = props;

  const classes = useStyles();

  console.log(colors);

  return (
    <Card {...rest} className={clsx(classes.root, className)} variant="outlined">
      <CardHeader title={`Picked colors`} />
      <CardContent className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Color</TableCell>
              <TableCell>Hex</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Closest</TableCell>
              <TableCell>LESS</TableCell>
              <TableCell>SASS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colors.map((color, i) => (
              <TableRow className={classes.tableRow} hover key={i}>
                <TableCell>
                  <div className={classes.colorBox} style={{backgroundColor: color.color}}></div>
                </TableCell>
                <TableCell>
                  <span className={classes.monospaced}>{color.color}</span>
                </TableCell>
                <TableCell>{color.name}</TableCell>
                <TableCell>
                  <span className={classes.monospaced}>{color.closest}</span>
                </TableCell>
                <TableCell>
                  <span className={classes.monospaced}>{color.less}</span>
                </TableCell>
                <TableCell>
                  <span className={classes.monospaced}>{color.sass}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

ColorsTable.propTypes = {
  className: PropTypes.string,
  colors: PropTypes.array.isRequired,
};

export default ColorsTable;
