import { Switch, Route } from 'wouter'

import { ProtectedRoute } from '../components/shared/ProtectedRoute'
import { Assets, Contracts, LoginPage, MainPage, Policies } from '../pages'

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
      <Route>404 - Not Found</Route>
    </Switch>
  )
}
