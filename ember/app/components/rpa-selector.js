import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class extends Component {
  @service store;
  constructor() {
    super();
    this.selectedRpa=null;
    this.sortedCounties=[];
    
  }
  
  @computed('selectedRpa')
  get counties() {
    const selectedRpa = this.get('selectedRpa');    
    if (selectedRpa) {
      let rpa=this.get('store').peekRecord('rpa', selectedRpa);
      return rpa.get('counties');
      // return rpa.get('counties').then((counties) => {
      //   return counties;
      // }).catch((error) => {
      //   return null;
      // });       
    } else {
      return null;
    }
  }

  @action
  async selectRpa(rpa) {
    this.set('selectedRpa', rpa);
    let mycounties=await this.get('counties');
    this.set('sortedCounties',mycounties.sortBy('county'));
  }
 
  getCityBoundary(city) {
    if (city) {
      this.sendAction('getCityBoundary', city);
    }
  }

  
  updateMunicipality(city) {
    if (city) {
      this.sendAction('updateMunicipality', city);
    }
  }

}
