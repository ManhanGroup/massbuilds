import Component from '@ember/component';
import { later, next } from '@ember/runloop';
import agencies from '../agencies';

export default class extends Component {

    constructor() {
        super();

        this.agencies = agencies
        this.currentAgency = agencies.AMBAG.properties
    
        next(this, function() {
          this.runner = this.updateAgency();
        })
    }

    updateAgency() {
      return later(this, function () {
        switch(this.currentAgency) {
          case agencies.AMBAG.properties:
            this.set("currentAgency", agencies.SLOCOG.properties)
            break
          case agencies.SLOCOG.properties:
              this.set("currentAgency", agencies.SRTA.properties)
            break
          case agencies.SRTA.properties:
              this.set("currentAgency", agencies.AMBAG.properties)
            break
        }
        this.runner = this.updateAgency();
      }, 5000);
    }
}
