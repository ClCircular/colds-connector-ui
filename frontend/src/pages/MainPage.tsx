import { useTranslation } from 'react-i18next'
import { useGetCatalogs } from '../api/catalogs/useGetCatalogs'
import { useGetContracts } from '../api/contracts/useGetContracts'
// import { useGetDataSources } from '../api/datasources/useGetDataSources'
import { useGetOffers } from '../api/offers/useGetOffers'
import { NavigationCard } from '../components/NavigationCard'

export const MainPage = () => {
  const offersData = useGetOffers()
  const contractsData = useGetContracts()
  // const datasourcesData = useGetDataSources()
  const catalogsData = useGetCatalogs()
  const { t } = useTranslation()
  const cardsInfo = [
    {
      title: t('contracts'),
      description: `${contractsData.data?.length || 0} ${t('contracts')}(s)`,
      link: '/contracts'
    },
    {
      title: t('data_offers'),
      description: `${offersData.data?.length || 0} ${t('offer')}(s)`,
      link: '/data-offers'
    },
    {
      title: t('exchanges'),
      description: t('exchanges_card_description'),
      link: '/exchanges'
    },
    {
      title: t('catalogs'),
      description: `${catalogsData.data?.length || 0} ${t('catalog')}(s)`,
      link: '/catalogs'
    }
  ]

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 justify-items-center md:justify-items-stretch'>
      {cardsInfo.map((card) => (
        <NavigationCard
          key={card.title}
          title={card.title}
          description={card.description}
          link={card.link}
        />
      ))}
    </section>
  )
}
