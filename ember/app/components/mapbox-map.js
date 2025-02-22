import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import statusColors from 'calbuilds/utils/status-colors';
import pointInPolygon from '@turf/boolean-point-in-polygon';
import centerOfMass from '@turf/center-of-mass';
import mapboxgl from 'mapbox-gl';
import config from 'calbuilds/config/environment';
import paintProperties from 'calbuilds/utils/paint-properties';
import parcelTiles from 'calbuilds/utils/parcel-tiles';

mapboxgl.accessToken =config.MAPBOX_ACCESS_TOKEN;

export default class extends Component {
  @service store;
  @service map;
  @service session;

  constructor() {
    super();
    this.previousCoordinatesKey = null;
    this.previousParcel = null;
    this.lastRequest = null;
    this.focusTargetBounds = null;
    this.sessionAuthenticated=this.get('session.isAuthenticated');
  }

  getLeftPanelWidth() {
    // CSS transitions make dynamically calculating the width of the left panel
    // difficult because it becomes time sensitive. Since the width and left
    // properties of the panel are set in pixels we can set that here as a constant.
    if (this.get('map.showingLeftPanel')) {
      const mapWidth = parseInt(this.element.getBoundingClientRect().width);
      if (mapWidth < 1180) {
        return 480;
      }
      return 700;
    }
    return 0;
  }

  didInsertElement() {
    const mapService = this.get('map'); 
    let mapStyle = 'mapbox://styles/mapbox/streets-v11';
    if (mapService.get('baseMap') == 'satellite') {
      let mapStyle = 'mapbox://styles/mapbox/satellite-streets-v11';
    }
    this.mapboxglMap = new mapboxgl.Map({
      container: this.get('element'),
      style: mapStyle,
      center: [-121.4734, 36.648809],
      zoom: mapService.get('currentZoom'),
      maxBounds: [
        [-130, 20],
        [-40, 60],
      ],
      dragRotate: false,
      pitchWithRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: true,
      minZoom: 5,
    });
    this.mapboxglMap.on('load', () => {
      this.mapboxglMap.on('zoom', (e) => {
        // If a user attempts to abort a zoom, stop the animation.
        if (e.originalEvent && e.originalEvent.type != 'dblclick') {
          this.mapboxglMap.stop();
        }
      });
      this.mapboxglMap.on('zoomend',()=>{
        mapService.set('currentZoom', this.mapboxglMap.getZoom());
      })
      mapService.addObserver('stored', this, 'draw');
      mapService.addObserver('filteredData', this, 'draw');
      mapService.addObserver('viewing', this, 'draw');
      mapService.addObserver('sessionAuthenticated', this, 'draw');
      mapService.addObserver('filteredData', this, 'focus');
      mapService.addObserver('baseMap', this, 'setStyle');
      mapService.addObserver('parcelTileVisible',this, 'pTVisibleChangeHandler');
      mapService.addObserver('zoomCommand', this, 'actOnZoomCommand');
      mapService.addObserver('viewing', this, 'jumpTo');
      mapService.addObserver(
        'markerVisible',
        this,
        'markerVisibleChangeHandler'
      );
      mapService.addObserver('followMode', this, 'followModeChangeHandler');
      mapService.addObserver(
        'selectedCoordinates',
        this,
        'drawSelectedCoordinates'
      );
      mapService.addObserver('focusCityCoords', this, 'focusCityCoordsChangeHandler');

      if (mapService.get('stored').length) {
        this.draw(mapService);
        this.focus(mapService);
      }
      if (mapService.get('viewing')) {
        this.jumpTo(mapService);
      }
      if (mapService.get('markerVisible')) {
        this.drawSelector(mapService);
      }
      if (mapService.get('followMode')) {
        this.updateSelection(true);
      }

      // Add tilesets initially
      this.addTilesets(mapService);   

    });
    // A Mapbox event having an 'originalEvent' can indicate that it was a user
    // initiated event instead of one triggered by a Mapbox function like
    // fitBounds.
    this.mapboxglMap.on('drag', (e) => this.updateSelection(e.originalEvent));
    this.mapboxglMap.on('zoom', (e) => this.updateSelection(e.originalEvent));
    this.mapboxglMap.on('zoomend', () => this.set('focusTargetBounds', null));
    
  }

