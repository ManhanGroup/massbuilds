import DS from 'ember-data';
import { attr, hasMany } from '@ember-decorators/data';



export default class extends DS.Model {
  @hasMany('county', { async: true }) counties
  @hasMany('place', { async: true }) places
  
  //@attr('integer') id
  @attr('string') name
  @attr('string') acronym
  @attr('boolean' , { default: true }) ispublic
  @attr('boolean', { default: false }) isShowingCounties

  

}
