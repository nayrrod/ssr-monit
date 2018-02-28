module.exports = {
  apps : [{
    name      : 'ssr-app',
    script    : 'entrypoint.js'
  }],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '163.172.141.76',
      ref  : 'origin/master',
      repo : 'git@github.com:Unitech/ssr-monit.git',
      path : '/var/www/ssr-testing',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
