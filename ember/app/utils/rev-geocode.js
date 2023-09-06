import fetch from 'fetch';
import DS from 'ember-data';


export default function revGeocode(y,x) {
  const url=`https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${y}&lon=${x}`;
  const p = fetch(url
    ).then((response) =>{
      //let res=response.json()
      let properties=response.features[0].properties;
      // return ((properties['address']['house_number'] || '')+' '+ properties['address']['road'] +
      //  properties['address']['city'] +', CA '+properties['address']['postcode'])|| 
       // '[ADDRESS UNKNOWN]';       
      return properties['address']['house_number'] ;   
    })
    .catch(() => {
      return '[ADDRESS UNKNOWN]';
    });
      
  return DS.PromiseObject.create({
    promise: p
});
}