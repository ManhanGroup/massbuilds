import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  lstrpas: service(),

  model() {
    const rpas=this.get('lstrpas.lstrpas');
    return rpas;    
  }

})
