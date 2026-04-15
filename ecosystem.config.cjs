module.exports = {
  apps: [
    {
      name: "azure-botanicals",
      cwd: __dirname,
      script: "pnpm",
      args: ["exec", "next", "start"],
      interpreter: "none",
      instances: 1,
      autorestart: true,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
}
