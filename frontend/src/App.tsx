import { useState } from 'react'
import { Drawer } from './components/Drawer'
import { Header } from './components/Header'
import { Router } from './router/Router'

export const App = () => {
  const [open, setOpen] = useState(false)

  return (
    <main className='h-screen flex flex-col gap-4'>
      <Drawer open={open} setOpen={setOpen} />
      <Header setOpen={setOpen} />
      <Router />
    </main>
  )
}
