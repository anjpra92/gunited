import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  emailCheck : Boolean = false;
  propic : Boolean = false;
 
  constructor(private auth:AuthService) 
  {
    this.emailCheck = this.auth.userProfile.email_verified;
    if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.profilePic)
    {
      this.propic = true;
    }
  }

  ngOnInit() {
  }

}
