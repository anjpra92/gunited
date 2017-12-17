import { Injectable } from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConFile } from './conf_file';

@Injectable()
export class FetchusersService {

// fetchAllUsersUrl  = "https://gunited-app-aprabha7.c9users.io/api/users";
// updateUrl  = "https://gunited-app-aprabha7.c9users.io/api/userupdate";

  constructor(private http: Http) { }

  //Get the list of all users from Auth0 Database
  fetchAllUsers() 
  {
    console.log('Inside fetchAllUsers service');
    // console.log('URL:',this.fetchAllUsersUrl);
    var url = ConFile.usersURL;
    return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
  }
  
  updateUsers() 
  {
    console.log('Inside UpdateUsers service');
    //updateUrl  = "https://gunited-app-aprabha7.c9users.io/api/userupdate";
    var url = ConFile.usersURL + 'userupdate';
    console.log('URL:',url)
    return this.http.get(url)
        .map(data => {
            return data.text();
    });
  }

}
