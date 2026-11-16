import type { ar } from './ar'

type Strings<T> = { [K in keyof T]: T[K] extends string ? string : Strings<T[K]> }

/** The shape every language file must have: the Arabic keys, any string values. */
export type Messages = Strings<typeof ar>
