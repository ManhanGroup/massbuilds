import Service from '@ember/service';
import fetch from 'fetch';
import { inject as service} from "@ember/service"

export default Service.extend({
  fetch(url){
    let { email, token } = this.get('session.data.authenticated')
    let authData = `Token token="${token}", email="${email}"`
    return fetch(url,{headers: {'Authorization': authData}}).then(
      (response)=>{return response.json()}
    )
  },
  
  post(url, body){
    let { email, token } = this.get('session.data.authenticated')
    let authData = `Token token="${token}", email="${email}"`
    return fetch(
      url,
      {
        headers: {'Authorization': authData}, 
        method: "POST",
        body: body}
    ).then(
      (response)=>{return response.json()}
    )
  },

  session: service()
});
