export interface Participant {
  name: string
  did: string
  endpoint: string
  registered_at: string
  properties: {
    data_access: string
  }
}
