export interface Contract {
  contractId: string
  creationDate: string
  modificationDate: string
  title: string
  description: string
  start: string
  end: string
  rules: Rule[]
  offers: Offer[]
}

export interface Offer {
  title: string
  offerId: string
}

export interface Rule {
  title: string
  type: string
  ruleId: string
}
