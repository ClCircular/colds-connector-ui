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
  const cardsInfo = [
    {
      title: 'Políticas',
      description: `Consulta las políticas de datos abiertos `,
      link: '/politics'
    },
    {
      title: 'Contratos',
      description: `${contractsData.data?._embedded?.contracts.length} Contrato(s)`,
      link: '/contracts'
    },
    {
      title: 'Conexiones de Datos',
      description: 'Consulta las conexiones de datos abiertos',
      link: '/data-connections'
    },
    {
      title: 'Datos Ofrecidos',
      description: `${offersData.data?._embedded?.resources.length} Oferta(s)`,
      link: '/offered-data'
    },
    {
      title: 'Intercambios',
      description: 'Consulta los intercambios de datos abiertos',
      link: '/exchanges'
    },
    {
      title: 'Catalogos',
      description: `${catalogsData.data?._embedded?.catalogs.length} Catalogo(s)`,
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
