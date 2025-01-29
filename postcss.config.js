module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  performance: {
    maxEntrypointSize: 1000000, // e.g., 1MB
    maxAssetSize: 1000000,
  },
  devtool: 'source-map',
};