  willDestroyElement() {
    const mapService = this.get('map');
    mapService.removeObserver('stored', this, 'draw');
    mapService.removeObserver('filteredData', this, 'draw');
    mapService.removeObserver('viewing', this, 'draw');
    mapService.removeObserver('sessionAuthenticated', this, 'draw');
    mapService.removeObserver('filteredData', this, 'focus');
    mapService.removeObserver('baseMap', this, 'setStyle');
    mapService.removeObserver('parcelTileVisible',this,'pTVisibleChangeHandler');
    mapService.removeObserver('zoomCommand', this, 'actOnZoomCommand');
    mapService.removeObserver('viewing', this, 'jumpTo');
    mapService.removeObserver(
      'markerVisible',
      this,
      'markerVisibleChangeHandler'
    );
    mapService.removeObserver('followMode', this, 'followModeChangeHandler');
    mapService.removeObserver(
      'selectedCoordinates',
      this,
      'drawSelectedCoordinates'
    );
    mapService.removeObserver('focusCity',this, 'focusCityChangeHandler');
    this.mapboxglMap.remove();
  }

  markerVisibleChangeHandler(mapService) {
    this.draw(mapService);
    this.drawSelector(mapService);
  }

  pTVisibleChangeHandler(mapService) {
    this.draw(mapService);
    this.toggleParcelTile(mapService);
  }

  followModeChangeHandler(mapService) {
    this.draw(mapService);
    this.set('previousCoordinatesKey', null);
    this.set('previousParcel', null);
    this.updateSelection(true);
  }

  focusCityCoordsChangeHandler(mapService) {
    this.draw(mapService);
    this.fly2City(mapService);
  }


  updateSelection(notFromFitBounds) {
    // If the user triggered the drag or zoom...
    if (
      notFromFitBounds &&
      this.get('map.followMode') &&
      this.mapboxglMap &&
      this.mapboxglMap.getSource('selector') &&
      this.element.querySelectorAll('.left-panel-layer') &&
      this.element
    ) {
      const bounds =
        this.get('focusTargetBounds') || this.mapboxglMap.getBounds();
      const northEast = bounds.getNorthEast().toArray();
      const southWest = bounds.getSouthWest().toArray();
      const ratio = (() => {
        if (this.get('focusTargetBounds')) {
          // If we're in the middle of focusing on an area, the ratios will be
          // taken care of with the padding calculated for fitBounds.
          return 0.5;
        }
        const leftPanelWidth = this.getLeftPanelWidth();
        const mapWidth = parseInt(this.element.getBoundingClientRect().width);
        return ((mapWidth - leftPanelWidth) / 2 + leftPanelWidth) / mapWidth;
      })();
      const coordinates = [
        (northEast[0] - southWest[0]) * ratio + southWest[0],
        (northEast[1] - southWest[1]) * 0.5 + southWest[1],
      ];
      this.get('map').set('jumpToSelectedCoordinates', false);
      this.get('map').set('selectedCoordinates', coordinates);
    }
  }

  getBoundsFromCoordinates(coordinates) {
    const boundsWidth = 0.01;
    const leftPanelWidth = this.getLeftPanelWidth();
    const mapWidth = parseInt(this.element.getBoundingClientRect().width);
    const ratio = ((mapWidth - leftPanelWidth) / 2 + leftPanelWidth) / mapWidth;
    const northEast = [
      coordinates[0] + (1 - ratio) * boundsWidth,
      coordinates[1],
    ];
    const southWest = [coordinates[0] - ratio * boundsWidth, coordinates[1]];
    return new mapboxgl.LngLatBounds(southWest, northEast);
  }

