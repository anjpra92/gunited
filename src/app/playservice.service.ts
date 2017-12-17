import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { PlayList } from './playListSave';
import { ConFile } from './conf_file';

@Injectable()
export class PlayserviceService {

  // fetchallPlistsurl = "https://gunited-app-aprabha7.c9users.io/api/playList/";
  // fetchPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/";
  // delPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/delplreq/";
  // delsngPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/delsgreq/";

  constructor(private http: Http) { }

  //Save the playlist to the Database 
  savePlayList(list: PlayList) 
   {
        const body = JSON.stringify(list);
        const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
        return this.http.post('https://gunited-app-aprabha7.c9users.io/api/playList', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw("Error in PlayService"));
    }
    
   //Remove songs which are deleted from songbook from playlist
     delSongPl(sname: string,email:string) 
   {
     console.log('Inside delPlayList service');
     //delPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/delplreq/";
     var url = ConFile.playlistURL + 'delslreq/' + email + '/' + sname;
     console.log('Del Url:',url);
     return this.http.delete(url)
        .map(data => {
        data.json();
        return data.json();
      }); 

   }
    

  //Fetch all playlists saved by the user from the Database
  fetchallPlists(email:string)
 {
     console.log('Inside fetchallPlists service');
     //fetchallPlistsurl = "https://gunited-app-aprabha7.c9users.io/api/playList/";
     var url  = ConFile.playlistURL + email;
     console.log('URL:',url);
     return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
 }

//Fetch the songs in the playlist chosen by the user
 fetchPlist(email:string,plname:string)
 {
     console.log('Inside fetchallPlists service');
     //console.log('URL:',url);
     //fetchPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/";
     var url = ConFile.playlistURL + email+`/`+plname;
     console.log('check url:',url);
     return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
 }

 //Sending Delete playlist request to api.js
  delPlayList(plname: string,email:string) 
   {
     console.log('Inside delPlayList service');
     //delPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/delplreq/";
     var url = ConFile.playlistURL + 'delplreq/' + email + '/' + plname;
     console.log('Del Url:',url);
     return this.http.delete(url)
        .map(data => {
        data.json();
        return data.json();
      }); 

   }

  //Sending Delete song request to api.js
  delsngPlayList(id: string) 
   {
     console.log('Inside delReq service');
     //delsngPlisturl = "https://gunited-app-aprabha7.c9users.io/api/playList/delsgreq/";
     var url = ConFile.playlistURL + 'delsgreq/' + id;
     console.log('Del Url:',url);
     return this.http.delete(url)
        .map(data => {
        data.json();
        return data.json();
      }); 

   }

}
