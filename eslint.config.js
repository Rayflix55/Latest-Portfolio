import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist', 'dist-server'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off'
    }
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  // React Bits components are vendored as-shipped.
  {
    files: ['src/components/PatternWaves.jsx', 'src/components/ParticleText.jsx'],
    rules: { 'react-hooks/exhaustive-deps': 'off', 'no-unused-vars': 'off' }
  }
];
