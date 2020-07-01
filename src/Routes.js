import React from 'react';
import {Switch, Redirect} from 'react-router-dom';

import {RouteWithLayout} from './components';
import {Main as MainLayout, Minimal as MinimalLayout} from './layouts';

import {
  ProductList as ProductListView,
  NotFound as NotFoundView,
  CsvTeamworkImporter as CsvTeamworkImporterView,
  Iro as IroView,
} from './views';

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/tools" />
    <RouteWithLayout component={ProductListView} exact layout={MainLayout} path="/tools" />
    <RouteWithLayout component={CsvTeamworkImporterView} exact layout={MainLayout} path="/importer/teamwork" />
    <RouteWithLayout component={IroView} exact layout={MainLayout} path="/iro" />
    <RouteWithLayout component={NotFoundView} exact layout={MinimalLayout} path="/not-found" />
    <Redirect to="/not-found" />
  </Switch>
);

export default Routes;
