export interface Credential {
  credential_id: string
  holder_pid: string
  request_id: string
  issuance_date: Date
  credential_payload: CredentialPayload
  status: string
  credential_type: string
  issuer: string
  issuer_pid: string
  format: string
}

export interface CredentialPayload {
  id: string
  type: string[]
  proof: Proof
  issuer: string
  '@context': string[]
  issuanceDate: Date
  credentialSubject: CredentialSubject
}

export interface CredentialSubject {
  id: string
  level?: string
  role?: string
}

export interface Proof {
  jwt: string
  type: string
  created: Date
  proofPurpose: string
  verificationMethod: string
}
