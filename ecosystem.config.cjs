module.exports = {
  apps: [
    {
      name: 'adornos-api',
      script: './server/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'client'],
    },
    {
      name: 'adornos-frontend',
      script: 'npm',
      args: 'run client',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      autorestart: true,
      watch: false,
    }
  ]
};
