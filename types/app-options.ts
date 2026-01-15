/**
 * Type definitions untuk App Options
 */

export interface AppOption {
  name: string
  description: string
  email: string
  nohp: string
  address: string
}

export interface AppOptionsState {
  data: AppOption | null
  pending: boolean
  error: Error | null
}
