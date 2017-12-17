import { Component, OnInit,Renderer2 } from '@angular/core';
import {FriendgroupService} from '../friendgroup.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { PlayserviceService} from '../playservice.service';
import {FetchusersService} from '../fetchusers.service';
import { SongService } from '../song.service';
import { ConFile } from '../conf_file'

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
 
  noOldFlg:Boolean = false; // Flag is set when user has no groups
  groupDetail;
  allGroupDetail;
  sGroupDet;
  groupNameArr = [];
  playNameArr = [];
  friendArr = [];
  noPlFlg:Boolean = false;//Flag is set when the group selected to expand has no playlists
  expFlg:Boolean = false; // For groups
  exp1Flg:Boolean = false;// For shared playlists
  noFrFlg:Boolean = false;
  noShare:Boolean = false;//For shared PlayLists
  delRes;
  groupDet;
  playListArr = [];// with authemail and playlistArr;
  plsongArr = [];
  userDet = [];
  susers;
  finUserDet = [];
  savedSongs;
  toggleGroupName;
  togglePlName;
  toggleGrName;
  toggleFriendName;
  toggleFriendEmail;
  toggleRgName;
  expandArr = [];
  expandPlArr = [];


  constructor(private songSer:SongService,private fetchService:FetchusersService,private playser:PlayserviceService,private grpSer:FriendgroupService,private auth: AuthService,private router: Router,private renderer2:Renderer2) { }

  ngOnInit() 
  {
    this.fetchGroupsInfo();
    this.fetchAllGroupsInfo();
  }
  
  get songDelURL():ConFile
  {
    return ConFile.songDelURL;
  }
  
  get removeFriendURL():ConFile
  {
    return ConFile.removeFriendURL;
  }

   fetchGroupsInfo()
   {
    //Code to fetch group names from the DB if any
    console.log('Inside fetch groups info');
    this.grpSer.fetchGroupDetails(this.auth.userProfile.email).subscribe(
    data => {
        this.groupDetail = data;
        console.log('groupdet:',this.groupDetail);
        for(var i=0;i<this.groupDetail.length;i++)
        {
          this.groupNameArr.push(this.groupDetail[i].groupName);
          //Checks if useremail is present in the friendemails i.e if user is shared any group
        } 
        console.log("Group name array: ", this.groupNameArr);
        if(this.groupNameArr.length == 0)
        {
            console.log('No groups');
            this.noOldFlg = true;
        }
    });
  }

  fetchAllGroupsInfo()
  {
    console.log('Inside fetchAllGroupsInfo');
    this.grpSer.fetchAllGrpDet().subscribe(
    data => {
        this.allGroupDetail = data;
        console.log('allgroupdet:',this.allGroupDetail);
        for(var i=0;i<this.allGroupDetail.length;i++)
        {
          //Checks if useremail is present in the friendemails i.e if user is shared any group
          console.log('Friend emails:',this.allGroupDetail[i].friendEmails);
          if(this.allGroupDetail[i].friendEmails.length != 0)
          {
            if(this.allGroupDetail[i].friendEmails.indexOf(this.auth.userProfile.email)>-1)
            {
              console.log('MY EMAIL ID IS PRESENT IN THE LIST')
              var amail = this.allGroupDetail[i].authEmail;
              var plnames = this.allGroupDetail[i].playListNames;
              console.log('AuthEmail:',amail);
              console.log('Plnames:',plnames);
              for(var j=0;j<plnames.length;j++)
              {
                console.log('Inside for loop');
                var obj = {};
                obj["authemail"] = amail;
                obj["plname"] = plnames[j];
                console.log('PLNAME:',plnames[j]);
                this.playListArr.push(obj);
              }
              console.log('Playlistarr length:',this.playListArr.length);
            }
          }
        }
        if(this.playListArr.length == 0)
        {
                this.noShare = true;
        }
        console.log('PLAY LIST SHARED WITH ME:',this.playListArr);
    }); 
  }
  onExpandPlGroup(aemail,plname,i)
  {
   if(this.expandPlArr.length)
   {
       console.log('expandarr has content:',this.expandPlArr);
       var td = document.getElementById("t1object-"+this.expandPlArr[0]);
       console.log('TD ELEMENT TO hide:',td);
       this.renderer2.addClass(td,'hidden');
       var expButton = document.getElementById("e1object-"+this.expandPlArr[0]);
       console.log('expbutton close:',expButton);
       this.renderer2.removeStyle(expButton,'display');
       var clsButton = document.getElementById("c1object-"+this.expandPlArr[0]);
       console.log('clsButton close:',clsButton);
       this.renderer2.setStyle(clsButton,'display','none');
       this.exp1Flg = false;
       this.expandPlArr.splice(-1,1);
    }
   var n = i+1;
   console.log('Table element clicked expand:',n);
   console.log('aemail:',aemail);
   console.log('plname:',plname);
    this.playser.fetchPlist(aemail,plname).subscribe(
          data => {
            this.plsongArr = data;
            console.log('Response for fetching all songs corresponding to playlist name',this.plsongArr);
          });
    this.exp1Flg = true;
    var td = document.getElementById("t1object-"+n);
    console.log('TD ELEMENT TO DISPLAY:',td);
    this.renderer2.removeClass(td,'hidden');
    var expButton = document.getElementById("e1object-"+n);
    console.log('expbutton:',expButton);
    this.renderer2.setStyle(expButton,'display','none');
    var clsButton = document.getElementById("c1object-"+n);
    console.log('clsButton:',clsButton);
    this.renderer2.removeStyle(clsButton,'display');
    this.expandPlArr.push(n);
  }

  onNavClick(authemail,songName)
  {
      console.log('Friend email:',authemail);
      var id;
      this.songSer.fetchallSongs(authemail).subscribe(
      data => {
          this.savedSongs = data;
          for(var i=0;i<this.savedSongs.length;i++)
          {
            if(this.savedSongs[i].songName == songName)
            {
              id = this.savedSongs[i]._id;
            }
          }
          this.router.navigate(['/songview',id,'group']);
      });
  }

  closePlList(i)
  {
   var n = i+1;
   console.log('Table element clicked expand:',n);
   console.log('inside closelist');
   this.exp1Flg = false;
   var td = document.getElementById("t1object-"+n);
   console.log('TD ELEMENT TO hide:',td);
   this.renderer2.addClass(td,'hidden');
   var expButton = document.getElementById("e1object-"+n);
   console.log('expbutton close:',expButton);
   this.renderer2.removeStyle(expButton,'display');
   var clsButton = document.getElementById("c1object-"+n);
   console.log('clsButton close:',clsButton);
   this.renderer2.setStyle(clsButton,'display','none');
   if(this.expandPlArr.length)
   {
       console.log('Expand Arr has length');
       this.expandPlArr.splice(-1,1);
       console.log('EXPANDARR in closelist:',this.expandPlArr);
   }
  }

  onExpandGroup(groupname,i)
  {
   console.log('Onexpand group');
   if(this.expandArr.length)
   {
       console.log('expandarr has content:',this.expandArr);
       var td = document.getElementById("tobject-"+this.expandArr[0]);
       console.log('TD ELEMENT TO hide:',td);
       this.renderer2.addClass(td,'hidden');
       var expButton = document.getElementById("eobject-"+this.expandArr[0]);
       console.log('expbutton close:',expButton);
       this.renderer2.removeStyle(expButton,'display');
       var clsButton = document.getElementById("cobject-"+this.expandArr[0]);
        console.log('clsButton close:',clsButton);
       this.renderer2.setStyle(clsButton,'display','none');
       this.finUserDet = [];
       this.userDet = [];
       this.noPlFlg = false;
       this.expFlg = false;
       this.noFrFlg = false;
       this.expandArr.splice(-1,1);
    }
    var n = i+1;
    console.log('Table element clicked expand:',n);
    this.grpSer.fetchGrpDet(groupname,this.auth.userProfile.email).subscribe(
      data => {
        this.sGroupDet = data;
        console.log('Fetched single group detail:',this.sGroupDet);
        this.playNameArr = this.sGroupDet[0].playListNames;
        this.friendArr = this.sGroupDet[0].friendEmails;
        console.log('PlayList Names fetched:',this.playNameArr);
        console.log('Friends Fetched:',this.friendArr);
        // To get name associated with email
        this.fetchService.fetchAllUsers().subscribe(
        data => {
        this.susers = data;
        console.log("Fetched User Details: ", this.susers);
        //Only Displaying those users whose email id is verified
        for(var i=0;i<this.susers.length;i++)
          {
          if(this.susers[i].email_verified && this.susers[i].user_metadata)
            {
              var obj = {};
              if(!this.susers[i].user_metadata.name)
              {
                obj["name"] = this.susers[i].name;
              }
              else
              {
                obj["name"] = this.susers[i].user_metadata.name;
              }
              obj["email"]= this.susers[i].email;
              this.userDet.push(obj)
            }
          }
          console.log('Updated userdet object:',this.userDet);
          for(var i=0;i<this.friendArr.length;i++)
          {
            for(var j=0;j<this.userDet.length;j++)
            {
              if(this.friendArr[i].indexOf(this.userDet[j].email) > -1)
              {
                var obj = {};
                obj["name"] = this.userDet[j].name;
                obj["email"]= this.friendArr[i];
                this.finUserDet.push(obj);
              }
            } 
          }
          console.log('Final user detail:',this.finUserDet);
        });
        if(this.friendArr.length == 0 )
        {
          console.log('No Friends in group');
          this.noFrFlg = true;
        }
        if(this.playNameArr.length == 0)
        {
            console.log('No playLists');
            this.noPlFlg = true;
        }
          this.expFlg = true;
          //Show the div
           var td = document.getElementById("tobject-"+n);
           console.log('TD ELEMENT TO DISPLAY:',td);
           this.renderer2.removeClass(td,'hidden');
      });
      this.expFlg=true;
      var expButton = document.getElementById("eobject-"+n);
      console.log('expbutton:',expButton);
      this.renderer2.setStyle(expButton,'display','none');
      var clsButton = document.getElementById("cobject-"+n);
      console.log('clsButton:',clsButton);
      this.renderer2.removeStyle(clsButton,'display');
       this.expandArr.push(n);
  }

  closeList(i)
 {
   console.log('inside closelist');
   var n = i+1;
   this.finUserDet = [];
   this.userDet = [];
   console.log('Table element clicked close:',n);
   this.expFlg = false;
   this.noPlFlg = false;
   var td = document.getElementById("tobject-"+n);
   console.log('TD ELEMENT TO hide:',td);
   this.renderer2.addClass(td,'hidden');
   var expButton = document.getElementById("eobject-"+n);
   console.log('expbutton close:',expButton);
   this.renderer2.removeStyle(expButton,'display');
   var clsButton = document.getElementById("cobject-"+n);
    console.log('clsButton close:',clsButton);
   this.renderer2.setStyle(clsButton,'display','none');
   if(this.expandArr.length)
   {
       console.log('Expand Arr has length');
       this.expandArr.splice(-1,1);
       console.log('EXPANDARR in closelist:',this.expandArr);
   }
 }

 onDeleteGroup()
 {
    this.grpSer.delReq(this.auth.userProfile.email,this.toggleGroupName).subscribe(
        response => {
        this.delRes = response;
        this.router.navigate(['/group']);
      });
      
    //To Delete the element from the array of grouplist
      for (var n = 0 ; n < this.groupNameArr.length ; n++) 
      {
        if (this.groupNameArr[n] == this.toggleGroupName) 
        {
          var removedObject = this.groupNameArr.splice(n,1);
          removedObject = null;
          break;
        }
      }
      if(this.groupNameArr.length == 0)
      {
        this.noOldFlg = true;
      }
      if(this.groupNameArr.length == 1)
      {
        this.expandArr = [];
      }
      console.log('Updated grouplist array:',this.groupNameArr);
 }
 
 onConfGroup(i)
  {
      console.log("Check onconfgroup i:",i);
      this.toggleGroupName = this.groupNameArr[i];
      
  }
  
  onPlConfirm(plname,groupname)
  {
      console.log('ONPLCONFIRM');
      this.togglePlName = plname;
      this.toggleGrName = groupname;
  }
  
  navToSongBook()
  {
    this.router.navigate(['/songbook']);
  }
  
  navToHome()
  {
    this.router.navigate(['/']);
  }
  
  onSgConfirm(frname,fremail,grname)
  {
      console.log('onsgconfirm');
      this.toggleFriendName = frname;
      this.toggleFriendEmail = fremail;
      this.toggleRgName = grname;
  }
  
 onRemovePlayList()
 {
    this.grpSer.delReqpl(this.auth.userProfile.email,this.toggleGrName,this.togglePlName).subscribe(
    response => {
    this.groupDet = response;
   });
    //To Delete the element from the array of grouplist
    for (var n = 0 ; n < this.playNameArr.length ; n++) 
    {
      if (this.playNameArr[n] == this.togglePlName) 
      {
        var removedObject = this.playNameArr.splice(n,1);
        removedObject = null;
        break;
      }
    }
    if(this.playNameArr.length == 0)
    {
      this.noPlFlg = true;
    }
 }

 onRemoveFriend()
 {
    this.grpSer.delReqfr(this.auth.userProfile.email,this.toggleRgName,this.toggleFriendEmail).subscribe(
    response => {
    this.groupDet = response;
   });
    //To Delete the element from the array of grouplist
    for (var n = 0 ; n < this.finUserDet.length ; n++) 
    {
      // if (this.friendArr[n] == this.toggleFriendEmail) 
      if(this.finUserDet[n].email == this.toggleFriendEmail)
      {
        var removedObject = this.finUserDet.splice(n,1);
        removedObject = null;
        break;
      }
    }
    if(this.finUserDet.length == 0)
    {
      this.noFrFlg = true;
    }
 }

}
