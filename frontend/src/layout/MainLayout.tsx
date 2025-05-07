import { useEffect, useState } from 'react'
import { Drawer, Header, Loader } from '../components'
import { Router } from '../router/Router'
import { useGetCatalogs } from '../api/catalogs/useGetCatalogs'
import { useGetContracts } from '../api/contracts/useGetContracts'
import { useGetDataSources } from '../api/datasources/useGetDataSources'
import { useGetOffers } from '../api/offers/useGetOffers'
import i18next from 'i18next'
export const MainLayout = () => {
  const [open, setOpen] = useState(false)
  const offersData = useGetOffers()
  const contractsData = useGetContracts()
  const datasourcesData = useGetDataSources()
  const catalogsData = useGetCatalogs()

  useEffect(() => {
    const langSelected = localStorage.getItem('i18nextLng')
    if (langSelected) {
      i18next.changeLanguage(langSelected, () => {
        console.log('Language changed to:', langSelected)
      })
    } else {
      console.log('No language selected, defaulting to English')
    }
  }, [])

  if (
    offersData.isLoading ||
    contractsData.isLoading ||
    datasourcesData.isLoading ||
    catalogsData.isLoading
  ) {
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }

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
