import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';


export default class extends DS.Model {
  @belongsTo('rpa', {async: true}) rpa
  @belongsTo('county', {async: true}) county

  @attr('string') namelsad
  @attr('boolean' , { default: true }) ispublic
  //@attr('json') geojson

}
