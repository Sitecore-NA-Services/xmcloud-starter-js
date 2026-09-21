import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

// eslint-config-next 16 ships native flat configs, so they are imported directly.
// Routing them through FlatCompat crashes config validation with
// "Converting circular structure to JSON" (the plugins.react object self-references).
const eslintConfig = [
  // A config object containing ONLY `ignores` is the global ignore list; combining
  // `ignores` with `rules` would instead just scope those rules.
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Don't force alt for <Image/> (sourced from Sitecore media)
      'jsx-a11y/alt-text': 'off',
    },
  },
];

export default eslintConfig;
