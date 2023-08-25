import Service from '@ember/service';
import mapboxgl from 'mapbox-gl';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export const massLng = -121.846450;
export const massLat = 36.58017;

export default class extends Service {
  @service store;
  @service notifications;

  constructor() {
    super();

    this.lower = { lat: 35.173731, lng: -121.604751 };
    this.upper = { lat: 37.470423, lng: -121.275161 };
    this.pad = 0;

    this.instance = null;
    this.viewing = null;
    this.filteredData = [];
    this.baseMap = 'light';

    this.stored = [];
    this.storedBounds = null;

    this.zoomCommand = null;
    this.markerVisible = false;
    this.parcelTileVisible = true;
    this.currentZoom=10;
    this.followMode = false;
    this.selectedCoordinates = [0, 0];
    this.jumpToSelectedCoordinates = false;
    this.showingLeftPanel = false;

    this.get('store')
      .query('development', { trunc: true })
      .then((results) => {
        this.set('stored', results.toArray());
        this.set(
          'storedBounds',
          mapboxgl.LngLatBounds.convert(
            results.map(
              (result) =>
                new mapboxgl.LngLat(
                  result.get('longitude'),
                  result.get('latitude')
                )
            )
          )
        );
      });
  }

  setViewing(dev) {
    this.set('viewing', dev);
  }

  filterByQuery(query) {
    if (Object.keys(query.filter).length === 0) {
      this.set('pad', 0);
      this.set('filteredData', []);
    } else {
      this.get('notifications').show('Updating map', { duration: 2000 });
      this.set('pad', 0.1);
      this.get('store')
        .query('development', query)
        .then((result) => {
          this.set('filteredData', result);
        });
    }
  }

  setFocusedDevelopment(id) {
    this.get('store')
      .findRecord('development', id)
      .then((dev) => {
        this.set('focusedDevelopment', dev);
      });
  }

  @computed('stored', 'filteredData')
  get remainder() {
    const filtered = this.get('filteredData').reduce(
      (obj, datum) => Object.assign(obj, { [datum.get('id')]: true }),
      {}
    );
    return this.get('stored').filter((datum) => !filtered[datum.get('id')]);
  }

  remove(development) {
    this.get('stored').removeObject(development);
    this.set('stored', this.get('stored').toArray());
  }

  add(development) {
    this.get('stored').pushObject(development);
    this.set('stored', this.get('stored').toArray());
  }
}
