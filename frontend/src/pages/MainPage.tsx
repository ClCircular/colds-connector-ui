import { useGetContracts } from '../api/contracts/useGetContracts'
import { useGetPolicies } from '../api/policies/useGetPolicies'
import { useGetAssets } from '../api/assets/useGetAssets'
import { useTranslation } from 'react-i18next'
import { NavigationCard } from '../components'
import { useGetNegotiations } from '../api/negotiations/useGetNegotiations'
import { useGetTransfers } from '../api/transfers/useGetTransfers'

export const MainPage = () => {
  const contractsData = useGetContracts()
  const policiesData = useGetPolicies()
  const assets = useGetAssets()
  const negotiationsData = useGetNegotiations()
  const transfersHistoryData = useGetTransfers()
  const { t } = useTranslation()
  const cardsInfo = [
    {
      title: t('contracts'),
      description: `${contractsData.data?.length || 0} ${t('contracts')}(s)`,
      link: '/contracts'
    },
    {
      title: t('policies'),
      description: `${policiesData.data?.length} ${t('policies')}`,
      link: '/policies'
    },
    {
      title: t('assets'),
      description: `${assets.data?.length || 0} ${t('assets')}`,
      link: '/assets'
    },
    //negotiations
    {
      title: t('negotiations'),
      description: `${negotiationsData.data?.length || 0} ${t('negotiations')}`,
      link: '/negotiations'
    },
    {
      title: t('transfers_history'),
      description: `${transfersHistoryData.data?.length || 0} ${t(
        'transfers_history'
      )}`,
      link: '/transfers-history'
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
