import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {FetchusersService} from '../fetchusers.service';

const URL = "https://gunited-app-aprabha7.c9users.io/api/uploads";

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.component.html',
  styleUrls: ['./profileedit.component.css']
})
export class ProfileeditComponent implements OnInit {

  public uploader:FileUploader = new FileUploader({url: URL});
  fileName : String;

  age: any;
  ageFlg:Boolean = false;
  gender: String;
  skilllevel:String;
  gearUsed:String;
  aboutMe:String;
  proPic: Boolean = false;
  profilePic: any;
  name:any;
  tokenHolder:any;

  genders = ['Female', 'Male','Other'];
  levels = ["Novice","Intermediate","Professional"];

  constructor(private auth: AuthService, private authHttp: AuthHttp,private router:Router, private fetchService:FetchusersService) 
  {
    if(auth.userProfile.name)
    {
      this.name = auth.userProfile.name;
    }
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.age)
    {
      this.age = auth.userProfile.user_metadata.age;
    }
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.gender)
    {
      this.gender = auth.userProfile.user_metadata.gender;
    }
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.skilllevel)
    {
      this.skilllevel = auth.userProfile.user_metadata.skilllevel;
    }
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.gearUsed)
    {
      this.gearUsed = auth.userProfile.user_metadata.gearUsed;
    }
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.aboutMe)
    {
      this.aboutMe = auth.userProfile.user_metadata.aboutMe;
    }
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.profilePic)
    {
      this.proPic = true;
    }
  }

  ngOnInit() 
  {
      this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.profilePic="https://gunited-app-aprabha7.c9users.io/api/uploads/"+response;
      };
  }

   onSubmit() 
   {
      console.log('OnSubmit');
      this.fetchService.updateUsers().subscribe(
      data => {
      this.tokenHolder = data;
      var headers: any = 
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': this.tokenHolder
      }

      var info:any = JSON.stringify({
      user_metadata: {
      name:this.name,
      age: this.age,
      gender:this.gender,
      skilllevel:this.skilllevel,
      gearUsed:this.gearUsed,
      aboutMe:this.aboutMe,
      profilePic:this.profilePic
      }
     });
    
      this.authHttp.patch('https://' + 'gunited.auth0.com' + '/api/v2/users/' + this.auth.userProfile.user_id, info, {headers: headers})
        .map(response => response.json())
        .subscribe(
          response => {
            //Update profile
            this.auth.userProfile = response;
            localStorage.setItem('profile', JSON.stringify(response));
            this.router.navigate(['/profile']);
          },
          error => alert(error.json().message)
        );
      });
  }
}//Component close
