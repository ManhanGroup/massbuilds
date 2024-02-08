import { copy } from '@ember/object/internals';
import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';


export default class extends Controller {
  @service store

  constructor() {
    super();

    this.roles = ['user', 'verified', 'municipal', 'admin', 'disabled'];
    this.agencies = ['AMBAG', 'BCAG', 'SLOCOG', 'SRTA', 'TRPA', null];
    this.searchQuery = '';
    this.roleFilter = 'all';
  }


  @computed('model.[]')
  get sortedUsers() {
    return this.get('model').sortBy('lastName', 'firstName');
  }


  @computed('sortedUsers', 'searchQuery', 'roleFilter')
  get filteredUsers() {
    const sortedUsers = this.get('sortedUsers');
    const roleFilter = this.get('roleFilter');
    const searchQuery = this.get('searchQuery').toLowerCase();

    const searchable = ['lastName', 'firstName', 'email', 'fullName', 'municipality', 'agency'];
    let filteredUsers = copy(sortedUsers);

    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.get('role') === roleFilter);
    }

    if (searchQuery.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        return searchable.any(attr => (user.get(attr) || '').toLowerCase().startsWith(searchQuery));
      });
    }

    return filteredUsers;
  }


  @action
  updateUser(user) {
    const newRole = document.querySelector(`select[name="${user.id}-role"]`).value;

    if (newRole) {
      user.set('role', newRole);
      user.save();
    }
  }

  @action
  updateUserAgency(user) {
    const newAgency = document.querySelector(`select[name="${user.id}-agency"]`).value;

    //if (newAgency) {
    user.set('agency', newAgency);
    user.save();
    //}
  }

  @computed
  get fetchMunis() {
    //const munisList = munis.map(row => row.text)
    const munisList=this.store.findAll('place');
    munisList.push('STATE')
    return munisList.sort();
  }


  @action
  filterRole() {
    this.set('roleFilter', document.querySelector('select[name="role-filter"]').value);
  }

  @action
  updateMunicipality(user, muni) {
    user.set('municipality', muni);
    user.save();
  }
}

