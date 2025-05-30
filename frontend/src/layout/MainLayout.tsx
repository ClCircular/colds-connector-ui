import { ReactNode, useEffect, useState } from 'react'
import { Drawer, Header, Loader } from '../components'
import { Router } from '../router/Router'
import { useGetContracts } from '../api/contracts/useGetContracts'
// import { useGetDataSources } from '../api/datasources/useGetDataSources'
import { useGetOffers } from '../api/offers/useGetOffers'
import i18next from 'i18next'
import { useGetPolicies } from '../api/policies/useGetPolicies'

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [open, setOpen] = useState(false)
  const policiesData = useGetPolicies()
  // const offersData = useGetOffers()
  // const contractsData = useGetContracts()
  // // const datasourcesData = useGetDataSources()

  // useEffect(() => {
  //   const langSelected = localStorage.getItem('i18nextLng')
  //   if (langSelected) {
  //     i18next.changeLanguage(langSelected, () => {
  //       console.log('Language changed to:', langSelected)
  //     })
  //   } else {
  //     console.log('No language selected, defaulting to English')
  //   }
  // }, [])

  if (
    // offersData.isLoading ||
    // contractsData.isLoading ||
    // datasourcesData.isLoading ||
    policiesData.isLoading ||
    policiesData.isFetching
  ) {
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }

  return (
    <main className='h-screen flex flex-col gap-4 bg-gradient-to-br from-white via-gray-100 to-white'>
      <Drawer open={open} setOpen={setOpen} />
      <Header setOpen={setOpen} />
      {children}
    </main>
  )
}
