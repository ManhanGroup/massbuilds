import Route from '@ember/routing/route';
import { service } from '@ember-decorators/service';

export default class extends Route {
  @service store;

  async  model() {
    //return this.get('store').findAll('rpa');
    const rpas = await this.store.findAll('rpa', { include: 'counties' });
       
    return rpas;
    
  }

}
