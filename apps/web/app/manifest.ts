import type { MetadataRoute } from 'next'
import { messages } from '@forsa/shared/messages'

/** Lets phones add Forsa to the home screen with its own icon and colours. Arabic first, like the site. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: messages.ar.meta.title,
    short_name: messages.ar.meta.title,
    description: messages.ar.meta.description,
    lang: 'ar',
    dir: 'rtl',
    start_url: '/ar',
    scope: '/',
    display: 'standalone',
    background_color: '#F4EFE6',
    theme_color: '#F4EFE6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
