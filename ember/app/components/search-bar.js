import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import filters from 'calbuilds/utils/filters';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from 'fetch';

export default class extends Component {
  @service currentUser;
  //@service ajax;
  @service map;

  constructor() {
    super();

    this.classNames = ['component', 'search-bar'];
    this.sortOrder = ['municipal', 'nhood', 'apn','devlper', 'name', 'address'];
    this.appCtrl = getOwner(this).lookup('controller:application');
    this.loading = false;
  }

  @reads('model') developments;

  @computed('developments.[]')
  get municipal() {
    return this.uniqueValuesFor('municipal');
  }

  @computed('developments.[]')
  get apn() {
    return this.uniqueValuesFor('apn');
  }

  @computed('developments.[]')
  get devlper() {
    return this.uniqueValuesFor('devlper');
  }


  @computed('developments.[]')
  get nhood() {
    return this.uniqueValuesFor('nhood');
  }

  @computed('developments.[]')
  get name() {
    return this.valuesFor('name');
  }

  @computed('developments.[]')
  get address() {
    return this.valuesFor('address');
  }

  @computed('currentUser.user.role')
  get hasPermissions() {
    const role = this.get('currentUser.user.role');

    return role !== null && role !== undefined;
  }

  @computed('searchQuery')
  get searchList() {
    const searchQuery = this.get('searchQuery').toLowerCase().trim();
    let filtered = {};
    if (searchQuery.length < 2) {
      return filtered;
    }
    const sortOrder = this.get('sortOrder');

    const queryWords = searchQuery.toLowerCase().split(' ');

    sortOrder.forEach((col) => {
      var name = filters[col].name;

      filtered[name] = this.get(col)
        .filter((record) => {
          var keywords = record.value.toLowerCase().split(' ');

          return keywords
            ? queryWords.every((queryWord) =>
                keywords.any((keyword) => keyword.startsWith(queryWord))
              )
            : false;
        })
        .map((row) => ({ ...row, name, col }));
    });
    return filtered;
  }

  @computed('searchQuery')
  get gotoList() {
    const searchQuery = this.get('searchQuery').toLowerCase().trim();
    if (searchQuery.length <= 1) {
      return [];
    }

    this.set('loading', true);

   
    const p1=fetch(
      `https://ambag-postrest.herokuapp.com/address?mylabel=like.${searchQuery}*`
    );     

    const p2=fetch(
      `https://nominatim.openstreetmap.org/search?q=${searchQuery}*&format=geojson`
    );


    const p=Ember.RSVP.hash([p1,p2]).then((results) =>{
      const items=[];
      if (results[0].length>0){
        results[0].slice(0, 5).map((feature) => {
          items.push({
            label: feature.mylabel,
            type: feature.mytype,
            geometry: {"type": feature.geom.type,"coordinates": feature.geom.coordinates},
          });
        });
      }
      
     if(results[1].features.length>0){
        results[1].features.slice(0, 5).map((feature) => {
          items.push({
            label: feature.properties.display_name,
            type: feature.properties.type,
            geometry: feature.geometry,
          });
        });
      }

      this.set('loading', false);
      return items;
      
    })
    .catch(() => {
      this.set('loading', false);
      return [];
    });
    
   return DS.PromiseArray.create({
      promise: p 
   }); 

  }

  @computed('searchList')
  get searchListCount() {
    const searchList = this.get('searchList');

    return Object.keys(searchList).reduce(
      (a, key) => a + searchList[key].length,
      0
    );
  }

  @computed('searchList')
  get searching() {
    const searchList = this.get('searchList');

    return Object.keys(searchList).any((key) => searchList[key].length >= 0);
  }

  @action
  selectItem(item) {
    if (item) {
      if (item.id) {
        this.sendAction('viewDevelopment', item.id);
      } else {
        this.sendAction('addDiscreteFilter', item);
      }
    }

    this.set('searchQuery', '');
  }

  @action
  goto(geometry) {
    this.set('searchQuery', '');
    this.get('map').set('markerVisible', true);
    this.get('map').set('jumpToSelectedCoordinates', true);
    this.get('map').set('selectedCoordinates', geometry.coordinates);
  }

  @action
  clearSearch() {
    this.set('searchQuery', '');
  }

  valuesFor(column) {
    return this.get('developments')
      .map((development) => {
        return {
          id: development.get('id'),
          value: development.get(column),
        };
      })
      .filter((x) => x.value !== null && x.value !== undefined)
      .sortBy('value');
  }

  uniqueValuesFor(column) {
    return this.get('developments')
      .map((development) => development.get(column))
      .uniq()
      .filter((x) => x !== null && x !== undefined)
      .sort()
      .map((value) => {
        return { value };
      });
  }
}
