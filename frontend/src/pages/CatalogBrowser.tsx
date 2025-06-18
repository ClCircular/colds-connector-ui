import { useMemo, useState } from 'react'
import { useCatalogRequest } from '../api/negotiations/useCatalogRequest'
import { useRequestNegotiation } from '../api/negotiations/useRequestNegotiation'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthUser } from '../contexts/UserContext'
import { CatalogRequest } from '../interfaces/negotiations/negotiations.interface'
import { Loader } from '../components'

export const CatalogBrowser = () => {
  const [providerURL, setProviderURL] = useState('')
  const catalogRequestMuation = useCatalogRequest()

  const { t } = useTranslation()

  const { mutate } = useRequestNegotiation()

  const { user } = useAuthUser()

  const queryClient = useQueryClient()
  const data = useMemo(() => {
    return queryClient.getQueryData([
      'catalogRequests',
      user?.userId
    ]) as CatalogRequest[]
  }, [queryClient, catalogRequestMuation.data])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    catalogRequestMuation.mutate({
      providerURL: providerURL || 'https://host.docker.internal:19194'
    })
    // refetch is not strictly needed because useCatalogRequest will refetch on searchURL change
  }

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <form onSubmit={handleSearch} className='flex gap-2 mb-6 justify-end'>
        {/* <input
          type='text'
          placeholder={t('provider_url')}
          value={providerURL}
          onChange={(e) => setProviderURL(e.target.value)}
          className='w-sm border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
        /> */}
        <select
          id='asset_data_flow'
          className='appearance-none w-xs  border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
          value={providerURL}
          onChange={(e) => setProviderURL(e.target.value)}
          required
        >
          <option value=''>-- {t('select_provider')} --</option>
          <option value='https://host.docker.internal:19194'>
            https://host.docker.internal:19194
          </option>
        </select>
        <button
          type='submit'
          className='px-4 py-2 bg-[#94bf43] hover:bg-[#7a9e32] text-white rounded transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer'
          disabled={!providerURL}
        >
          {t('search')}
        </button>
      </form>

      {catalogRequestMuation.isPending && (
        <div className='text-center text-gray-500'>
          <Loader />
        </div>
      )}
      {catalogRequestMuation.isError && (
        <div className='text-center text-red-500'>
          Error al buscar el catálogo.
        </div>
      )}

      {data &&
        data.map((item) => {
          const assetsDataInCatalog =
            item.dataset?.map((asset) => ({
              name: asset.name,
              description: asset.description,
              version: asset.properties?.version,
              distributions: asset.distribution?.map((dist) => ({
                format: dist.format
              })),
              policies: asset.hasPolicy?.map((policy) => ({
                id: policy['@id']?.split(':').pop(),
                permissions: policy.permission?.map((perm) => ({
                  action: perm.action,
                  constraint: perm.constraint?.map((constraint) => ({
                    leftOperand: constraint.leftOperand,
                    operator: constraint.operator,
                    rightOperand: constraint.rightOperand
                  }))
                }))
              }))
            })) || []
          return (
            <div
              className='rounded-lg p-4 bg-white shadow-md w-md'
              key={item['@id']}
            >
              {assetsDataInCatalog.map((asset) => (
                <div key={asset.name} className='mb-6'>
                  <h2 className='text-lg font-semibold'>{asset.name}</h2>
                  <p className='text-gray-600 mb-2'>
                    {asset.description || 'No description available'}
                  </p>
                  <p className='text-gray-500 mb-4'>
                    {t('version')}: {asset.version || 'N/A'}
                  </p>
                  <h3 className='text-md font-semibold mb-2'>
                    {t('distributions')}:
                  </h3>
                  <ul className='list-disc pl-5 mb-4'>
                    {asset.distributions?.map((dist, distIndex) => (
                      <li key={distIndex} className='text-gray-600'>
                        {dist.format || 'No format available'}
                      </li>
                    ))}
                  </ul>
                  <h3 className='text-md font-semibold mb-2'>
                    {t('policies')}:
                  </h3>
                  <ul className='list-disc pl-5 mb-4'>
                    {asset.policies?.map((policy, policyIndex) => (
                      <li key={policyIndex} className='text-gray-600 mb-2'>
                        <strong>Policy ID:</strong> {policy.id || 'N/A'}
                        <ul className='list-disc pl-5 mt-2'>
                          {policy.permissions?.map((perm, permIndex) => (
                            <li key={permIndex}>
                              <strong>Action:</strong> {perm.action}
                              <ul className='list-disc pl-5 mt-1'>
                                {perm.constraint?.map(
                                  (constraint, constraintIndex) => (
                                    <li key={constraintIndex}>
                                      {constraint.leftOperand}{' '}
                                      {constraint.operator}{' '}
                                      {constraint.rightOperand}
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  <h3 className='text-md font-semibold mb-2'>
                    {t('provider_url')}:
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    {item.service?.endpointURL || 'No provider URL available'}
                  </p>
                  <button
                    onClick={() =>
                      mutate({
                        data: {
                          providerURL: item.service?.endpointURL || '',
                          contractId: asset.policies?.[0]?.id || '',
                          assetId: asset.name,
                          permissions: asset.policies?.[0]?.permissions || []
                        }
                      })
                    }
                    className='mt-4 px-4 py-2 text-white rounded transition-colors bg-[#94bf43] hover:bg-[#7a9e32] disabled:bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer'
                  >
                    {t('negotiate')}
                  </button>
                </div>
              ))}
            </div>
          )
        })}
    </section>
  )
}
