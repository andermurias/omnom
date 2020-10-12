import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';

import {theme} from './_config/theme';

import MainLayout from './Layout/MainLayout';

import Home from './Page/Home/Home';
import Iro from './Page/Iro/Iro';
import CsvTeamworkImporter from './Page/CsvTeamworkImporter/CsvTeamworkImporter';

import {AppProvider} from './_context/AppContext';
import ModalLoader from './Component/ModalLoader/ModalLoader';

import HomeIcon from '@material-ui/icons/Home';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import TocIcon from '@material-ui/icons/Toc';

const routerConfiguration = [
  {
    route: '/iro',
    text: 'IRO',
    icon: ColorLensIcon,
    component: Iro,
    props: {},
  },
  {
    route: '/twimporter',
    text: 'CSV to Teamwork',
    icon: TocIcon,
    component: CsvTeamworkImporter,
    props: {},
  },
  {
    route: '/',
    text: 'Home',
    icon: HomeIcon,
    component: Home,
    props: {},
  },
];

const RoutedApp = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const muiTheme = createMuiTheme(theme(prefersDarkMode));

  return (
    <AppProvider>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
          <MainLayout menuItems={routerConfiguration}>
            <Switch>
              {routerConfiguration.map(({component: Component, route, props}, i) => (
                <Route path={route} key={i}>
                  <div>{route}</div>
                  <Component route={route} {...props} />
                </Route>
              ))}
            </Switch>
          </MainLayout>
        </Router>
        <ModalLoader />
      </MuiThemeProvider>
    </AppProvider>
  );
};

export default React.memo(RoutedApp);
