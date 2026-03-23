import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import boundariesPlugin from 'eslint-plugin-boundaries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
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
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
      boundaries: boundariesPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          mode: 'full',
          type: 'shared',
          pattern: [
            'src/components/**/*',
            'src/lib/**/*',
            'src/context/**/*',
            'src/prisma/**/*',
            'src/generated/**/*',
          ],
        },
        {
          mode: 'full',
          type: 'feature',
          capture: ['featureName'],
          pattern: ['src/features/*/**/*'],
        },
        {
          mode: 'full',
          type: 'app',
          capture: ['_', 'fileName'],
          pattern: ['src/app/**/*'],
        },
        {
          mode: 'full',
          type: 'neverImport',
          pattern: ['src/*', 'src/tasks/**/*'],
        },
      ],
    },
    rules: {
      // Import rules
      'import/order': 'off', // Désactivé pour éviter les conflits de sauvegarde
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',

      // React rules
      'react/no-unescaped-entities': 'off',

      // Next.js rules
      '@next/next/no-html-link-for-pages': ['error', 'src/app'],
      '@next/next/no-img-element': 'error',

      // Boundaries rules
      'boundaries/no-unknown': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['shared'],
              allow: [
                'shared',
                // Exception pour uploadthing types
                ['app', { _: 'api/uploadthing', fileName: 'core.ts' }],
              ],
            },
            {
              from: ['feature'],
              allow: [
                'shared',
                [
                  'feature',
                  {
                    featureName: '${from.featureName}',
                  },
                ],
              ],
            },
            {
              from: ['app', 'neverImport'],
              allow: ['shared', 'feature'],
            },
            {
              from: ['app'],
              allow: [
                'shared',
                'feature',
                // Fichiers Next.js spéciaux + css
                ['app', { fileName: 'unauthorized.tsx' }],
                ['app', { fileName: 'not-found.tsx' }],
                ['app', { fileName: 'loading.tsx' }],
                ['app', { fileName: 'error.tsx' }],
                ['app', { fileName: 'global-error.tsx' }],
                ['app', { fileName: 'template.tsx' }],
                ['app', { fileName: 'default.tsx' }],
                ['app', { fileName: 'page.tsx' }],
                ['app', { fileName: 'layout.tsx' }],
                ['app', { fileName: '*.css' }],
                // Exception pour uploadthing types
                ['app', { _: 'api/uploadthing', fileName: 'core.ts' }],
              ],
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
