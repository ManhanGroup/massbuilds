import DS from 'ember-data';
import { computed } from '@ember-decorators/object';
import { attr, hasMany } from '@ember-decorators/data';


export default class extends DS.Model {

  @attr('string') email
  @attr('string') password
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') municipality
  @attr('string') role
  @attr('string') agency

  @attr('boolean') requestVerifiedStatus

  @attr('date') createdAt

  @hasMany('edits', {async: true}) edits
  @hasMany('developments', {async: true}) developments

  @computed('firstName', 'lastName')
  get fullName() {
    const { firstName, lastName } = this.getProperties('firstName', 'lastName');
    return `${firstName} ${lastName}`;  
  }

  @computed('firstName', 'lastName', 'email', 'agency')
  get displayName() {
    const { fullName, email, agency } = this.getProperties('fullName', 'email', 'agency');
    if(email.endsWith('ambag.org') || agency==='AMBAG' ){
      return 'AMBAG Staff';
    } else if(email.endsWith('slocog.org') || agency==='SLOCOG'){
      return 'SLOCOG Staff';
    } else if(email.endsWith('srta.org') || agency==='SRTA'){
      return 'SRTA Staff';
    }else if(email.endsWith('trpa.org') || agency==='TRPA'){
      return 'TRPA Staff';
    }else if(email.endsWith('bcag.org') || agency==='BCAG'){
      return 'BCAG Staff';
    } else {
      return fullName;
    }

  }

  @computed('agency', 'email')
  get userAgency() {
    const {agency, email } = this.getProperties('agency', 'email');
   
    if(email.endsWith('ambag.org') || agency==='AMBAG' ){
      return 'AMBAG';
    } else if(email.endsWith('slocog.org') || agency==='SLOCOG'){
      return 'SLOCOG';
    }else if(email.endsWith('srta.org') || agency==='SRTA'){
      return 'SRTA';
    }else if(email.endsWith('trpa.org') || agency==='TRPA'){
      return 'TRPA';
    }else if(email.endsWith('bcag.org') || agency==='BCAG'){
      return 'BCAG';
    } else{
      return null;
    }
  }

}
