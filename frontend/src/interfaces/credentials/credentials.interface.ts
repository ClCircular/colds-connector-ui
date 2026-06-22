export interface Credential {
  credential_id: string
  holder_pid: string
  request_id: string
  issuance_date: Date
  credential_payload: string
  status: string
  credential_type: string
  issuer: string
  issuer_pid: string
  format: string
}

export interface CredentialJWTDecoded {
  vc?: Vc
}

export interface Vc {
  '@context': string[]
  id: string
  type: string[]
  issuer: string
  validFrom: Date
  validUntil: Date
  credentialSubject: JwtCredentialSubject
}

export interface JwtCredentialSubject {
  id: string
  accessLevel?: string
  level?: string
  role?: string
}
