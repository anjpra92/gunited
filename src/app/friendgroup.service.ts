import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Group } from './frgroup';
import { ConFile } from './conf_file';

@Injectable()
export class FriendgroupService {

//   addFrnd2GrpUrl = "https://gunited-app-aprabha7.c9users.io/api/updgroup/";
//   fetchGrpDtlUrl = "https://gunited-app-aprabha7.c9users.io/api/group/";
//   fetchsGrpUrl = "https://gunited-app-aprabha7.c9users.io/api/getgroup/";
//   updReqplUrl = "https://gunited-app-aprabha7.c9users.io/api/updplgroup/";
//   delReqplUrl = "https://gunited-app-aprabha7.c9users.io/api/delplgroup/";
//   delReqUrl = "https://gunited-app-aprabha7.c9users.io/api/delgroup/";
//   fetchAllGrpUrl = "https://gunited-app-aprabha7.c9users.io/api/allgroup/";
//   delReqfrUrl = "https://gunited-app-aprabha7.c9users.io/api/delfrgroup";

  constructor(private http: Http) { }

  //Create a new group in the db with email,groupname,fremail - playlist will be empty from home component
  //fremail will be empty from songbook component
  saveGroup(group: Group) 
   {
        console.log('Inside saveGroup service');
        const body = JSON.stringify(group);
        const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
        return this.http.post('https://gunited-app-aprabha7.c9users.io/api/group/newgroup', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw("Error in FriendgroupService"));
    }

  //fremail will be empty from songbook component
   saveGroupPl(group: Group) 
   {
        console.log('Inside saveGroup service');
        const body = JSON.stringify(group);
        const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
        return this.http.post('https://gunited-app-aprabha7.c9users.io/api/group/newgrouppl', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw("Error in FriendgroupService"));
    }

  //Update the fremail for the given groupname
   updReq(aemail: string,gname:string,frmail:string) 
   {
     console.log('Inside updReq service');
     //addFrnd2GrpUrl = "https://gunited-app-aprabha7.c9users.io/api/updgroup/";
     var url = ConFile.groupURL + 'updgroup/' + aemail + `/` + gname + `/` + frmail;
     console.log('URL:',url);
     const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
     return this.http.put(url,{headers:Headers})
        .map(data => {
        data.json();
        return data.json();
      }); 
   }

   //Update the plname for the given groupname
   updReqpl(aemail: string,gname:string,plname:string) 
   {
     console.log('Inside updReqpl service');
     //updReqplUrl = "https://gunited-app-aprabha7.c9users.io/api/updplgroup/";
     var url = ConFile.groupURL + 'updplgroup/' + aemail + `/` + gname + `/` + plname;
     console.log('URL:',url);
     const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
     return this.http.put(url,{headers:Headers})
        .map(data => {
        data.json();
        return data.json();
      }); 
   }

   //Remove the plname from the given groupname
   delReqpl(aemail: string,gname:string,plname:string) 
   {
     console.log('Inside delReqpl service');
     //delReqplUrl = "https://gunited-app-aprabha7.c9users.io/api/delplgroup/";
     var url = ConFile.groupURL + 'delplgroup/' + aemail + `/` + gname + `/` + plname;
     console.log('URL:',url);
     const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
     return this.http.put(url,{headers:Headers})
        .map(data => {
        data.json();
        return data.json();
      }); 
   }

  //Remove the plname from the given groupname
   delReqfr(aemail: string,gname:string,fremail:string) 
   {
     console.log('Inside delReqfr service');
     //delReqfrUrl = "https://gunited-app-aprabha7.c9users.io/api/delfrgroup";
     var url = ConFile.groupURL + 'delfrgroup/' + aemail + `/` + gname + `/` + fremail;
     console.log('URL:',url);
     const headers = new Headers({'Content-Type': 'application/json','Accept': 'application/json'});
     return this.http.put(url,{headers:Headers})
        .map(data => {
        data.json();
        return data.json();
      }); 
   }

   //Remove the group from the grouplist db
   delReq(aemail: string,gname:string) 
   {
     console.log('Inside delReq service');
     //delReqUrl = "https://gunited-app-aprabha7.c9users.io/api/delgroup/";
     var url = ConFile.groupURL + 'delgroup/' + aemail + `/` + gname;
     console.log('Del Url:',url);
     return this.http.delete(url)
        .map(data => {
        data.json();
        return data.json();
      }); 
   }

   //Fetch all group names for the current email ID
    fetchGroupDetails(email:string)
    {
     console.log('Inside fetchGroupDetails service');
     //fetchGrpDtlUrl = "https://gunited-app-aprabha7.c9users.io/api/group/";
     var url  = ConFile.groupURL + email;
     console.log('URL:',url);
     return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
  }

  //Fetch one group fetchGroupDetail
    fetchGrpDet(gname:string,email:string)
    {
     console.log('Inside fetchGrpDet service');
     //fetchsGrpUrl = "https://gunited-app-aprabha7.c9users.io/api/getgroup/";
     var url  = ConFile.groupURL + 'getgroup/' + email + `/` + gname;
     console.log('URL:',url);
     return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
  }

    //Fetch all group Details
    fetchAllGrpDet()
    {
     console.log('Inside fetchAllGrpDet service');
     //fetchAllGrpUrl = "https://gunited-app-aprabha7.c9users.io/api/allgroup/";
     var url  = ConFile.allgroupURL;
     console.log('URL:',url);
     return this.http.get(url)
        .map(data => {
            data.json();
            return data.json();
    });
  }

}
