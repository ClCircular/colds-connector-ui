import { useQuery } from '@tanstack/react-query'

export interface Contract {
  contractId: string
  creationDate: string
  modificationDate: string
  title: string
  description: string
  start: string
  end: string
  rules: Rule[]
  offers: Offer[]
}

export interface Offer {
  title: string
  offerId: string
}

export interface Rule {
  title: string
  type: string
  ruleId: string
}

export const getContracts = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/api/contracts'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`
  console.log({ url, requestOptions })
  try {
    const response = await fetch(url, requestOptions)
    const data = await response.json()
    console.log({ data })
    return data as Contract[]
  } catch (error) {
    console.log({ error })
    throw new Error('Error al llamar a la API')
  }
}

export const useGetContracts = () => {
  const offersData = useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return offersData
}
