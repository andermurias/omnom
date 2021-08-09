import React, {useContext} from 'react';
import {makeStyles} from '@material-ui/core';

import {AppContext} from '../../_context/AppContext';

import logo from '../../_assets/logos/logo--white-full.svg';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'calc(100vh - ' + (theme.mixins.toolbar.minHeight + theme.spacing(2)) + 'px)',
    opacity: 0.01,
    padding: '0 20rem 0 20rem',
  },
}));

const Home = () => {
  const classes = useStyles();

  const {setTitle} = useContext(AppContext);
  setTitle('Home');
  return (
    <div className={classes.content}>
      <img src={logo} alt="logo" />
    </div>
  );
};

export default Home;
