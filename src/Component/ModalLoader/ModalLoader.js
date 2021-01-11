import React, {useContext} from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';

import {AppContext} from '../../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ModalLoader = () => {
  const classes = useStyles();
  const {loading, loadingText} = useContext(AppContext);

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <Box m={2}>
        <CircularProgress color="secondary" size="6rem" />
      </Box>
      <Typography variant="subtitle1">{loadingText}</Typography>
    </Backdrop>
  );
};

export default React.memo(ModalLoader);
