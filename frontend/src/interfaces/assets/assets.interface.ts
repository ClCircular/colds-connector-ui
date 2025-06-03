export interface AssetsResponse {
  asset_id: string
  name: string
  description: string
  created_at: Date
  updated_at: Date
  data_source: DataSource
  properties: Properties
}

export interface DataSource {
  flow: string
  type: string
  source: string
}

export interface Properties {
  version: string
}

export interface CreateAssetBody {
  name: string
  description: string
  data_source: DataSource
  properties: Properties
}

export interface DataSource {
  type: string
  flow: string
  source: string
}

export interface Properties {
  version: string
}

export interface AssetCreatedResponse {
  message: string
  data: Data
}

export interface Data {
  asset_id: string
  name: string
  description: string
  created_at: Date
  updated_at: Date
  data_source: DataSource
  properties: Properties
}

export interface DataSource {
  flow: string
  type: string
  source: string
}

export interface Properties {
  version: string
}

export interface AssetRow {
  id: string
  name: string
  description: string
  type: string
  flow: string
  source: string
  version: string
  createdAt: Date
  updatedAt: Date
}
