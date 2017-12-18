import { Component, OnInit,Input, Output,EventEmitter,Renderer2,ViewChild,ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute,Router } from '@angular/router';
import {FriendgroupService} from '../friendgroup.service';
import { Group } from '../frgroup';
@Component({
  selector: 'app-frndgrp',
  templateUrl: './frndgrp.component.html',
  styleUrls: ['./frndgrp.component.css']
})
export class FrndgrpComponent implements OnInit {

  @Input('fremail') fr_email:any;
  @Input()index:any;
  @Output() flgDisableEvent = new EventEmitter();
  @ViewChild('optionDiv') optionDiv:ElementRef;
  @Input('songBookcall') songBookcall:any;
  @Input('playListAdd') playListAdd:any;
  opFlg:Boolean = false;
  op1Flg:Boolean = false;
  op2Flg:Boolean = false;
  succFlg:Boolean = false;
  noOldFlg:Boolean = false;
  errFlg:Boolean = false;
  updErrFlg:Boolean = false;
  scall:Boolean = false;
  //To store the value given in the templateUrl
  gOpt;
  gName;//op1
  oldgName;//op2
  olNameArr = [];
  groupdet;
  groupDetail;
  groupRes;
  friendArr;
  playNameArr;

  constructor(private grpSer:FriendgroupService,private route: ActivatedRoute, private renderer2 : Renderer2,private auth: AuthService,private router: Router) { }

  ngOnInit() 
  {
    this.fetchGroupsInfo();
    //this.succFlg = false;
  }

  fetchGroupsInfo()
  {
    //Code to fetch group names from the DB if any
    this.grpSer.fetchGroupDetails(this.auth.userProfile.email).subscribe(
    data => {
        this.groupDetail = data;
        for(var i=0;i<this.groupDetail.length;i++)
        {
          this.olNameArr.push(this.groupDetail[i].groupName)
        } 
        if(this.olNameArr.length == 0)
        {
            this.noOldFlg = true;
        }
    });
  }

  ngOnDestroy() { console.log(`onDestroy`); }

  setFlg()
  {
    if(this.gOpt == 'newg')
    {
      this.op1Flg = true;
      this.op2Flg = false;
      //this.opFlg = true;
      this.renderer2.addClass(this.optionDiv.nativeElement,'hidden');
    }
    else if(this.gOpt == 'oldg')
    {
      this.op2Flg = true;
      this.op1Flg = false;
      //this.opFlg = true;
      this.renderer2.addClass(this.optionDiv.nativeElement,'hidden');
    }
  }

  checkDuplicate()
  {
    if(!this.noOldFlg)
    {
      if(this.olNameArr.indexOf(this.gName) > -1)
      {
        this.errFlg = true;
      }
      else
      {
        this.errFlg = false;
      }
    }   
  }

  addFrndToGrp()
  {
    this.checkDuplicate();
    if(this.songBookcall)
    {
      this.scall = true;
    }
    else
    {
      this.scall = false;
    }
    //From Home Page
    if(!this.errFlg && !this.scall)
    {

      this.gName = this.gName.charAt(0).toUpperCase()+this.gName.slice(1);
      const group = new Group(this.auth.userProfile.email,this.gName,this.fr_email,'');
      this.grpSer.saveGroup(group).subscribe(
          response => 
          {
              this.groupdet = response;
          });
     this.succFlg = true;
     this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
     //this.opFlg = false;
     this.op1Flg = false;
     this.op2Flg = false;
     this.noOldFlg = false;
     this.errFlg = false;
     let val1 = this.succFlg;
     let val2 = this.index;
     this.flgDisableEvent.emit({val1,val2});
    }
    else if(!this.errFlg && this.scall)
    {
      const group = new Group(this.auth.userProfile.email,this.gName,'',this.playListAdd);
      this.grpSer.saveGroupPl(group).subscribe(
          response => 
          {
              this.groupdet = response;
          });
     this.succFlg = true;
     this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
     this.op1Flg = false;
     this.op2Flg = false;
     this.noOldFlg = false;
     this.errFlg = false;
     let val1 = this.succFlg;
     let val2 = this.index;
     this.flgDisableEvent.emit({val1,val2});
     //this.flgDisableEvent.emit(val1);
     }
  }

