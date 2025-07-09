const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    baseUrl: "http://localhost:5173",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
