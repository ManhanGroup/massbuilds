import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';


export default class extends Controller {

  // @computed('model.rpas.@each')
  // get rpas() {
  //   return this.model.rpas;
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
    let newVal=!rpa.get('ispublic')
    //rpa.toggleProperty('ispublic');
    rpa.set('ispublic', newVal);
    await rpa.save();

    rpa.get('counties').forEach(async (county)=>{
      county.set('ispublic',newVal);
      await county.save();
    })
  }

  @action
  async toggleCountyIspublic(county) {
    let newVal=!county.get('ispublic')
    //county.toggleProperty('ispublic');
    county.set('ispublic', newVal);
    await county.save();

    county.get('places').forEach(async (place)=>{
      place.set('ispublic',newVal);
      await place.save();
    })
    
  }

  @action
  async togglePlaceIspublic(place) {
    place.toggleProperty('ispublic');
    await place.save();
    let county = place.get('county');
    let rpa = county.get('rpa');
    
    if (place.get('ispublic')){
      county.set('ispublic', true);
      rpa.set('ispublic', true);
    }
    else {
      if (county.get('places').isEvery('ispublic', false)) {
        county.set('ispublic', false);
        if (rpa.get('counties').isEvery('ispublic', false)) {
          rpa.set('ispublic', false);
        }
      }
    }
  await county.save();
  await rpa.save();
  }
  
  
}
