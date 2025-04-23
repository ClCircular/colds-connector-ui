import { Card } from '../components/Card'

export const MainPage = () => {
  const cardsInfo = [
    {
      title: 'Políticas',
      description: 'Consulta las políticas de datos abiertos',
      link: '/politics'
    },
    {
      title: 'Contratos',
      description: 'Consulta los contratos de datos abiertos',
      link: '/contracts'
    },
    {
      title: 'Conexiones de Datos',
      description: 'Consulta las conexiones de datos abiertos',
      link: '/data-connections'
    },
    {
      title: 'Datos Ofrecidos',
      description: 'Consulta los datos ofrecidos por el gobierno',
      link: '/offered-data'
    },
    {
      title: 'Intercambios',
      description: 'Consulta los intercambios de datos abiertos',
      link: '/exchanges'
    }
  ]
  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 justify-items-center md:justify-items-stretch'>
      {cardsInfo.map((card) => (
        <Card
          key={card.title}
          title={card.title}
          description={card.description}
          link={card.link}
        />
      ))}
    </section>
  )
}
