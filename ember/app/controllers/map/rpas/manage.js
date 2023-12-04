import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';


export default class extends Controller {
  
  // @computed('model.@each.ispublic')
  // get allIspublic() {
  //   return this.model.isEvery('ispublic', true);
  // }

  // @computed('model.@each.ispublic')
  // get someIspublic() {
  //   return this.model.isAny('ispublic', true);
  // }

  // @computed('model.@each.ispublic')
  // get noneIspublic() {
  //   return this.model.isEvery('ispublic', false);
  // }

  // @computed('model.@each.counties.@each.ispublic')
  // get allCountiesIspublic() {
  //   return this.model.every((rpa) => rpa.counties.isEvery('ispublic', true));
  // }

  // @computed('model.@each.counties.@each.ispublic')
  // get someCountiesIspublic() {
  //   return this.model.any((rpa) => rpa.counties.isAny('ispublic', true));
  // }

  // @computed('model.@each.counties.@each.ispublic')
  // get noneCountiesIspublic() {
  //   return this.model.every((rpa) => rpa.counties.isEvery('ispublic', false));
  // }

  // @action
  // async toggleIspublic() {
  //   let newValue = !this.allIspublic;
  //   await Promise.all(this.model.map(async (rpa) => {
  //     rpa.set('ispublic', newValue);
  //     await rpa.save();
  //     await Promise.all(rpa.counties.map(async (county) => {
  //       county.set('ispublic', newValue);
  //       await county.save();
  //       await Promise.all(county.places.map(async (place) => {
  //         place.set('ispublic', newValue);
  //         await place.save();
  //       }));
  //     }));
  //   }));
  // }

  @action
  toggleCounties(rpa) {
    rpa.set('isShowingCounties',  !rpa.get('isShowingCounties'));   
  
    const myList = document.getElementById(rpa.get('acronym'));
     // Toggle the visibility of the counties list
    if (myList.style.display === "none") {
      myList.style.display = "block";
    } else {
      myList.style.display = "none";
    }
  }

  @action
  toggleCities(county) {
    county.set('isShowingCities',  !county.get('isShowingCities'));   
  
    const myList = document.getElementById(county.get('county'));
     // Toggle the visibility of the counties list
    if (myList.style.display === "none") {
      myList.style.display = "block";
    } else {
      myList.style.display = "none";
    }
  }



  @action
  async toggleRpaIspublic(rpa) {
    let newValue = !rpa.get('ispublic');
    rpa.set('ispublic', newValue);
    await rpa.save();
    // const counties=rpa.hasMany('counties').reload();
    // await Promise.all(counties.map(async (county) => {
    //   county.set('ispublic', newValue);
    //   await county.save();
    //   const places=county.hasMany('places').reload();
    //   await Promise.all(places.map(async (place) => {
    //     place.set('ispublic', newValue);
    //     await place.save();
    //   }));
    // }));
  }

  @action
  async toggleCountyIspublic(county) {
    //let newValue = !county.get('ispublic');
    //county.set('ispublic', newValue);
    county.toggleProperty('ispublic');
    await county.save();
    // await Promise.all(county.places.map(async (place) => {
    //   place.set('ispublic', county.ispublic);
    //   await place.save();
    // }));
  }

  @action
  async togglePlaceIspublic(place) {
    place.toggleProperty('ispublic');
    await place.save();
    // let county = place.county;
    // let rpa = county.rpa;
    // if (place.ispublic) {
    //   county.set('ispublic', true);
    //   await county.save();
    //   rpa.set('ispublic', true);
    //   await rpa.save();
    // } else {
    //   if (county.places.isEvery('ispublic', false)) {
    //     county.set('ispublic', false);
    //     await county.save();
    //     if (rpa.counties.isEvery('ispublic', false)) {
    //       rpa.set('ispublic', false);
    //       await rpa.save();
    //     }
    //   }
    // }
  }
  
}
