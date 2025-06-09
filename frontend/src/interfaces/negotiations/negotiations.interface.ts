// export interface NegotiationRequestResponse {
//   cn_id: string
//   connector_role: string
//   provider_pid: string
//   consumer_pid: string
//   created_at: Date
//   updated_at: Date
//   signed_at: null
//   contract_id: null
//   external_contract_id: string
//   provider_address: string
//   consumer_address: string
//   cn_state: string
//   agreement_id: null
// }
export interface Negotiation {
  cn_id: string
  connector_role: string
  provider_pid: string
  consumer_pid: string
  created_at: Date
  updated_at: Date
  signed_at: null
  contract_id: string
  external_contract_id: null
  provider_address: string
  consumer_address: string
  cn_state: string
  agreement_id: null
}

export interface CatalogRequest {
  '@type': string
  '@context': string[]
  '@id': string
  participantId: string
  dataset: Dataset[]
  service: Service
}

export interface Dataset {
  '@id': string
  '@type': string
  hasPolicy: HasPolicy[]
  distribution: Distribution[]
}

export interface Distribution {
  '@type': string
  format: string
  accessService: string
}

export interface HasPolicy {
  '@id': string
  '@type': string
  permission: Permission[]
}

export interface Permission {
  action: string
  constraint: Constraint[]
}

export interface Constraint {
  leftOperand: string
  operator: string
  rightOperand: string
}

export interface Service {
  '@id': string
  '@type': string
  endpointURL: string
}

export interface RequestNegotiationBody {
  providerURL: string
  contractId: string
  assetId: string
  permissions: Permission[]
}

export interface Permission {
  action: string
  constraint: Constraint[]
}

export interface Constraint {
  leftOperand: string
  operator: string
  rightOperand: string
}

export interface NegotiationRow {
  contractName: string
  provider: string
  signingDate: Date | null
  contractId: string
  negotiationId: string
  transfer: string
}
