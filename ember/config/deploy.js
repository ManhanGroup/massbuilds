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
      dest: 'calbuilds@prep.mapc.org:/var/www/calbuilds/ember',
      delete: false,
    };
  }

  if (deployTarget === 'production') {
    ENV.rsync = {
      dest: 'calbuilds@live.mapc.org:/var/www/calbuilds/ember',
      delete: false,
    };
  }

  return ENV;
};
