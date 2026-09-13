import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**'],
  },
  ...nextCoreWebVitals,
  prettier,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      // Next 16 で厳格化した hooks ルール。既存コードの段階的対応まで warn
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
]

export default eslintConfig
