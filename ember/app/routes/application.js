import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';


export default Route.extend({
  session: service(),
  currentUser: service(),


  beforeModel() {
    return this._loadCurrentUser();
  },

  afterModel() {
    this.get('currentUser')
        .set('alreadyLoggedIn', !!this.get('session.data.authenticated.email'));
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },


  async _loadCurrentUser() {
    try {
      await this.get('currentUser').load()
    } catch(err) {
      await this.get('session').invalidate()
    }
  }
});
