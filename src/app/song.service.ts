import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SongBook } from './songSave';
import { ConFile } from './conf_file'
    
@Injectable()
export class SongService 
{

// fetchSongUrl = "https://gunited-app-aprabha7.c9users.io/api/songBook/single/";
// fetchAllUrl = "https://gunited-app-aprabha7.c9users.io/api/songBook/";
// delurl = "https://gunited-app-aprabha7.c9users.io/api/songBook/delreq/";
  constructor(private http: Http) { }

  //Save the Song to the Database 
  saveSong(song: SongBook) 
   {
        const body = JSON.stringify(song);
        const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
        return this.http.post('https://gunited-app-aprabha7.c9users.io/api/songbook', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw("Error in SongService"));
    }

 //Fetch Specific Song from Database
 fetchSong(id:string)
 {
     console.log('Inside fetchSong service');
     console.log('id:',id);
    //  var url = this.fetchSongUrl + id;
     var url = ConFile.songURL + 'single/' +  id;
     console.log('URL:',url);
     return this.http.get(url)
        .map(data => {
            data.json();
            console.log('Data json:',data.json());
            return data.json();
    });
 }

 //Fetch all songs saved by the user from the Database
  fetchallSongs(email:string)
 {
     console.log('Inside fetchallSongs service');
     var url = ConFile.songURL+email;
     return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
 }

 //Sending Delete request to api.js
  delSong(id: string) 
   {
     console.log('Inside delReq service');
    //  var url = this.delurl + id;
     var url = ConFile.songURL + 'delreq/' + id;
     console.log('Del Url:',url);
     return this.http.delete(url)
        .map(data => {
        data.json();
        return data.json();
      }); 

   }

}
