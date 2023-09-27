import Service from '@ember/service';
import { computed } from '@ember-decorators/object';
import { run } from '@ember/runloop';
import { service } from '@ember-decorators/service';


export class MockMapService extends Service {
    @service store;

    constructor() {
        super();

        this.stored = [run(() => this.get('store').createRecord('development', {
          name: 'Neighborhood'
        }))]
    }
    setViewing(dev) {
      this.set('viewing', dev);
    }
  
    filterByQuery(query) {
      if (Object.keys(query.filter).length === 0) {
        this.set('pad', 0);
        this.set('filteredData', []);
      } else {
        this.get('notifications').show('Updating map', { duration: 2000 });
        this.set('pad', 0.1);
        this.get('store')
          .query('development', query)
          .then((result) => {
            this.set('filteredData', result);
          });
      }
    }
  
    setFocusedDevelopment(id) {
      this.get('store')
        .findRecord('development', id)
        .then((dev) => {
          this.set('focusedDevelopment', dev);
        });
    }
  
    @computed('stored', 'filteredData')
    get remainder() {
      const filtered = this.get('filteredData').reduce(
        (obj, datum) => Object.assign(obj, { [datum.get('id')]: true }),
        {}
      );
      return this.get('stored').filter((datum) => !filtered[datum.get('id')]);
    }
  
    remove(development) {
      this.get('stored').removeObject(development);
      this.set('stored', this.get('stored').toArray());
    }
  
    add(development) {
      this.get('stored').pushObject(development);
      this.set('stored', this.get('stored').toArray());
    }
  }