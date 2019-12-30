import { firebase } from '../utils/firebase';

export default function HttpService(){
  this.get = (url) => {
    return new Promise((res,rej)=>{
      firebase.database().ref(url).on('value',(data)=>{
        res(data);
      });
    });
  };
  this.post = (url,data) => {
    return new Promise((res,rej)=>{
      firebase.database().ref(url).set(data).then((data)=>{
        res(data);
      });
    });
  };
  this.put = (url,data) => {
    return new Promise((res,rej)=>{
      firebase.database().ref(url).ref.update(data).then((data)=>{
        res(data);
      });
    });
  }
}
