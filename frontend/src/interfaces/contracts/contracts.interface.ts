export interface Contract {
  contract_id: string
  name: string
  created_at: Date
  access_policy_id: string
  contract_policy_id: string
  asset_id: string
}

export interface CreateContractResponse {
  message: string
  data: Data
}

export interface Data {
  contract_id: string
  name: string
  created_at: Date
  access_policy_id: string
  contract_policy_id: string
  asset_id: string
}
