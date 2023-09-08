import DS from 'ember-data';
import config from 'calbuilds/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';


export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.host,
  authorize(xhr) {
    let { email, token } = this.get('session.data.authenticated');
    let authData = `Token token="${token}", email="${email}"`;
    xhr.setRequestHeader('Authorization', authData);
  }
});
