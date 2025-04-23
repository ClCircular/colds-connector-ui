import { Switch, Route } from 'wouter'
import { Politics } from '../pages/Politics'
import { Contracts } from '../pages/Contracts'
import { DataConections } from '../pages/DataConections'
import { OfferedData } from '../pages/OfferedData'
import { Exchanges } from '../pages/Exchanges'
import { MainPage } from '../pages/MainPage'

export const Router = () => {
  return (
    <Switch>
      <Route path='/' component={MainPage} />
      <Route path='/politics' component={Politics} />
      <Route path='/contracts' component={Contracts} />
      <Route path='/data-conections' component={DataConections} />
      <Route path='/offered-data' component={OfferedData} />
      <Route path='/exchanges' component={Exchanges} />
      <Route>404 - Not Found</Route>
    </Switch>
  )
}
