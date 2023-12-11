import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class extends Component {
  @service store;
  constructor() {
    super();

    this.selectedRpa=null;
  }
  
  @computed('selectedRpa')
  get counties() {
    const selectedRpa = this.get('selectedRpa');
    
    if (selectedRpa) {
      let rpa=this.get('store').peekRecord('rpa', selectedRpa);
      let mycounties=rpa.get('counties');
      return mycounties;
      // rpa.get('counties').then(function(counties) {
      //   return counties.reload();
        
      // });
      
    } else {
      return null;
    }
  }

  @action
  selectRpa(rpa) {
    this.set('selectedRpa', rpa);
  }

}
