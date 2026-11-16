import { notFound } from 'next/navigation'

/** Any unknown address under a language shows that language's not-found page. */
export default function CatchAll() {
  notFound()
}
