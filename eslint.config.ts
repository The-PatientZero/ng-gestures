import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
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
      ...prettierConfig.rules,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/jest.config.ts', '**/test-setup.ts'],
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
    ignores: ['node_modules/**', 'dist/**', '.angular/**', '.*', 'public/**', 'pnpm-lock.yaml'],
  },
];
