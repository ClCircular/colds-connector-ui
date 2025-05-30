// import { useTranslation } from 'react-i18next'
// import { useGetContracts } from '../api/contracts/useGetContracts'
// // import { useGetDataSources } from '../api/datasources/useGetDataSources'
// // import { useGetOffers } from '../api/offers/useGetOffers'
// import { NavigationCard } from '../components/NavigationCard'
// import { useGetPolicies } from '../api/policies/useGetPolicies'

import {
  IoAdd,
  IoDocuments,
  IoFileTrayFull,
  IoPieChart,
  IoShieldCheckmark
} from 'react-icons/io5'
import { useGetContracts } from '../api/contracts/useGetContracts'
import { useGetPolicies } from '../api/policies/useGetPolicies'
import { useGetAssets } from '../api/assets/useGetAssets'

// export const MainPage = () => {
//   // const offersData = useGetOffers()
//   const contractsData = useGetContracts()
//   const policiesData = useGetPolicies()
//   // const datasourcesData = useGetDataSources()
//   const { t } = useTranslation()
//   const cardsInfo = [
//     {
//       title: t('contracts'),
//       description: `${contractsData.data?.length || 0} ${t('contracts')}(s)`,
//       link: '/contracts'
//     },
//     // {
//     //   title: t('data_offers'),
//     //   description: `${offersData.data?.length || 0} ${t('offer')}(s)`,
//     //   link: '/data-offers'
//     // },
//     // {
//     //   title: t('exchanges'),
//     //   description: t('exchanges_card_description'),
//     //   link: '/exchanges'
//     // },
//     {
//       title: t('policies'),
//       description: `${policiesData.data?.length} ${t('policies')}`,
//       link: '/policies'
//     },
//     {
//       title: t('assets'),
//       description: `${t('assets')}`,
//       link: '/assets'
//     }
//   ]

//   return (
//     <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 justify-items-center md:justify-items-stretch'>
//       {cardsInfo.map((card) => (
//         <NavigationCard
//           key={card.title}
//           title={card.title}
//           description={card.description}
//           link={card.link}
//         />
//       ))}
//     </section>
//   )
// }

// V2

export const MainPage = () => {
  const contractsData = useGetContracts()
  const policiesData = useGetPolicies()
  const assetsData = useGetAssets()

  return (
    <div className='grid grid-cols-12 grid-rows-12 gap-6 h-full p-4 '>
      {/* Resumen General */}
      <div className='col-span-6 row-span-6 bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center gap-4'>
        <div className='bg-blue-100 p-4 rounded-full'>
          <IoPieChart className='text-blue-600 text-4xl' />
        </div>
        <h2 className='text-3xl font-extrabold text-gray-800'>
          Resumen General
        </h2>
        <div className='flex flex-col gap-1 text-lg'>
          <span>
            <strong>{contractsData.data?.length || 0}</strong> Contratos
          </span>
          <span>
            <strong>{policiesData.data?.length || 0}</strong> Políticas
          </span>
          <span>
            <strong>{assetsData.data?.length || 0}</strong> Recursos
          </span>
        </div>
      </div>

      {/* Últimos Contratos */}
      <div className='col-span-4 row-span-6 col-start-1 row-start-7 bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center gap-4'>
        <div className='bg-indigo-100 p-4 rounded-full'>
          <IoFileTrayFull className='text-indigo-600 text-4xl' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Últimos Contratos</h2>
        <ul className='w-full'>
          {contractsData.data?.slice(0, 5).map((contract) => (
            <li key={contract.contractId} className='text-gray-700 mb-2'>
              {contract.title}
            </li>
          )) || (
            <li className='text-gray-500 text-center'>
              No hay contratos recientes
            </li>
          )}
        </ul>
      </div>

      {/* Gráfico */}
      <div className='col-span-5 row-span-6 col-start-5 row-start-7 bg-white shadow-lg rounded-2xl p-5 flex items-center justify-center'>
        {/* Aquí va el chart con Recharts */}
        <p className='text-gray-500'>Aquí va el chart</p>
      </div>

      {/* Acciones Rápidas */}
      <div className='col-span-3 row-span-5 col-start-10 row-start-8 bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center gap-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Acciones Rápidas</h2>
        <div className='flex flex-col gap-3 w-full'>
          <button className='bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center gap-2 justify-center'>
            <IoAdd /> Crear Política
          </button>
          <button className='bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 flex items-center gap-2 justify-center'>
            <IoAdd /> Crear Contrato
          </button>
          <button className='bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 flex items-center gap-2 justify-center'>
            <IoAdd /> Crear Recurso
          </button>
        </div>
      </div>

      {/* Últimas Políticas */}
      <div className='col-span-3 row-span-7 col-start-10 row-start-1 bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center gap-4'>
        <div className='bg-green-100 p-4 rounded-full'>
          <IoShieldCheckmark className='text-green-600 text-4xl' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Últimas Políticas</h2>
        <ul className='w-full'>
          {policiesData.data && policiesData.data?.length > 0 ? (
            policiesData.data?.slice(0, 5).map((policy) => (
              <li key={policy.policy_id} className='text-gray-700 mb-2'>
                {policy.name}
              </li>
            ))
          ) : (
            <li className='text-gray-500 text-center'>
              No hay políticas recientes
            </li>
          )}
        </ul>
      </div>

      {/* Últimos Recursos */}
      <div className='col-span-3 row-span-6 col-start-7 row-start-1 bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center gap-4'>
        <div className='bg-yellow-100 p-4 rounded-full'>
          <IoDocuments className='text-yellow-600 text-4xl' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Últimos Recursos</h2>
        <ul className='w-full'>
          {assetsData.data && assetsData.data.length > 0 ? (
            assetsData.data?.slice(0, 5).map((resource) => (
              <li
                key={resource.asset_id}
                className='text-gray-700 mb-2 text-lg'
              >
                {resource.name}
              </li>
            ))
          ) : (
            <li className='text-gray-500 text-center'>
              No hay recursos recientes
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
