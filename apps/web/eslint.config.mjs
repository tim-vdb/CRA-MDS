import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/generated/**',
    ],
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: true },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  nextPlugin.configs['core-web-vitals'],

  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-html-link-for-pages': ['error', 'src/app'],
      '@next/next/no-img-element': 'error',
    },
  },
];

export default eslintConfig;
