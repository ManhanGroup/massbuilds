import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import agencies from '../agencies';

export default class extends Component {

    constructor() {
        super();

        this.agencies = agencies
        this.currentAgency = agencies.AMBAG
    
        setInterval(this.updateAgency, 1500)
        this.details = this.currentAgency.properties
    }

    @action
    updateAgency() {
      switch(this.currentAgency) {
        case agencies.AMBAG:
          this.set("currentAgency", agencies.SLOCOG)
          this.set("details", agencies.SLOCOG.properties)
          break
        case agencies.SLOCOG:
            this.set("currentAgency", agencies.SRTA)
            this.set("details", agencies.SRTA.properties)
          break
        case agencies.SRTA:
            this.set("currentAgency", agencies.AMBAG)
            this.set("details", agencies.AMBAG.properties)
          break
      }
    }
  
}
