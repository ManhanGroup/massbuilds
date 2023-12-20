import DS from 'ember-data';
import { attr, belongsTo, hasMany } from '@ember-decorators/data';


export default class extends DS.Model {
  @belongsTo('rpa', {async: true}) rpa
  @hasMany('place', { async: true }) places

  @attr('string') geoid
  @attr('string') county
  @attr('string') namelsad
  @attr('boolean' , { default: true }) ispublic
  @attr('boolean', { default: false }) isShowingCities
  
}
