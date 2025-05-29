import { Switch, Route } from 'wouter'

import { ProtectedRoute } from '../components/shared/ProtectedRoute'
import {
  Contracts,
  DataOffers,
  Exchanges,
  LoginPage,
  MainPage,
  Policies
} from '../pages'

export const Router = () => {
  return (
    <Switch>
      <Route
        path='/'
        component={() => <ProtectedRoute Component={MainPage} />}
      />
      <Route path='/login' component={LoginPage} />
      {/* <Route path='/politics' component={Politics} /> */}
      <Route
        path='/contracts'
        component={() => <ProtectedRoute Component={Contracts} />}
      />
      {/* <Route path='/data-conections' component={DataConections} /> */}
      <Route
        path='/data-offers'
        component={() => <ProtectedRoute Component={DataOffers} />}
      />
      <Route
        path='/exchanges'
        component={() => <ProtectedRoute Component={Exchanges} />}
      />
      <Route
        path='/policies'
        component={() => <ProtectedRoute Component={Policies} />}
      />
      <Route>404 - Not Found</Route>
    </Switch>
  )
}
