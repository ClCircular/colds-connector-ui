import { useGetAssets } from '../../api/assets/useGetAssets'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { CreateAssetBody } from '../../interfaces/assets/assets.interface'
import { useCreateAsset } from '../../api/assets/useCreateAsset'
import { useUpdateAsset } from '../../api/assets/useUpdateAsset'

export const useAssetForm = ({
  onClose,
  assetId
}: {
  assetId?: string
  onClose: () => void
}) => {
  const assetsData = useGetAssets()

  const { mutateAsync: createAsset } = useCreateAsset()
  const { mutateAsync: updateAsset } = useUpdateAsset()

  const { t } = useTranslation()

  const schema = yup.object().shape({
    name: yup.string().required(t('name_required')),
    description: yup.string().required(t('description_required')),
    data_source: yup.object().shape({
      type: yup.string().required(t('data_source_type_required')),
      flow: yup.string().required(t('data_source_flow_required')),
      source: yup.string().required(t('data_source_source_required'))
    }),
    properties: yup.object().shape({
      version: yup.string().required(t('properties_version_required'))
      // Add more properties as needed
    })
  })

  const assetForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      data_source: {
        type: '',
        flow: '',
        source: ''
      },
      properties: {
        version: '1.0'
      }
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (assetId) {
      const existingAsset = assetsData.data?.find(
        (asset) => asset.asset_id === assetId
      )
      if (existingAsset) {
        assetForm.reset({
          name: existingAsset.name,
          description: existingAsset.description,
          data_source: {
            type: existingAsset.data_source.type,
            flow: existingAsset.data_source.flow,
            source: existingAsset.data_source.source
          },
          properties: {
            version: existingAsset.properties.version
          }
        })
      }
    } else {
      assetForm.reset({
        name: '',
        description: '',
        data_source: {
          type: '',
          flow: '',
          source: ''
        },
        properties: {
          version: '1.0'
        }
      })
    }
  }, [assetId, assetsData.data])

  const onSubmit = async (
    data: CreateAssetBody,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.stopPropagation()
    if (assetId) {
      // aqui ira el editar el asset
      await updateAsset({ assetId, newAssetData: data })
      assetForm.reset()
    } else {
      // aqui ira el crear el asset
      await createAsset({ assetData: data })
      assetForm.reset()
    }
    onClose()
  }

  return { assetForm, onSubmit }
}
