import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action } from 'ember-decorators/object';
import config from 'calbuilds/config/environment';


export default class extends Controller {

  @service map
  @service currentUser
  @service notifications
  @service ajax

  @action
  uploadFile(file) {
    let uploadData = file.blob
    let formData = new FormData();
    formData.append('file', uploadData);
    this.get('ajax')
    .post(`${config.host}/developments/import`, {
      contentType: false, // ??
      processData: false,
      data: formData, // ??
    })
    .then(() => {
      this.get('notifications').show(
        `You have successfully uploaded additional developments.`
      );
      this.sendAction('redirect'); // ?? where is this going to go?
    })
    .catch((e) => {
      console.log("upload failed")
      console.log(e)
      this.set(
        'errorMessage',
        'We could not upload more developments at this time.'
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
