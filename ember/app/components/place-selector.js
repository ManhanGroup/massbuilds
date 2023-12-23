import Component from '@ember/component';
import { action} from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class extends Component {
  @service store;

  constructor() {
    super();
  }
  
  @action
  getCityBoundary(city) {
    if (city) {
      let mycity =this.get('store').peekRecord('place', city);
      let mycoords=mycity.get('geojson').coordinates
      this.sendAction('getCityBoundary', mycoords);
    }
  }

  @action
  updateMunicipality(city) {
    if (city) {
      this.sendAction('updateMunicipality', city);
    }
  }
}
