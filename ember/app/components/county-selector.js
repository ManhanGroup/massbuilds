import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class extends Component {
  @service store;
  
  constructor() {
    super();
    this.selectedCounty=null;
    this.sortedPlaces = [];
  }
  
  @computed('selectedCounty')
  get places() {
    const selectedCounty= this.get('selectedCounty');
    if (selectedCounty) {
      let cnty=this.get('store').peekRecord('county', selectedCounty);
      return cnty.get('places');
      // return cnty.get('places').then((places) => {
      //   return places;
      // }).catch((error) => {
      //   return null;
      // });             
    } else {
      return null;
    }
  }

  @action
  async selectCounty(county) {
    this.set('selectedCounty', county);
    let myplaces=await this.get('places');
    this.set('sortedPlaces',myplaces.sortBy('namelsad'));   
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
