/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'calbuilds',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'connect-src': '*',
    },
    admin: {
      email: 'gschmidt@ambag.org',
    },
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  };

  if (environment === 'development') {
    ENV['host'] = 'http://localhost:3000';
    // extra logging options
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_BINDINGS = true;
  }

  if (environment === 'staging') {
    //ENV.rootURL = '/calbuilds/'
    //ENV['host'] = 'https://calbuilds-api.herokuapp.com/';
    ENV['host'] = 'https://calbuilds-pi-toggledeve-ltts5x.herokuapp.com/';
  }

  if (environment === 'production') {
    ENV['host'] = 'https://calbuilds-api.herokuapp.com/';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';
    ENV['host'] = 'http://localhost:3000';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};
