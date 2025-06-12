export interface Transfer {
  transfer_id: string
  agreement_id: string
  provider_pid: string
  consumer_pid: string
  created_at: Date
  updated_at: Date
  provider_address: string
  consumer_address: string
  transfer_state: string
  data_plane_id: string
  transfer_format: string
  data_address: DataAddress
}

export interface DataAddress {
  '@type': string
  endpoint: string
  endpointType: string
}

export interface TransfersTableRow {
  transfer_id: string
  agreement_id: string
  created_at: string
}

export interface TransferRequestResponse {}
