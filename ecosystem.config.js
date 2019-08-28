module.exports = {
  apps : [{
    name: 'Privacy operation system api',
    script: './bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
