export interface AuditEntry {
  ts: Date
  action: string
  username: string
  resource_id: string
  metadata: null
}

export interface AuditRow {
  id: string
  action: string
  timestamp: Date
  details: string
}
