import Service from '@ember/service';
import { service } from '@ember-decorators/service';



export default class extends Service {
  @service store;

  constructor() {
    super();

    this.lstrpas=null;

    this.get('store')
      .findAll('rpa', { include: 'counties' })
      .then((results) => {
      this.set('lstrpas', results);        
    });
    
    
  }

  }