  updateGrp()
  {
    if(this.songBookcall)
    {
      this.scall = true;
    }
    else
    {
      this.scall = false;
    }
    if(!this.scall)
    {
      this.fetchGroupDet(this.oldgName,this.fr_email);
    }
    else if(this.scall)
    {
      this.fetchGroupDetPl(this.oldgName,this.playListAdd);
    }
  }

  setOptFlg()
  {
    this.succFlg = false;
    this.op1Flg = false;
    this.op2Flg = false;
    this.noOldFlg = false;
    this.errFlg = false;
    this.updErrFlg = false;
    this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
    var rb1 = document.getElementById("rb1");
    if(rb1)
    {
      this.renderer2.setProperty(rb1,'checked',false);
    }
    var rb2 = document.getElementById("rb2");
    if(rb2)
    {
      this.renderer2.setProperty(rb2,'checked',false);
    }  
  }

  disableFlgs()
  {
    this.op1Flg = false;
    this.op2Flg = false;
    this.noOldFlg = false;
    this.errFlg = false;
    this.updErrFlg = false;
    //this.opFlg = false;
    this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
    var rb1 = document.getElementById("rb1");
    if(rb1)
    {
      this.renderer2.setProperty(rb1,'checked',false);
    }
    var rb2 = document.getElementById("rb2");
    if(rb2)
    {
      this.renderer2.setProperty(rb2,'checked',false);
    }  
    this.succFlg = true;
    let val1 = this.succFlg;
    let val2 = this.index;
    this.flgDisableEvent.emit({val1,val2});
    // this.flgDisableEvent.emit(this.succFlg);
  }

  fetchGroupDet(gname,fremail)
  {
    console.log('Inside fetchGroupDet in component');
    this.grpSer.fetchGrpDet(gname,this.auth.userProfile.email).subscribe(
    data => {
        this.groupRes = data;
        this.friendArr = this.groupRes[0].friendEmails;
        if(this.friendArr.indexOf(fremail)>-1)
        {
          this.updErrFlg = true;
        }
        if(!this.updErrFlg)
        {
          this.grpSer.updReq(this.auth.userProfile.email,this.oldgName,this.fr_email).subscribe(
            response => {
              this.groupdet = response;
              //this.router.navigate(['/home']);
            });
          this.succFlg = true;
          //this.opFlg = true;
          this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
          this.op1Flg = false;
          this.op2Flg = false;
          this.noOldFlg = false;
          this.errFlg = false;
          this.updErrFlg = false;
          let val1 = this.succFlg;
          let val2 = this.index;
          this.flgDisableEvent.emit({val1,val2});
          // this.flgDisableEvent.emit(this.succFlg);
        }
    });
  }

  fetchGroupDetPl(gname,plname)
  {
    console.log('Inside fetchGroupDetPl in component');
    this.grpSer.fetchGrpDet(gname,this.auth.userProfile.email).subscribe(
    data => {
        this.groupRes = data;
        this.playNameArr = this.groupRes[0].playListNames;
        if(this.playNameArr.length != 0)
        {
            if(this.playNameArr.indexOf(plname)>-1)
            {
              this.updErrFlg = true;
            }
        }
        if(!this.updErrFlg)
        {
          this.grpSer.updReqpl(this.auth.userProfile.email,this.oldgName,plname).subscribe(
            response => {
              this.groupdet = response;
            });
          this.succFlg = true;
          this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
          this.op1Flg = false;
          this.op2Flg = false;
          this.noOldFlg = false;
          this.errFlg = false;
          this.updErrFlg = false;
          let val1 = this.succFlg;
          let val2 = this.index;
          this.flgDisableEvent.emit({val1,val2});
          // this.flgDisableEvent.emit(val1);
          // this.flgDisableEvent.emit(this.succFlg);
        }
    });
  }
}
