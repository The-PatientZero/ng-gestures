import js from '@eslint/js';
import angularEslint from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import angularParser from '@angular-eslint/template-parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        EventTarget: 'readonly',
        Event: 'readonly',
        UIEvent: 'readonly',
        PointerEvent: 'readonly',
        TouchEvent: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        WheelEvent: 'readonly',
        Touch: 'readonly',
        TouchList: 'readonly',
        Node: 'readonly',
        Element: 'readonly',
        Window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        global: 'readonly',
        FrameRequestCallback: 'readonly',
        AddEventListenerOptions: 'readonly',
        ClipboardEvent: 'readonly',
        CompositionEvent: 'readonly',
        FocusEvent: 'readonly',
        FormDataEvent: 'readonly',
        AnimationEvent: 'readonly',
        TransitionEvent: 'readonly',
        DragEvent: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angularEslint,
    },
    rules: {
      'no-console': 'off',
      'default-case': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
      '@typescript-eslint/semi': ['error', 'always'],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      ...prettierConfig.rules,
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.*', 'public/**', 'pnpm-lock.yaml'],
  },
];
