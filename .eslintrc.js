module.exports = {
  extends: 'airbnb-base',
  plugins: ['import', 'react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 'first',
          body: 1
        },
        FunctionExpression: {
          parameters: 'first',
          body: 1
        }
      }
    ],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'object-shorthand': [
      'warn',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],
    'arrow-body-style': [
      'off',
      'as-needed',
      {
        requireReturnForObjectLiteral: true
      }
    ],
    'class-methods-use-this': [
      'warn',
      {
        exceptMethods: []
      }
    ],
    'max-len': ['warn', 100],
    'no-nested-ternary': 'warn',
    'import/extensions': 'warn',
    'import/no-unresolved': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'no-useless-escape': 'warn',
    strict: 'warn',
    'no-plusplus': 'warn',
    'no-unused-vars': 'warn',
    'no-confusing-arrow': 'warn',
    'consistent-return': 'warn',
    'guard-for-in': 'warn',
    'spaced-comment': 'warn',
    'no-return-assign': ['warn', 'always'],
    'func-names': ['off', 'as-needed'],
    'arrow-parens': 'off',
    'space-before-function-paren': 'off',
    'no-else-return': 'off',
    camelcase: 'warn',
    'no-shadow': 'warn'
  },
  globals: {
    window: true,
    document: true,
    confirm: true
  }
};
