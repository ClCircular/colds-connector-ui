export interface PolicyRow {
  name: string
  action: string
  restriction: string
  createdAt: Date
  actions: string
  id: string
}

export interface PolicyCreateResponse {
  message: string
  data: Policy
}

export interface Policy {
  policy_id: string
  name: string
  action: string
  created_at: Date
  policy_constraints: PolicyConstraints
}

export interface PolicyConstraints {
  type: string
  value: string
  operator: string
}

export interface CreatePolicyBody {
  name: string
  action: string
  policy_constraints: PolicyConstraints
}
