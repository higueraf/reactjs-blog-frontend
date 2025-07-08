module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: process.env.CYPRESS_COVERAGE ? ['istanbul'] : []
};