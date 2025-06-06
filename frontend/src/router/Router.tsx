import { Switch, Route } from 'wouter'

import { ProtectedRoute } from '../components/shared/ProtectedRoute'
import {
  Assets,
  CatalogBrowser,
  Contracts,
  LoginPage,
  MainPage,
  Negotiations,
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
      <Route
        path='/contracts'
        component={() => <ProtectedRoute Component={Contracts} />}
      />
      <Route
        path='/policies'
        component={() => <ProtectedRoute Component={Policies} />}
      />
      <Route
        path='/assets'
        component={() => <ProtectedRoute Component={Assets} />}
      />
      <Route
        path='/negotiations'
        component={() => <ProtectedRoute Component={Negotiations} />}
      />
      <Route
        path='/catalog-browser'
        component={() => <ProtectedRoute Component={CatalogBrowser} />}
      />
      <Route>404 - Not Found</Route>
    </Switch>
  )
}
