import { firebase } from '../utils/firebase';

export default function HttpService(){
  this.get = (url) => {
    return new Promise((res,rej)=>{
      firebase.database().ref(url).on('value',(data)=>{
        res(data);
      });
    });
  }
}
