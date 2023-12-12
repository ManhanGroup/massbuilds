import Component from '@ember/component';
import { action} from '@ember-decorators/object';
//import { getOwner } from '@ember/application';

export default class extends Component {

  constructor() {
    super();
  }
  
  @action
  getCityBoundary(city) {
    if (city) {
      this.sendAction('getCityBoundary', city);
    }
  }
}