  drawSelectedCoordinates(mapService) {
    if (this.mapboxglMap && this.mapboxglMap.getSource('selector')) {
      const coordinates = mapService.get('selectedCoordinates');
      if (this.get('previousCoordinatesKey') != coordinates.toString()) {
        this.mapboxglMap.getSource('selector').setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coordinates,
              },
            },
          ],
        });
        const previousParcel = this.get('previousParcel');
        if (
          Date.now() - this.get('lastRequest') > 250 &&
          this.mapboxglMap.getLayer('parcel') &&
          (!previousParcel ||
            !pointInPolygon(
              { type: 'Point', coordinates: coordinates },
              previousParcel.get('geojson')
            ))
        ) {
          this.getNewParcel(coordinates);
        }
        this.set('previousCoordinatesKey', coordinates.toString());
      }
      if (mapService.get('jumpToSelectedCoordinates')) {
        const bounds = this.getBoundsFromCoordinates(coordinates);
        this.mapboxglMap.fitBounds(bounds);
      }
    }
  }

  getNewParcel(coordinates) {
    this.set('lastRequest', Date.now());
    this.get('store')
      .query('parcel', { lng: coordinates[0], lat: coordinates[1] })
      .then((results) => {
        const parcels = results.toArray();
        const newCoordinates = this.get('map.selectedCoordinates');
        if (parcels.length) {
          const parcel = parcels[0];
          if (
            pointInPolygon(
              { type: 'Point', coordinates: newCoordinates },
              parcel.get('geojson')
            ) &&
            this.mapboxglMap.getSource('parcel') &&
            this.mapboxglMap.getSource('parcel_label')
          ) {
            this.mapboxglMap.getSource('parcel').setData({
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: parcel.get('geojson'),
                },
              ],
            });
            const center = centerOfMass(parcel.get('geojson'));
            this.mapboxglMap.getSource('parcel_label').setData({
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {
                    site_addr: parcel.get('site_addr')
                      ? parcel.get('site_addr')
                      : '[ADDRESS UNKNOWN]',
                    muni: parcel.get('muni')
                      ? parcel.get('muni').toUpperCase()
                      : '',
                      apn: parcel.get('apn')
                      ? parcel.get('apn')
                      : '',
                  },
                  geometry: center.geometry,
                },
              ],
            });
            this.get('map').set('parcelAgency',parcel.get('agency'));
            this.set('previousParcel', parcel);
          } else {
            this.getNewParcel(newCoordinates);
          }
        } else {
          this.set('previousParcel', null);
          this.mapboxglMap.getSource('parcel').setData({
            type: 'FeatureCollection',
            features: [],
          });
          this.mapboxglMap.getSource('parcel_label').setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
      });
  }

  setStyle(mapService) {
    const newBaseMap = mapService.get('baseMap');
    const redrawOnStyleReload = () => {
      this.markerVisibleChangeHandler(mapService);
      this.pTVisibleChangeHandler(mapService);      
      this.followModeChangeHandler(mapService);
      this.addTilesets(mapService);
      this.mapboxglMap.off('styledata', redrawOnStyleReload);
    };
    this.mapboxglMap.on('styledata', redrawOnStyleReload);
    if (newBaseMap == 'light') {
      this.mapboxglMap.setStyle('mapbox://styles/mapbox/streets-v11');
    } else if (newBaseMap == 'satellite') {
      this.mapboxglMap.setStyle(
        'mapbox://styles/mapbox/satellite-streets-v11'
      );
    };

    this.mapboxglMap.on('style.load', () => {
      this.addTilesets(mapService);
    });
  }

  toggleParcelTile(mapService){
    const visibility = mapService.get('parcelTileVisible');
    const layers = ["parcelsslocog", "parcelsambag", "parcelssrta", "parcelstrpa", "parcelsbcag"];

    layers.forEach(layerId => {
        if (this.mapboxglMap.getLayer(layerId)) {
          this.mapboxglMap.setLayoutProperty(layerId, 'visibility', visibility ? 'visible':'none');
          
        }
    });  
  }

  addTilesets(mapService) {
    const newBaseMap = mapService.get('baseMap');
    let linecolor='hsl(17, 84%, 42%)';
    let linewidth=0.75
    let lineopacity=0.5
    if (newBaseMap == 'satellite') {
      linecolor='hsl(0, 0%, 100%)';
      linewidth=1;
      lineopacity=1;
    }
    
    parcelTiles.forEach(tileset => {
      // Add the vector tile source
      if (!this.mapboxglMap.getSource(tileset.id)) {
        this.mapboxglMap.addSource(tileset.id, {
          type: 'vector',
          url: tileset.url
        });
      }
  
      // Add the layer with the desired style
      if (!this.mapboxglMap.getLayer(tileset.layerId)) {
        this.mapboxglMap.addLayer({
          'id': tileset.layerId,
          'type': 'line',
          'source': tileset.id,
          'source-layer': tileset.sourceLayer,
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': mapService.currentZoom > 12 ? 'visible' : 'none'
          },
          'paint': {
            'line-color': linecolor,
            'line-width': linewidth,
            'line-opacity': lineopacity,
            'line-dasharray': [5, 2]
          }
        });
      }else {
        // Update the visibility based on zoom level
        this.mapboxglMap.setLayoutProperty(tileset.layerId, 'visibility', mapService.currentZoom > 12 ? 'visible' : 'none');
      }
    });
  }

  actOnZoomCommand(mapService) {
    const zoomCommand = mapService.get('zoomCommand');
    if (zoomCommand == 'IN') {
      this.mapboxglMap.zoomIn();
    } else if (zoomCommand == 'OUT') {
      this.mapboxglMap.zoomOut();
    }
    mapService.set('zoomCommand', null);    

  }

  drawSelector(mapService) {
    const markerVisible = mapService.get('markerVisible');
    const satelliteMap = mapService.get('baseMap') != 'light';
    if (markerVisible && !this.mapboxglMap.getLayer('selector')) {
      this.mapboxglMap.addLayer({
        id: 'selector',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
        paint: paintProperties.selector(mapService.get('baseMap') != 'light'),
      });
      this.mapboxglMap.addLayer({
        id: 'parcel',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
        paint: {
          'line-color': satelliteMap ? '#fff' : '#7a7a7a',
          'line-width': satelliteMap ? 2 : 1,
          'line-dasharray': [4, 2],
        },
      });
      this.mapboxglMap.addLayer({
        id: 'parcel_label',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
        layout: {
          'text-field': '{site_addr},\n{muni},\n{apn}',
          'text-size': 12,
          'text-justify': 'left',
          'text-max-width': 20,
          'text-font': ['Open Sans Bold'],
        },
        paint: {
          'text-color': satelliteMap ? '#fff' : '#7a7a7a',
          'text-halo-color': '#000',
          'text-halo-width': satelliteMap ? 1 : 0,
        },
      });
    } else if (this.mapboxglMap.getLayer('selector')) {
      this.mapboxglMap.removeLayer('selector');
      this.mapboxglMap.removeSource('selector');
      this.mapboxglMap.removeLayer('parcel');
      this.mapboxglMap.removeSource('parcel');
      this.mapboxglMap.removeLayer('parcel_label');
      this.mapboxglMap.removeSource('parcel_label');
      this.set('previousCoordinatesKey', null);
    }
  }

  generateFeatures(developments) {
    return developments.map((dev) => ({
      type: 'Feature',
      properties: {
        id: dev.get('id'),
        color: statusColors[dev.get('status')] || '#888',
        name: dev.get('name') || dev.get('address'),
        status: dev.get('status'),
        apn: dev.get('apn'),
        statComts: dev.get('statComts'),
        yrcompEst: dev.get('yrcompEst'),
        yearCompl: dev.get('yearCompl'),
        ispublic: dev.get('ispublic'),
      },
      geometry: {
        type: 'Point',
        coordinates: [dev.get('longitude'), dev.get('latitude')],
      },
    }));
  }

  jumpTo(mapService) {
    const dev = mapService.get('viewing');
    if (dev) {
      const bounds = this.getBoundsFromCoordinates([
        dev.get('longitude'),
        dev.get('latitude'),
      ]);
      this.mapboxglMap.fitBounds(bounds);
    }
  }

  fly2City(mapService) {
    const focusCityCoords = mapService.get('focusCityCoords');
  
    if (focusCityCoords) {
      const bounds = this.getCityBounds(focusCityCoords);
      this.mapboxglMap.fitBounds(bounds);
    }
  }

  getCityBounds(coords){
    const bounds=new mapboxgl.LngLatBounds();
    coords.forEach((p)=>{
      p.forEach((c)=>{
        bounds.extend(c);
      });
    });
    return bounds;
  }

  focus(mapService) {
    if (!mapService.get('viewing')) {
      const data = mapService.get('filteredData').length
        ? mapService.get('filteredData')
        : mapService.get('stored');
      if (data.toArray().length > 0) {
        const fitBounds = data.reduce(
          (bounds, datum) =>
            bounds.extend([datum.get('longitude'), datum.get('latitude')]),
          new mapboxgl.LngLatBounds()
        );
        this.set('focusTargetBounds', fitBounds);
        this.mapboxglMap.fitBounds(fitBounds, {
          padding: {
            top: 40,
            left: this.get('map.showingLeftPanel')
              ? this.getLeftPanelWidth() + 40
              : 40,
            bottom: 40,
            right: 40,
          },
        });
      }
    }
  }

  draw(mapService) {
    // All data
    const allFeatures = this.generateFeatures(
      mapService.get('filteredData').length
        ? mapService.get('remainder')
        : mapService.get('stored')
    );

    const satelliteMap = mapService.get('baseMap') != 'light';
    const isMuted = mapService.get('followMode');

    if (this.mapboxglMap.getLayer('all')) {
      this.mapboxglMap.getSource('all').setData({
        type: 'FeatureCollection',
        features: this.sessionAuthenticated ? allFeatures :  allFeatures.filter(item=>{return item['properties']['ispublic']}),
      });
      Object.entries(
        paintProperties.developments(
          mapService.get('filteredData').length == 0,
          satelliteMap,
          isMuted
        )
      ).forEach(([property, value]) => {
        this.mapboxglMap.setPaintProperty('all', property, value);
      });
    } else {
      this.mapboxglMap.addLayer({
        id: 'all',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.sessionAuthenticated ? allFeatures :  allFeatures.filter(item=>{return item['properties']['ispublic']}),
          },
        },
        paint: paintProperties.developments(
          mapService.get('filteredData').length == 0,
          satelliteMap,
          isMuted
        ),
      });
    }

    if (mapService.get('viewing')) {
      const dev = mapService.get('viewing');
      const highlightFeatures = [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [dev.get('longitude'), dev.get('latitude')],
          },
        },
      ];
      if (this.mapboxglMap.getLayer('highlighter')) {
        this.mapboxglMap.getSource('highlighter').setData({
          type: 'FeatureCollection',
          features: highlightFeatures,
        });
      } else {
        this.mapboxglMap.addLayer({
          id: 'highlighter',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: highlightFeatures,
            },
          },
          paint: paintProperties.highlighter(satelliteMap),
        });
      }
    } else if (this.mapboxglMap.getLayer('highlighter')) {
      this.mapboxglMap.removeLayer('highlighter');
      this.mapboxglMap.removeSource('highlighter');
    }

    if (mapService.filteredData.length) {
      // Filtered data
      const filteredFeatures = this.generateFeatures(mapService.filteredData);

      if (this.mapboxglMap.getLayer('filtered')) {
        this.mapboxglMap.getSource('filtered').setData({
          type: 'FeatureCollection',
          features: filteredFeatures,
        });
        Object.entries(
          paintProperties.developments(true, satelliteMap, isMuted)
        ).forEach(([property, value]) => {
          this.mapboxglMap.setPaintProperty('filtered', property, value);
        });
      } else {
        this.mapboxglMap.addLayer({
          id: 'filtered',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: filteredFeatures,
            },
          },
          paint: paintProperties.developments(true, satelliteMap, isMuted),
        });
      }
    } else if (this.mapboxglMap.getLayer('filtered')) {
      this.mapboxglMap.removeLayer('filtered');
      this.mapboxglMap.removeSource('filtered');
    }

    this.mapboxglMap.on('click', 'filtered', (e) => {
      this.sendAction('viewDevelopment', e.features[0].properties.id);
    });

    this.mapboxglMap.on('mouseenter', 'filtered', () => {
      // Change the cursor style as a UI indicator.
      this.mapboxglMap.getCanvas().style.cursor = 'pointer';
    });

    this.mapboxglMap.on('mouseleave', 'filtered', () => {
      this.mapboxglMap.getCanvas().style.cursor = '';
    });

    this.mapboxglMap.on('click', 'all', (e) => {
      let id = e.features[0].properties.id
      if (mapService.get('focusedDevelopmentID') != id) { 
        this.sendAction('viewDevelopment', id);
      }
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    let popupId = null;

    const openPopup = (e) => {
      // Change the cursor style as a UI indicator.
      this.mapboxglMap.getCanvas().style.cursor = 'pointer';

      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      popupId = properties.id;
      const formattedStatus = properties.status
        .split('_')
        .map((w) => w.capitalize())
        .join(' ');
      const content = htmlSafe(`
        <div class='calbuilds-tooltip'</div>
          <h4>${properties.name}</h4>
          <h5 style="color: ${properties.color}">
            ${formattedStatus}
          </h5>
          <h5>
            <span>${
              properties.yrcompEst ? 'Estimated' : ''
            } Year of Completion: </span>
            ${properties.yearCompl}
          </h5>
        </div>
      `);

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(content).addTo(this.mapboxglMap);
    };

    const closePopup = () => {
      this.mapboxglMap.getCanvas().style.cursor = '';
      popup.remove();
      popupId = null;
    };

    const updatePopup = (e) => {
      if (popupId != e.features[0].properties.id) {
        closePopup();
        openPopup(e);
      }
    };

    this.mapboxglMap.on('mouseenter', 'all', openPopup);
    this.mapboxglMap.on('mouseenter', 'filtered', openPopup);
    this.mapboxglMap.on('mousemove', 'all', updatePopup);
    this.mapboxglMap.on('mousemove', 'filtered', updatePopup);
    this.mapboxglMap.on('mouseleave', 'all', closePopup);
    this.mapboxglMap.on('mouseleave', 'filtered', closePopup);
    
  }
}
