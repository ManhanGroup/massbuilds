import DS from 'ember-data';
import config from 'calbuilds/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';


export default DS.JSONAPIAdapter.extend({
  session: service(),

  host: config.host,

  headers: computed('session.data.authenticated.token', function() {
    let headers = {};
    if (this.get('session.isAuthenticated')) {
      let { email, token } = this.get('session.data.authenticated');
      headers['Authorization'] = `Token token="${token}", email="${email}"`;
    }
    return headers;
  })
});
