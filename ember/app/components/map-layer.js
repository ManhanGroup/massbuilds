import Component from '@ember/component';
import { action } from '@ember-decorators/object';


export default class extends Component {

  @action
  view(id) {
    this.sendAction('viewDevelopment', id);
  }

}
