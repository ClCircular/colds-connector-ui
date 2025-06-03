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
  data: Contract
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

export interface CreateContractBody {
  name: string
  access_policy_id: string
  contract_policy_id: string
  asset_id: string
}

export interface ContractRow {
  name: string
  accessPolicyName: string
  contractPolicyName: string
  assetName: string
  id: string
}
