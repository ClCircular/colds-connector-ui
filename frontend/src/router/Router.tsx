import { Switch, Route } from 'wouter'
// import { Policies } from '../pages/Policies'
import { Contracts } from '../pages/Contracts'
// import { DataConections } from '../pages/DataConections'
import { DataOffers } from '../pages/DataOffers'
import { Exchanges } from '../pages/Exchanges'
import { MainPage } from '../pages/MainPage'
import { LoginPage } from '../pages/LoginPage'
import { Catalogs } from '../pages/Catalogs'
import { CatalogOffers } from '../pages/CatalogOffers'
import { ProtectedRoute } from '../components/shared/ProtectedRoute'

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
        path='/catalogs'
        component={() => <ProtectedRoute Component={Catalogs} />}
      />
      {/* ruta para /catalogs/${catalogId}/offers */}
      <Route path='/catalogs/:catalogId/offers'>
        {({ catalogId }) => (
          <ProtectedRoute
            Component={() => <CatalogOffers catalogId={catalogId} />}
          />
        )}
      </Route>
      <Route>404 - Not Found</Route>
    </Switch>
  )
}
