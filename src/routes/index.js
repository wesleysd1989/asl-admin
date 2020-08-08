import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
// Containers
import DefaultLayout from '../containers/DefaultLayout';

// Pages
import Login from '../pages/Login';
import Confirme from '../pages/Confirme';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/confirme/:token" component={Confirme} />
      <Route path="/" component={DefaultLayout} isPrivate />
    </Switch>
  );
}
