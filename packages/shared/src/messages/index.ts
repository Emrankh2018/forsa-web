import type { Locale } from '../locale'
import { ar } from './ar'
import { en } from './en'
import type { Messages } from './types'

export type { Messages }
export const messages: Record<Locale, Messages> = { ar, en }
