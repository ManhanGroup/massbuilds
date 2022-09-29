import Component from '@ember/component';
import statusColors from 'calbuilds/utils/status-colors';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'map-legend'];
    this.classNameBindings = ['showing'];

    this.statusColors = statusColors;
  }


}
