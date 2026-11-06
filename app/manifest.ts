import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sugar Alice',
    short_name: 'Sugar Alice',
    description:
      'AIケーキショップ。カップケーキ、アイスケーキなどおいしいケーキがたくさん!',
    start_url: '/',
    display: 'standalone',
    background_color: '#47704c',
    theme_color: '#47704c',
    icons: [
      {
        src: '/assets/common/ic_c_app_192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/common/ic_c_app-maskable_512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
