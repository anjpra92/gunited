import { Component, OnInit,Renderer2,ViewChild,ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { SongService } from '../song.service';
import { ActivatedRoute,Router } from '@angular/router';
import { PlayserviceService} from '../playservice.service';
import {FriendgroupService} from '../friendgroup.service';
import { ConFile } from '../conf_file';

@Component({
  selector: 'app-songbook',
  templateUrl: './songbook.component.html',
  styleUrls: ['./songbook.component.css']
})
export class SongbookComponent implements OnInit {
  authEmail;
  savedSongs = [];
  delRes;
  delResp;
  checkBoxArr = [];
  snameFilter:any = {songName:''};
  pnameFilter:any;
  //To Hold the song names that are passed to the playlist component
  snameArr = [];
  plsongArr = [];
  playListFlg:Boolean = false;
  succFlg:Boolean = false;
  chkboxFlg:Boolean = false;
  showPlist:Boolean = false;
  noPlist:Boolean = false;
  expFlg:Boolean = false;
  noSongSave:Boolean = false;
  changeTrigger = 1;
  //To hold the updated playlist content
  playListDet = [];
  plNameArr =[];
  //Flags for FriendGroup Component
  showGrpComp:Boolean = false;
  songBookcall:Boolean = false;
  playListAdd;
  //Group Details
  groupDetail;
  groupDet;
  toggleName;
  expandArr = [];
  songId;
  toggleSName;
  checkIndex;
  plCheckIndex;

  constructor(private songSer:SongService, private auth:AuthService,private router:Router,private playser:PlayserviceService,private renderer2:Renderer2,private grpSer:FriendgroupService) 
  {
    console.log('Inside constructor - auth email:',auth.userProfile.email);
   
  }
  
 get expandURL():ConFile
  {
    return ConFile.expandURL;
  }
  
  get closeexpandURL():ConFile
  {
    return ConFile.closeexpandURL;
  }
  
  get shareURL():ConFile
  {
    return ConFile.shareURL;
  }
  
  get closeURL():ConFile
  {
    return ConFile.closeURL;
  }

  ngOnInit() 
  {
        this.authEmail = this.auth.userProfile.email;
        this.songSer.fetchallSongs(this.authEmail).subscribe(
        data => {
          this.savedSongs = data;
          if(this.savedSongs.length == 0)
          {
             this.noSongSave = true; 
          }
        });
        this.displayPlaylists();
  }
  
  onConfirmation(sname,songid,i)
  {
      console.log('onConfirmation');
      console.log('CHECK SONG ID:',songid);
      var n = i + 1;
      this.songId = songid;
      console.log('SongID:',this.songId);
      this.toggleSName = sname;
      this.checkIndex = "object-"+n;
      console.log('CHECK INDEX:',this.checkIndex);
  }
  
  onPlConfirm(i)
  {
    console.log('OnPlCONFIRM');
    var playListName = this.plNameArr[i];
    console.log('PLAYLIST CHOSEN TO DELETE',playListName);
    this.toggleName = playListName;
    this.plCheckIndex = i+1;
  }
  
  onConfDelete(i)
  {
      var n = i + 1;
      var alertDiv = document.getElementById("asobject-"+n);
      var delBut = document.getElementById("asbutton-"+n);
      this.renderer2.addClass(delBut,'hidden');
      this.renderer2.removeClass(alertDiv,'hidden');
      
  }

  //Navigation to songview component
  onNavClick(songName)
  {
    var id;
    console.log('Inside navclick');
    console.log('Saved Song DET:',this.savedSongs);
    for( var i=0;i<this.savedSongs.length;i++)
    {
      if(this.savedSongs[i].songName == songName)
      {
        console.log('When it is equal');
        id = this.savedSongs[i]._id;
      }
    }
    console.log('Song ID:',id);
    this.router.navigate(['/songview',id,'songbook']);
  }

  //Song Deletion
   onDelete(){
        
        console.log('ID value from html template in onDelete:',this.songId);
        console.log('Inside Delete Call');
        this.songSer.delSong(this.songId).subscribe(
        response => {
        this.delRes = response;
        //redirect to songbook component
        this.router.navigate(['/songbook']);
        });
        //Delete the song from Playlists
        this.playser.delSongPl(this.toggleSName,this.authEmail).subscribe(
        response => {
        this.delRes = response;
        //redirect to songbook component
        this.router.navigate(['/songbook']);
        });
      //To Delete the element from the array of song objects
      for (var n = 0 ; n < this.savedSongs.length ; n++) 
      {
        if (this.savedSongs[n]._id == this.songId) 
        {
          var removedObject = this.savedSongs.splice(n,1);
          removedObject = null;
          break;
        }
      }
       if(this.savedSongs.length == 0)
       {
             this.noSongSave = true; 
       }
       if(this.chkboxFlg)
       {
           this.checkBoxArr.splice(this.checkBoxArr.indexOf(this.checkIndex),1);
           if(this.playListFlg)
            {
                this.onPlayListSave();
            }
       }
      console.log('Updated array:',this.savedSongs);
  }
  
  onSCancel(i)
  {
      var n = i + 1;
      var delBut = document.getElementById("asbutton-"+n);
      this.renderer2.removeClass(delBut,'hidden')
      var alertDiv = document.getElementById("asobject-"+n);
      this.renderer2.addClass(alertDiv,'hidden'); 
  }

  //PlayList Deletion
  onDeleteList()
  {
    console.log('Inside playlist delete');
    console.log('toggleName:',this.toggleName);
    //Fetch all the group details
    this.grpSer.fetchGroupDetails(this.auth.userProfile.email).subscribe(
    data => {
        this.groupDetail = data;
        console.log('groupdet:',this.groupDetail);
        for(var i=0;i<this.groupDetail.length;i++)
        {
          if(this.groupDetail[i].playListNames.indexOf(this.toggleName) > -1)
          {
            this.grpSer.delReqpl(this.auth.userProfile.email,this.groupDetail[i].groupName,this.toggleName).subscribe(
            response => {
              this.groupDet = response;
            });
          }
        }     
    });
    this.playser.delPlayList(this.toggleName,this.auth.userProfile.email).subscribe(
        response => {
        this.delResp = response;
        this.router.navigate(['/songbook']);
      });
      
    //To Delete the element from the array of playlist
      for (var n = 0 ; n < this.plNameArr.length ; n++) 
      {
        if (this.plNameArr[n] == this.toggleName) 
        {
          var removedObject = this.plNameArr.splice(n,1);
          removedObject = null;
          break;
        }
      }
      if(this.plNameArr.length == 0)
       {
            this.noPlist = true;
       }
       if(this.plNameArr.length == 1)
       {
            this.expandArr = [];
       }
      console.log('Updated playlist array:',this.plNameArr);
  }

 // Maintain a list of checkbox id's that were selected
 saveClick(e)
 {
     console.log('Inside checkbox click');
     var str = e.target.id;
     if (str.substring(0, 1) == 'c') 
     { 
        str = str.substring(1);
     }
     if(e.target.checked)
     {

        //Will have the object ids of the span tag having the songName
        this.checkBoxArr.push(str);
        console.log('Checkbox Array Set Anjana:',this.checkBoxArr);
     }
     else
     {
         this.checkBoxArr.splice(this.checkBoxArr.indexOf(str),1);
         console.log('Checkbox Array Popped:',this.checkBoxArr);
     }
     console.log('Checkbox array in saveclick:',this.checkBoxArr);
     if(this.checkBoxArr.length == 0)
     {
       console.log('Checkbox array is empty');
       this.chkboxFlg = false;
     }
     else
     {
       console.log('Checkbox array is not empty');
       this.chkboxFlg = true;
     }
     //Keep the songnameArr updated if the playListFlg is set 
     if(this.playListFlg)
     {
       this.onPlayListSave();
     }

 }

 plistUpdate(obj)
 {
  console.log('Inside plistupdate');
  //Uncheck all the checkboxes
  var checkBox = document.getElementsByClassName("chkbox");
  for(var i=0;i<checkBox.length;i++)
  {
      this.renderer2.setProperty(checkBox[i],'checked',false);
      this.chkboxFlg = false;      
  }
  this.succFlg = false;
  this.playListFlg = false;
  this.noPlist = false;
  this.checkBoxArr = [];
  this.plNameArr.push(obj);
  this.plNameArr = this.plNameArr.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
  })
  console.log('PLNAME ARRAY:',this.plNameArr);
 }

 cancelDiv()
 {
  console.log('Inside cancelDiv');
  //Uncheck all the checkboxes
  var checkBox = document.getElementsByClassName("chkbox");
  for(var i=0;i<checkBox.length;i++)
  {
      this.renderer2.setProperty(checkBox[i],'checked',false);
      this.chkboxFlg = false;      
  }
  this.succFlg = false;
  this.playListFlg = false;
  this.noPlist = false;
  this.checkBoxArr = [];
 }

 expandList(playList,i)
 {
   console.log('Inside EXPANDLIST')
   if(this.expandArr.length)
   {
       console.log('expandarr has content:',this.expandArr);
       var td = document.getElementById("tobject-"+this.expandArr[0]);
       this.renderer2.addClass(td,'hidden');
       var expButton = document.getElementById("eobject-"+this.expandArr[0]);
       console.log('expbutton CHECK close:',expButton);
       this.renderer2.removeStyle(expButton,'display');
       var clsButton = document.getElementById("ccobject-"+this.expandArr[0]);
       console.log('clsButton CHECK close:',clsButton);
       this.renderer2.setStyle(clsButton,'display','none');
       this.expandArr.splice(-1,1);
   }
   var n = i+1;
   console.log('Table element clicked expand:',n);
   console.log('Expand List:',playList);
    this.playser.fetchPlist(this.auth.userProfile.email,playList).subscribe(
          data => {
            this.plsongArr = data;
            console.log('Response for fetching all songs corresponding to playlist name',this.plsongArr);
          });
    this.expFlg = true;
    var td = document.getElementById("tobject-"+n);
    console.log('TD anj ELEMENT TO DISPLAY:',td);
    this.renderer2.removeClass(td,'hidden');
    var expButton = document.getElementById("eobject-"+n);
    console.log('expbutton:',expButton);
    this.renderer2.setStyle(expButton,'display','none');
    var clsButton = document.getElementById("ccobject-"+n);
    console.log('clsButton:',clsButton);
    this.renderer2.removeStyle(clsButton,'display');
    this.expandArr.push(n);
    //expandarr
 }

 closeList(i)
 {
   var n = i+1;
   console.log('Table element clicked expand:',n);
   console.log('inside closelist');
   this.expFlg = false;
   var td = document.getElementById("tobject-"+n);
   console.log('TD CHECK ELEMENT TO hide:',td);
   this.renderer2.addClass(td,'hidden');
   var expButton = document.getElementById("eobject-"+n);
   console.log('expbutton CHECK close:',expButton);
   this.renderer2.removeStyle(expButton,'display');
   var clsButton = document.getElementById("ccobject-"+n);
   console.log('clsButton CHECK close:',clsButton);
   this.renderer2.setStyle(clsButton,'display','none');
   if(this.expandArr.length)
   {
       console.log('Expand Arr has length');
       this.expandArr.splice(-1,1);
       console.log('EXPANDARR in closelist:',this.expandArr);
   }
 }
 //todoo
 onDeleteSong(id)
 {
   console.log('Inside ondeletesong:',id);
   this.playser.delsngPlayList(id).subscribe(
    response => {
        this.delResp = response;
        this.router.navigate(['/songbook']);
      }); 
    for(var i=0;i<this.plsongArr.length;i++)
    {
       if (this.plsongArr[i]._id == id) 
        {
          var removedObject = this.plsongArr.splice(i,1);
          removedObject = null;
          break;
        }
    }
    console.log('Updated song list:',this.plsongArr);
 }

 displayPlaylists()
 {
      this.playser.fetchallPlists(this.auth.userProfile.email).subscribe(
      data => {
        this.playListDet = data;
        console.log('Pldet:',this.playListDet);
        for(var i=0;i<this.playListDet.length;i++)
        {
          this.plNameArr.push(this.playListDet[i].playlistName)
        } 
        //Remove duplicates
        this.plNameArr = this.plNameArr.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })
        console.log("Plname array: ", this.plNameArr);
        if(this.plNameArr.length == 0)
        {
            this.noPlist = true;
        }
    });
 }

 onPlayListSave()
 {
   console.log('Onplaylist save')
   this.snameArr =[];
   console.log('Check checkBoxarr:',this.checkBoxArr);
   for(var i=0;i<this.checkBoxArr.length;i++)
   {
     var span = document.getElementById(this.checkBoxArr[i]);
     var sname = span.innerHTML;
     console.log('Song Name obtained:',sname);
     this.snameArr.push(sname);
   }
   console.log('SongNameArray:',this.snameArr);
   console.log('Playlistflg:',this.playListFlg);
   this.playListFlg = true;
   this.succFlg = true;
   this.changeTrigger++;
   var middleDiv = document.getElementById("middle");
   middleDiv.scrollIntoView(true);
 }

 onShare(playListName)
 {
   console.log('Inside onshare');
   this.playListAdd = playListName;
   this.songBookcall = true;
   this.showGrpComp = true;
   var container1Div = document.getElementById("conTainer1");
   container1Div.scrollIntoView(true);
 }

 flgDisableSong(obj)
 {
    console.log('Flag Disable Song');
    console.log('obj.val1:',obj.val1);
    if(obj.val1)
    {
      this.showGrpComp = false;
      this.songBookcall = false;
    }
    else if(!obj.val1)
    {
      this.showGrpComp = true;
      this.songBookcall = true;
    }
 }

}
