// Lint for the shared package, the Supabase tests and the scripts. The web app has its own config
// (apps/web/eslint.config.mjs) with the Next.js rules.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['**/node_modules/**', 'apps/web/**', '**/.next/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly' } },
  },
)
