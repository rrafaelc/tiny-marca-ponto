module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
