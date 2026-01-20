/**
 * Type definitions untuk App Options
 */

export interface AppOption {
  name: string
  nameKet: string
  description: string
  unitName: string
  unitDesc: string
  email: string
  nohp: string
  address: string
}

export interface AppOptionsState {
  data: AppOption | null
  pending: boolean
  error: Error | null
}
