import { useMemo, useState } from 'react'
import { useCatalogRequest } from '../api/negotiations/useCatalogRequest'
import { Loader } from '../components'
import { useRequestNegotiation } from '../api/negotiations/useRequestNegotiation'
import { useTranslation } from 'react-i18next'

export const CatalogBrowser = () => {
  const [providerURL, setProviderURL] = useState('')
  const [searchURL, setSearchURL] = useState('')
  const { data, isLoading, isError } = useCatalogRequest(searchURL)

  const { t } = useTranslation()

  const { mutate } = useRequestNegotiation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchURL(providerURL)
    // refetch is not strictly needed because useCatalogRequest will refetch on searchURL change
  }

  const assetsDataInCatalog = useMemo(() => {
    if (!data) return []

    const assets = data.dataset?.map((item) => ({
      name: item.name,
      description: item.description,
      version: item.properties?.version,
      distributions: item.distribution?.map((dist) => ({
        format: dist.format
      })),
      policies: item.hasPolicy?.map((policy) => ({
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
    }))
    return assets || []
  }, [data])

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <form onSubmit={handleSearch} className='flex gap-2 mb-6 justify-end'>
        <input
          type='text'
          placeholder={t('provider_url')}
          value={providerURL}
          onChange={(e) => setProviderURL(e.target.value)}
          className='w-sm border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
        />
        <button
          type='submit'
          className='px-4 py-2 bg-[#94bf43] hover:bg-[#7a9e32] text-white rounded transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer'
          disabled={!providerURL}
        >
          {t('search')}
        </button>
      </form>

      {isLoading && (
        <div className='text-center text-gray-500'>
          <Loader />
        </div>
      )}
      {isError && (
        <div className='text-center text-red-500'>
          Error al buscar el catálogo.
        </div>
      )}

      {data && (
        <div className='rounded-lg p-4 bg-white shadow-md w-md'>
          {/* <h3>
            {
              assetsData.data?.find(
                (item) =>
                  item.asset_id === data.dataset?.[0]?.['@id']?.split(':').pop()
              )?.name
            }
          </h3> */}
          {/* {assetsDataInCatalog.map((asset) => (
            <>
              <h2 className='text-lg' key={asset.asset_id}>
                {asset.name}
              </h2>
              <p className='text-gray-600 mb-2'>
                {asset.description || 'No description available'}
              </p>
              <p className='text-gray-500 mb-4'>Asset ID: {asset.asset_id}</p>
              <button
                onClick={() =>
                  mutate({
                    data: {
                      providerURL: data.service?.endpointURL || '',
                      contractId:
                        data.dataset?.[0].hasPolicy?.[0]?.['@id']
                          ?.split(':')
                          .pop() || '',
                      assetId: asset.asset_id,
                      permissions:
                        data.dataset?.[0]?.hasPolicy?.[0]?.permission || []
                    }
                  })
                }
                className='mt-4 px-4 py-2 text-white rounded transition-colors bg-[#94bf43] hover:bg-[#7a9e32] disabled:bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer'
              >
                Negotiate
              </button>
            </>
          ))} */}
          {assetsDataInCatalog.map((asset, index) => (
            <div key={index} className='mb-6'>
              <h2 className='text-lg font-semibold'>{asset.name}</h2>
              <p className='text-gray-600 mb-2'>
                {asset.description || 'No description available'}
              </p>
              <p className='text-gray-500 mb-4'>
                Version: {asset.version || 'N/A'}
              </p>
              <h3 className='text-md font-semibold mb-2'>Distributions:</h3>
              <ul className='list-disc pl-5 mb-4'>
                {asset.distributions?.map((dist, distIndex) => (
                  <li key={distIndex} className='text-gray-600'>
                    {dist.format || 'No format available'}
                  </li>
                ))}
              </ul>
              <h3 className='text-md font-semibold mb-2'>Policies:</h3>
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
                                  {constraint.leftOperand} {constraint.operator}{' '}
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
              <button
                onClick={() =>
                  mutate({
                    data: {
                      providerURL: data.service?.endpointURL || '',
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
      )}
    </section>
  )
}
