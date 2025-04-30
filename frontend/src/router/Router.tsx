import { Switch, Route } from 'wouter'
import { Politics } from '../pages/Politics'
import { Contracts } from '../pages/Contracts'
import { DataConections } from '../pages/DataConections'
import { DataOffers } from '../pages/DataOffers'
import { Exchanges } from '../pages/Exchanges'
import { MainPage } from '../pages/MainPage'
import { Catalogs } from '../pages/Catalogs'
import { CatalogOffers } from '../pages/CatalogOffers'

export const Router = () => {
  return (
    <Switch>
      <Route path='/' component={MainPage} />
      <Route path='/politics' component={Politics} />
      <Route path='/contracts' component={Contracts} />
      <Route path='/data-conections' component={DataConections} />
      <Route path='/data-offers' component={DataOffers} />
      <Route path='/exchanges' component={Exchanges} />
      <Route path='/catalogs' component={Catalogs} />
      {/* ruta para /catalogs/${catalogId}/offers */}
      <Route path='/catalogs/:catalogId/offers'>
        {({ catalogId }) => <CatalogOffers catalogId={catalogId} />}
      </Route>
      <Route>404 - Not Found</Route>
    </Switch>
  )
}
