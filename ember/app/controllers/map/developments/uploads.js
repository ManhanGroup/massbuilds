import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import config from 'calbuilds/config/environment';
import fetch from 'fetch';

export default class extends Controller {

  @service map
  @service currentUser
  @service notifications


  @action
  uploadFile(event) {
    let formData = new FormData(event.currentTarget);
    fetch(`${config.host}/developments/import`, {
      method: 'POST',
      body: formData,
    })
    .then(() => {
      this.get('notifications').show(
        `You have successfully uploaded additional developments.`
      );
      this.sendAction('redirect'); // ?? where is this going to go?
    })
    .catch((e) => {
      this.set(
        'errorMessage',
        `We could not upload more developments at this time.${e}`
        // more details, was there a csv parsing error?
      );
    })
    .finally(() => {
      // for example 
      // this.set('usUploading', false);
      // reload the map view? 
      this.transitionToRoute("map");
    });
  }

}
