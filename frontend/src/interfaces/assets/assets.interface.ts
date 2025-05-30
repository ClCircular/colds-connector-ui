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
