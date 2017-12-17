import { Component, OnInit,Input , ViewChild, ElementRef,OnChanges,ChangeDetectionStrategy,SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ViewEncapsulation,Renderer2 } from '@angular/core';
import { AuthService } from '../auth.service';
import { PlayserviceService} from '../playservice.service';
import { PlayList} from '../playListSave';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit,OnChanges {

  @Input('snameArr') snameArr: any;
  @Input('changeTrigger') changeTrigger: any;
  @Input('plNameArr')plNameArri:any;
  @Input()succ:any;
  @Output() 
  plsaveEvent = new EventEmitter();
  @Output() 
  cancelEvent = new EventEmitter();
  @ViewChild('optionDiv') optionDiv:ElementRef;
  songArr = [];
  op1Flg:Boolean = false;
  testFlg:boolean = false;
  op2Flg:Boolean = false;
  noOldFlg:Boolean = false;
  errFlg:Boolean = false;
  opFlg:Boolean = false;
  disButFlg:Boolean = false;
  pldet;
  plRes;
  plNameArr = [];
  plOpt;
  authEmail;
  plName;
  oldPlname;
  plNamesave;

  constructor(private playSer:PlayserviceService,private route: ActivatedRoute, private renderer2 : Renderer2,private auth: AuthService,private router: Router) 
  {
     console.log('Inside PL constructor');
     //this.opFlg = false;
   }

   ngOnChanges(changes:SimpleChanges) 
   {
      console.log('changed things:',changes);
      if(this.succ)
      {
        console.log('Inside successflg');
        var rb1 = document.getElementById("rb1");
        console.log('RB1:',rb1);
        if(rb1)
        {
           console.log('Checked false for rb1');
           this.renderer2.setProperty(rb1,'checked',false);
        }
        var rb2 = document.getElementById("rb2");
        console.log('RB1:',rb1);
        if(rb2)
        {
          console.log('Checked false for rb2');
          this.renderer2.setProperty(rb2,'checked',false);
        }  
        this.testFlg = false;
      }
      if(this.snameArr)
      {
        console.log('Inside changes');
        this.songArr = [];
        this.songArr = this.snameArr;
        if(this.songArr.length == 0)
        {
          this.disButFlg = true;
        }
        else
        {
          this.disButFlg = false;
        }
      } 
   }

  ngOnInit() 
  {
    console.log('Playlist oninit');
  }

  disableFlgs()
  {
    this.testFlg = true;
    this.op1Flg = false;
    this.op2Flg = false;
    this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
    this.cancelEvent.emit();
  }

  setFlg()
  {
    console.log('Inside set flag')
    if(this.plOpt === 'new')
    {
      this.op1Flg = true;
      this.op2Flg = false;
      //this.opFlg = true;
      this.renderer2.addClass(this.optionDiv.nativeElement,'hidden');
      this.songArr = this.snameArr;
    }
    else if(this.plOpt === 'old')
    {
      this.op2Flg = true;
      this.op1Flg = false;
      //this.opFlg = true;
      this.renderer2.addClass(this.optionDiv.nativeElement,'hidden');
      this.songArr = this.snameArr;
      //fetch playlists of the user
      this.playSer.fetchallPlists(this.auth.userProfile.email).subscribe(
        data => {
            this.pldet = data;
            console.log('Pldet:',this.pldet);
            console.log('Check:',this.pldet[0].playlistName);
            for(var i=0;i<this.pldet.length;i++)
            {
              this.plNameArr.push(this.pldet[i].playlistName)
            } 
            //Remove duplicates
            this.plNameArr = this.plNameArr.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            })
            console.log("Plname array: ", this.plNameArr);
            if(this.plNameArr.length == 0)
            {
                console.log()
                this.noOldFlg = true;
            }
       });
    }
  }

  checkDuplicate()
  {
    console.log('Check for duplicates');
    console.log('ARRAY FROM PARENT:',this.plNameArri);
    if(this.plNameArri.length)
    {
      if(this.plNameArri.indexOf(this.plName) > -1)
      {
       this.errFlg = true;
       console.log('Error Flag:',this.errFlg);
      }
      else
      {
      this.errFlg = false;
      }
    }
    else
    {
      this.errFlg = false;
    }
    
  }

  playListSave()
  {
    
    if(this.op1Flg)
    {
        this.checkDuplicate();
        if(!this.errFlg)
        {
          this.plNamesave = this.plName;
        }   
    }
    else if(this.op2Flg)
    {
        this.plNamesave = this.oldPlname;
    }
    else if(this.op2Flg && this.noOldFlg)
    {
        this.checkDuplicate();
        if(!this.errFlg)
        {
          this.plNamesave = this.plName;
        } 
    }
     if(!this.errFlg)
     {
        for(var i=0;i<this.songArr.length;i++)
        {
        console.log('Song being saved:',this.songArr[i]);
        console.log('plNamesave name:',this.plNamesave);
        this.plNamesave = this.plNamesave.charAt(0).toUpperCase()+this.plNamesave.slice(1);
        const plist = new PlayList(this.auth.userProfile.email,this.plNamesave,this.songArr[i]);
        this.playSer.savePlayList(plist).subscribe(
          response => 
          {
              this.plRes = response;
              console.log('Got Response after saving:',response);
          });
        }
        console.log('Setting flags');
        this.testFlg = true;
        this.op1Flg = false;
        this.op2Flg = false;
        //this.opFlg = false;
        this.renderer2.removeClass(this.optionDiv.nativeElement,'hidden');
        this.plsaveEvent.emit(this.plNamesave);
      }
    }
}
