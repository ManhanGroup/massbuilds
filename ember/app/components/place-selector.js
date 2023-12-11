import Component from '@ember/component';
import { action} from '@ember-decorators/object';
//import { getOwner } from '@ember/application';

export default class extends Component {

  constructor() {
    super();
    //this.appCtrl = getOwner(this).lookup('controller:map');
  }
  
  @action
  fly2city(city) {
    if (city) {
      this.sendAction('getCityBoundary', city);
    }
  }
}
