import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class extends Component {
  @service store;
  
  constructor() {
    super();
    this.selectedCounty=null;
  }
  
  @computed('selectedCounty')
  get places() {
    const selectedCounty= this.get('selectedCounty');
    if (selectedCounty) {
      let cnty=this.get('store').peekRecord('county', selectedCounty);
      let myplaces=cnty.get('places');
      return myplaces;
      
    } else {
      return null;
    }
  }

  @action
  selectCounty(county) {
    this.set('selectedCounty', county);
  }

  @action
  getCityBoundary(city) {
    if (city) {
      this.sendAction('getCityBoundary', city);
    }
  }
  
  @action
  updateMunicipality(city) {
    if (city) {
      this.sendAction('updateMunicipality', city);
    }
  }

}
