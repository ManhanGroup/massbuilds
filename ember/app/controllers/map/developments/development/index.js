import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';
import { capitalize } from 'calbuilds/helpers/capitalize';
import { action, computed } from '@ember-decorators/object';

export default class extends Controller {
  @service map;
  @service session;
  @service currentUser;
  @service notifications;

  @computed(
    'model.rdv',
    'model.phased',
    'model.stalled',
    'model.asofright',
    'model.mixedUse'
  )
  get keyAttributes() {
    return this.attributesFor({
      rdv: 'Redevelopment',
      phased: 'Phased',
      stalled: 'Stalled',
      asofright: 'As of Right',
      mixedUse: 'Mixed Use',
    });
  }

  @computed('model.parkType')
  get parkTypes() {
    return (this.get('model.parkType') || '')
      .split(',')
      .map(capitalize)
      .join(', ');
  }

  @computed('model.sbType')
  get sbTypes() {
    return (this.get('model.sbType') || '')
      .split(',')
      .map(capitalize)
      .join(', ');
  }

  @computed('model.ovr55', 'model.private')
  get residentialAttributes() {
    return this.attributesFor({
      ovr55: 'Age Restricted',
      private: 'Private',
    });
  }

  @computed('model.nTransit')
  get transitOptions() {
    return (this.get('model.nTransit') || []).join(', ');
  }

  @computed('model.headqtrs')
  get commercialAttributes() {
    return this.attributesFor({
      headqtrs: 'Company Headquarters',
    });
  }

  @action
  findPosition() {
    // Supposed to be hooked up to location finder in the map service.
  }

  @computed('currentUser.user.role', 'model.municipal')
  get hasSuperPermissions() {
    const role = this.get('currentUser.user.role');
    const userMuni = this.get('currentUser.user.municipality');
    const developmentMuni = this.get('model.municipal');

    return (
      role === 'admin' ||
      (role === 'municipal' &&
        userMuni.toLowerCase() === developmentMuni.toLowerCase())
    );
  }

  @computed('isSettingFlag')
  get flaggingMessage() {
    return this.get('model.flag') ? 'Flagging' : 'Unflagging';
  }

  @action
  deleteDevelopment() {
    const model = this.get('model');
    const name = model.get('name');

    model.destroyRecord().then(() => {
      this.get('notifications').show(`You have deleted ${name}.`);
      this.get('map').remove(model);
      this.transitionToRoute('map');
    });
  }

  @action
  flagDevelopment() {
    const flag = this.store.createRecord('flag', {
      development: this.get('model'),
      reason: this.get('reason'),
      isResolved: false,
    });
    this.set('isSettingFlag', true);
    flag
      .save()
      .then(() => {
        this.get('notifications').show(
          'This development has been flagged for review by our team.'
        );
      })
      .finally(() => {
        this.set('isSettingFlag', false);
      });
  }

  @action
  unflagDevelopment() {
    const model = this.get('model');
    model.set('flag', false);

    this.set('isSettingFlag', true);

    model
      .save()
      .then(() => {
        this.get('notifications').show('This development has been unflagged.');
      })
      .catch(() => {
        model.set('flag', true);
        this.get('notifications').error(
          'This development must pass validations before being unflagged.'
        );
      })
      .finally(() => {
        this.set('isSettingFlag', false);
      });
  }

  attributesFor(attributeDict) {
    const attributes = [];
    const model = this.get('model');

    Object.keys(attributeDict).forEach((attribute) => {
      if (model.get(attribute)) {
        attributes.push(attributeDict[attribute]);
      }
    });

    return attributes.join(', ');
  }

  isJson(item) {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;    
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
      
    return typeof value === "object" && value !== null;
  }

  @computed('model.descr')
  get descriptionTable() {
    const description = this.get('model.descr')
    const fixedDescription = "{" + description + "}"
    if (this.isJson(fixedDescription)) {
      const descriptionObject = JSON.parse(fixedDescription)
      var descriptionArray = []
      for (let key in descriptionObject ) {
        let value = descriptionObject[key];
        descriptionArray.push([key.toString(), value.toString()]);
      }
      return descriptionArray
    } else {
      return null
    }
  }

}
