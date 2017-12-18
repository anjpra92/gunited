import { Component, OnInit,Renderer2 } from '@angular/core';
import { AuthService } from '../auth.service'
import { AuthHttp } from 'angular2-jwt';
import {FetchusersService} from '../fetchusers.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router ,ActivatedRoute } from '@angular/router';
import { Http, Response }from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConFile } from '../conf_file';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //url = "http://localhost:3000/api/users";
  susers = [];
  users = [];
  //To store member count
  userLength:number;
  nameFilter: any = {name: ''};
  nicknameFilter:any = {nickname:''};
  showGrpComp:Boolean = false;
  fremail;
  authemail;
  config = [];
  sub:any;

  constructor(private renderer2:Renderer2,private auth:AuthService, private authHttp: AuthHttp, private fetchService:FetchusersService, private router:Router,private route: ActivatedRoute )
  {

  }

  
  get guitar1URL():ConFile
  {
    return ConFile.guitar1URL;
  }
  
  get guitar2URL():ConFile
  {
    return ConFile.guitar2URL;
  }
  
    get guitar3URL():ConFile
  {
    return ConFile.guitar3URL;
  }
  
  get defaultURL():ConFile
  {
    return ConFile.defaultURL;
  }

  ngOnInit() 
  {

    console.log('Inside ngoninit');
    this.fetchService.fetchAllUsers().subscribe(
    data => {
      this.susers = data;
      this.userLength = this.susers.length; 
      //Only Displaying those users whose email id is verified
      for(var i=0;i<this.susers.length;i++)
      {
        if(this.susers[i].email_verified && this.susers[i].user_metadata)
          {
            this.users.push(this.susers[i]);
          }
      }
    });
  }

  addGrpFlg(friendemail,i)
  {
    console.log('showGrpComp be4:',this.showGrpComp);
    this.fremail = friendemail;
    var n = i+1;
    var div = document.getElementById("gobject-"+n);
    this.renderer2.removeClass(div,'hidden');
    this.showGrpComp = true;
  }

  flgDisable(obj)
  {
    //Close the friendgroup component for that user
    console.log('OBJECT TO CHECK:',obj)
    if(obj.val1)
    {
      this.showGrpComp = false;
      var n = obj.val2+1;
      var div = document.getElementById("gobject-"+n);
      this.renderer2.addClass(div,'hidden');
    }
    else if(!obj.val)
    {
      this.showGrpComp = true;
    }
  }
  
  callSongBook()
  {
    this.router.navigate(['/songbook']);
  }
  
  callChordPro()
  {
    this.router.navigate(['/convert']);
  }

}
