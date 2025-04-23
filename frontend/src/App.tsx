import { useState } from 'react'
import { Drawer } from './components/Drawer'
import { Header } from './components/Header'
import { Router } from './router/Router'

export const App = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className='absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]'>
      <main className='h-screen flex flex-col gap-4 '>
        <Drawer open={open} setOpen={setOpen} />
        <Header setOpen={setOpen} />
        <Router />
      </main>
    </div>
  )
}
