import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Política de segurança de conteúdo (CSP) aplicada só no build de produção.
 * No `npm run dev` ela fica de fora porque o hot reload do Vite precisa de scripts inline.
 * Como o app não carrega nada de fora, tudo é restrito à própria origem.
 */
const cspPlugin = () => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: {
        'http-equiv': 'Content-Security-Policy',
        content:
          "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; " +
          "connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'",
      },
      injectTo: 'head-prepend',
    },
  ],
})

export default defineConfig({
  plugins: [react(), cspPlugin()],
  // Caminho relativo: o build funciona em qualquer subpasta (ex.: GitHub Pages).
  base: './',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
  },
})
