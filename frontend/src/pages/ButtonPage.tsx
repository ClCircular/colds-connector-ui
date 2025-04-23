import { useState } from 'react'
import { Loader } from '../components/Loader'

export const ButtonPage = () => {
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const jimenaFunciton = async () => {
    setLoading(true)
    setResponse('')
    setError('')
    console.log('Jimena function')
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
    console.log(url)
    console.log(requestOptions)
    try {
      const response = await fetch(url, requestOptions)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.log({ error })
      setError('Error al llamar a la API')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex items-center justify-center h-full w-full'>
      <button
        onClick={jimenaFunciton}
        className='rounded-md bg-blue-500 py-2 px-4 text-white hover:scale-105 transition-transform hover:bg-blue-600 cursor-pointer'
      >
        {loading ? <Loader /> : `Llamar API`}
      </button>
      {response && (
        <p className='mt-4 text-center'>{JSON.stringify(response)}</p>
      )}
      {error && <p className='mt-4 text-red-500'>{error}</p>}
    </div>
  )
}
