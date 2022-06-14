module.exports = {
  apps: [
    {
      name: "nextjs-mui",
      script: "server.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      watch: ".",
    },
  ],
};
