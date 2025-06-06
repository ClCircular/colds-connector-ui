import { useMemo, useState } from 'react'
import { useCatalogRequest } from '../api/negotiations/useCatalogRequest'
import { Loader } from '../components'
import { useGetAssets } from '../api/assets/useGetAssets'
import { useRequestNegotiation } from '../api/negotiations/useRequestNegotiation'

export const CatalogBrowser = () => {
  const [providerURL, setProviderURL] = useState('')
  const [searchURL, setSearchURL] = useState('')
  const { data, isLoading, isError } = useCatalogRequest(searchURL)

  const assetsData = useGetAssets()

  const { mutate } = useRequestNegotiation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchURL(providerURL)
    // refetch is not strictly needed because useCatalogRequest will refetch on searchURL change
  }

  const assetsDataInCatalog = useMemo(() => {
    if (!assetsData.data || !data) return []

    const assetIds = data.dataset?.map((item) => item['@id']?.split(':').pop())
    return assetsData.data.filter((asset) => assetIds?.includes(asset.asset_id))
  }, [assetsData.data, data])

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <form onSubmit={handleSearch} className='flex gap-2 mb-6 justify-end'>
        <input
          type='text'
          placeholder='Provider URL'
          value={providerURL}
          onChange={(e) => setProviderURL(e.target.value)}
          className='w-sm border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
        />
        <button
          type='submit'
          className='px-4 py-2 bg-[#94bf43] hover:bg-[#7a9e32] text-white rounded transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer'
          disabled={!providerURL}
        >
          Buscar
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
          <h2 className='text-lg font-semibold mb-4 text-black'>
            Catálogo de Servicios
          </h2>
          {/* <h3>
            {
              assetsData.data?.find(
                (item) =>
                  item.asset_id === data.dataset?.[0]?.['@id']?.split(':').pop()
              )?.name
            }
          </h3> */}
          {assetsDataInCatalog.map((asset) => (
            <>
              <h3 key={asset.asset_id}>{asset.name}</h3>
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
                } /* Handle negotiation logic here */
                className='mt-4 px-4 py-2 text-white rounded transition-colors bg-[#94bf43] hover:bg-[#7a9e32] disabled:bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer'
              >
                Negotiate
              </button>
            </>
          ))}
        </div>
      )}
    </section>
  )
}
