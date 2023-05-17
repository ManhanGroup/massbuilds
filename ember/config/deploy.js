/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {
      environment: deployTarget,
    },

    'revision-data': {
      type: 'git-commit',
    },
  };

  if (deployTarget === 'staging') {
    ENV.rsync = {
      dest: 'root@137.184.70.105:/var/www/calbuilds/',
      delete: false,
    };
  }

  if (deployTarget === 'production') {
    ENV.rsync = {
      dest: 'calbuilds@live.????.org:/var/www/calbuilds/',
      delete: false,
    };
  }

  return ENV;
};
