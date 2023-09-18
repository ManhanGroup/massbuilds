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
    const _super = this._super;

    this._loadCurrentUser()
      .then(() => {
        _super.call(this, ...arguments);
      });
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  }
});
