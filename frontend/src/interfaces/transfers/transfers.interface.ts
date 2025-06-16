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
  data_plane_id: string | null
  transfer_format: string
  data_address: DataAddress | null
}

export interface DataAddress {
  '@type': string
  endpoint: string
  endpointType: string
}

export interface TransfersTableRow {
  negotiation: string
  agreement_id: string // para el enlace
  createdAt: Date
  transfer_state: string
  transfer_format: string // PULL / PUSH
}
