import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { toast } from 'sonner'

const requestOptions = (body: string, url: string) => ({
  method: 'POST',
  body: JSON.stringify({
    type: 'POST',
    url,
    body
  }),
  headers: {
    'Content-Type': 'application/json'
  }
})
export const createContractWithRule = async (data: {
  title: string
  description: string
  startDate: string
  endDate: string
  accessPolicy: string
}) =>
  // offerId: string
  {
    const url = `http://localhost:8083`

    // 1. Obtener política base
    //   const policy = await post('/v1/examples/policy', { type: 'PROVIDE_ACCESS' })
    const policyJson = await fetch(
      url,
      requestOptions(
        JSON.stringify({ type: 'PROVIDE_ACCESS' }),
        '/v1/examples/policy'
      )
    )
    const policy = await policyJson.json()
    console.log({ policy, policyJson: JSON.stringify(policy) })

    // 2. Crear regla
    //   const ruleRes = await post('/v1/rules', policy)
    const ruleJson = await fetch(
      url,
      requestOptions(JSON.stringify(policy), '/v1/rules')
    )
    const rawText = await ruleJson.text()
    console.log('⬇️ RESPUESTA COMPLETA DEL BACKEND')
    console.log(rawText)
    const ruleRes = await ruleJson.json()
    console.log({ ruleRes })
    const ruleId = ruleRes._links.self.href

    // 3. Crear contrato
    //   const contractRes = await post('/v1/contracts', {
    //     title: 'Contrato de acceso a datos',
    //     description: 'Permite el uso de los datos',
    //     start: now,
    //     end: '2025-12-31T23:59:59Z'
    //   })
    const contractJson = await fetch(
      url,
      requestOptions(
        JSON.stringify({
          title: data.title,
          description: data.description,
          start: dayjs(data.startDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          end: dayjs(data.endDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          accessPolicy: data.accessPolicy
        }),
        '/v1/contracts'
      )
    )
    const contractRes = await contractJson.json()
    const contractId = contractRes._links.self.href

    console.log({ contractRes, contractId, ruleId })

    // 4. Asociar regla al contrato
    //   await post(`/v1/contracts/${getId(contractId)}/rules`, [ruleId])
    await fetch(
      url,
      requestOptions(
        JSON.stringify([ruleId]),
        `/v1/contracts/${contractId}/rules`
      )
    )

    // 5. Enlazar contrato con oferta
    //   await post(`/v1/offers/${offerId}/contracts`, [contractId])

    return { contractId, ruleId }
  }

export const useCreateContractWithRule = () => {
  const mutation = useMutation({
    mutationFn: createContractWithRule,
    // offerId
    onSuccess: () => {
      toast.success('Contrato creado y enlazado correctamente')
    },
    onError: (err) => {
      console.log('Error creating contract', err)
      toast.error('Error al crear contrato')
    }
  })

  return mutation
}
