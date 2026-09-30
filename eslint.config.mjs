import eslintConfig from '@electron-toolkit/eslint-config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormattingConfig from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default withVueTs(
  {
    ignores: ['node_modules/**', 'dist/**', 'out/**', '.gitignore', '.mimosa/**', '.zcode/**']
  },
  eslintConfig,
  {
    files: [
      'eslint.config.mjs',
      'electron.vite.config.{js,ts,mjs,cjs}',
      'src/main/**/*.{js,ts}',
      'src/preload/**/*.{js,ts}'
    ],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['src/renderer/**/*.{js,jsx,mjs,ts,tsx,vue}'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  pluginVue.configs['flat/essential'],
  tseslint.configs.recommended,
  vueTsConfigs.recommended,
  {
    rules: {
      'vue/block-lang': 'off',
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  skipFormattingConfig,
  {
    files: ['src/renderer/src/env.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
)
