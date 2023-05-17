import DS from 'ember-data';
import { attr } from 'ember-decorators/data';


export default class extends DS.Model {

  @attr('number') gid
  @attr('string') city
  @attr('string') zoning
  @attr('string') site_addr
  @attr('json') geojson

}
