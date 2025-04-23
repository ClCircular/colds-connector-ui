import { Card } from '../components/Card'

export const MainPage = () => {
  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 justify-items-center md:justify-items-stretch'>
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </section>
  )
}
