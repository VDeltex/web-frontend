import { Address } from "everscale-inpage-provider"

export type NetworkGroup = 'mainnet' | 'testnet' | 'fld' | 'rfld' | 'localnet' | string

export const USDT_DECIMALS = 6
export const PRICE__DECIMALS = 8
export const MULTIPLICATOR__DECIMALS = 3
export const FEE = 2500000000 

export const ROOT = new Address("0:71c83fe2ec8b1dbc776dfd6c224f4dc11472fb9291cca92d623730d2f1291608")
