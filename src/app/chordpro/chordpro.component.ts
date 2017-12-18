import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit,OnChanges,ChangeDetectorRef,SimpleChanges} from '@angular/core';
import { ChordPro } from '../chordformat';
import { ChordPos } from '../chordDefine';
import { CustomFormat } from '../customformat';
import { SongComponent } from '../song/song.component';
import { ActivatedRoute,Router } from '@angular/router';
import { ViewEncapsulation,Renderer2 } from '@angular/core';
import { AuthService } from '../auth.service';
import { SongService } from '../song.service';
import { SongBook } from '../songSave';
import { DomSanitizer} from '@angular/platform-browser';
import { ConFile } from '../conf_file'
import * as JSZip from 'jszip';

@Component({
  selector: 'app-chordpro',
  templateUrl: './chordpro.component.html',
  styleUrls: ['./chordpro.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChordproComponent implements OnInit 
{
 
 @ViewChildren('songlist') components: QueryList<SongComponent>;
 @ViewChild('verseHtml') verseHtml:ElementRef;
 @ViewChild('chordHtml') chordHtml:ElementRef;
 private Song:SongComponent
  SongArr = [];
  input:String;
  testArr=[];
  inpArr=[];
  bClicked:Boolean = false;
  showImgs:Boolean = false;
  showFmts:Boolean = false;
  hoverImgs:Boolean = false;
  listFlg:Boolean = false;
  op1Flg:Boolean = false;
  op2Flg:Boolean = false;
  op3Flg:Boolean = false;
  opFlg:Boolean = false;
  disableFlg:Boolean = false;
  textFile;
  aiCounter=0;
   //To trigger ngonchange
  changeTrigger = 1;
  cusForm:CustomFormat;
  //Case 1
  fileContent = [];
  result;
  op2Arr = [];
  sampArr = [];
 //Testing for Song Display from DB
  songDetails:any;
  verseHTML;
  chordHTML;
  acidjsHTML;
  checkBoxArr = [];
  songListFlg:Boolean = false;
  songDb;
  //Calling Song Service to save in DB
  authEmail;
  songName:String;
  songvHtml:String;
  songdHtml:String;
  songSerRes;
  ngdivtags;
  songDefHtml;
  allSelected:Boolean = false;
  disabledBox;
  disabledChk = [];

  constructor(private renderer2 : Renderer2,private sanitizer: DomSanitizer,private cdr: ChangeDetectorRef,private route: ActivatedRoute,private router: Router,private auth:AuthService,private songSer:SongService) 
  {

  }
   
  get option1URL():ConFile
  {
    return ConFile.option1URL;
  }
  
  get option2URL():ConFile
  {
    return ConFile.option2URL;
  }
  
    get option3URL():ConFile
  {
    return ConFile.option3URL;
  } 
   
   
// Maintain a list of checkbox id's that were selected
 saveClick(e)
 {
     console.log('Inside save click');
     var str = e.target.id;
     if (str.substring(0, 1) == 'c') 
     { 
        str = str.substring(1);
     }
     if(e.target.checked)
     {
         this.checkBoxArr.push(str);
     }
     else
     {
         this.checkBoxArr.splice(this.checkBoxArr.indexOf(str),1);
     }
 }
//Select All Songs 
selectAllSongs()
{
    console.log('Inside Select All');
    var checkboxes = document.getElementsByClassName("enabled");
    for(var i=0;i<checkboxes.length;i++)
    {
        var str:any;
        str = checkboxes[i].id;
        if (str.substring(0, 1) == 'c') 
        { 
          str = str.substring(1);
        }
        if(this.checkBoxArr.indexOf(str) <= -1)
        {
          this.renderer2.setProperty(checkboxes[i],'checked',true);
          this.checkBoxArr.push(str);
        }
    }
}
//Save only selected songs
 saveSelected()
 {
    console.log('Inside Save Selected');
    this.songDb = this.components.toArray();
    for(var i=0;i<this.songDb.length;i++)
    {
        var str = this.songDb[i].elementRef.nativeElement.firstChild.id;
        if (str.substring(0, 1) == 's') 
        { 
          str = str.substring(1);
        }
        if(this.checkBoxArr.indexOf(str) > -1)
        {
            this.songConsolidate(this.songDb,i);
        }
    }
    //Making the checkboxes whose songs are saved as disabled
    var checkBox = document.getElementsByClassName("chkbox");
    var count = 0;
    for(var i=0;i<checkBox.length;i++)
    {
        var str:any;
        str = checkBox[i].id;
        if (str.substring(0, 1) == 'c') 
        { 
          str = str.substring(1);
        }
        if(this.checkBoxArr.indexOf(str) > -1)
        {
            this.renderer2.setProperty(checkBox[i],'checked',false);
            this.renderer2.setProperty(checkBox[i],'disabled',true);
            this.renderer2.removeClass(checkBox[i],'enabled');
            this.renderer2.addClass(checkBox[i],'disableme');
            this.checkBoxArr.splice(this.checkBoxArr.indexOf(str),1);
            this.disableFlg = true;
        }
    }
    //To Disable if all are selected
    var checkBox = document.getElementsByClassName("chkbox");
    var disChkBox = document.getElementsByClassName("disableme");
    if(checkBox.length == disChkBox.length)
    {
        this.allSelected = true;
    }
    //Find the cobject-id of those that are disabled
    this.disabledBox = document.getElementsByClassName("disableme");
    for(var i=0;i<this.disabledBox.length;i++)
    {
        var id = this.disabledBox[i].id;
        var newid = id.replace('c','s');
        this.disabledChk.push(newid);
        this.changeTrigger ++;
    }

 }

 songConsolidate(songDb:any,i)
 {

    this.songName = this.songDb[i].cFormat.title;
    this.songvHtml = this.songDb[i].misCe.nativeElement.innerHTML;
    this.songDefHtml = this.songDb[i].acidjsxchordDb; 
    this.songdHtml = this.songDb[i].ngFdiv.nativeElement.innerHTML;
    this.authEmail = this.songDb[i].authEmail;
    const song = new SongBook(this.authEmail,this.songName,this.songvHtml,this.songDefHtml,this.songdHtml);
    this.songSer.saveSong(song).subscribe(
        response => 
        {
            this.songSerRes = response;
        }); 
 }

  //Choosing Text Area option
  setOp1Flg()
  {
      this.op1Flg = true;
      this.opFlg = true;
  }

  //Choosing Text File option
  setOp2Flg()
  {
      this.op2Flg = true;
      this.opFlg = true;
  }

  //Choosing Zip option
  setOp3Flg()
  {
      this.op3Flg = true;
      this.opFlg = true;
  }

  openFile(event) 
  {
    console.log('Inside file Event');
    let input = event.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
        this.textFile = reader.result;
    };
    // reader.readAsText(input,'ascii');
    reader.readAsText(input);
  }

  //Handling zip files
  handleZip(event)
  {
      console.log('Inside HandleZip');
       var listOfPromises;
       var zipFileToLoad = event.target.files[0];
       var fileMain = new JSZip();
       this.result = fileMain.loadAsync(zipFileToLoad).then(function (zip)
      {
        var entries = Object.keys(zip.files).map(function (name) 
        {
            return zip.files[name];
        });
        var listOfPromises = entries.map(function(entry) 
        {
                return entry.async("string").then(function (fileData) 
                {
                    return fileData;
                });
        });
       var promiseOfList = Promise.all(listOfPromises);
       //return promiseOfList;
       return promiseOfList.then(function(list)
       {
           var result = list;
           return result;
       })
      });

    this.result.then((list) => {
          this.op2Arr = list;
      })
   
  }

  buttonMessage(obj)
  {
        console.log('message from formatop');
        this.cusForm = obj;
        this.changeTrigger ++ ;   
  }

  songDisable(obj)
  {
      console.log('Song ID saved from song component:',obj);
      var newid = obj.replace('s','c');
      var chbox = document.getElementById(newid);
      this.renderer2.setProperty(chbox,'checked',false);
      this.renderer2.setProperty(chbox,'disabled',true);
      this.renderer2.removeClass(chbox,'enabled');
      this.renderer2.addClass(chbox,'disableme');
  }

   public ngAfterViewInit(): void
   {
        this.components.changes.subscribe((comps: QueryList <SongComponent>) =>
        {
            this.Song = comps.first;
            this.SongArr = comps.toArray();
            if(this.SongArr)
            {
                this.listFlg = true;
                this.cdr.detectChanges();
            }
        });
    }

    varInc()
    {   
        this.aiCounter++;
        return this.aiCounter;
    }


    ngOnInit() 
    {

    }

    ngOnChanges(changes:SimpleChanges)
    {
    console.log('Component Array of Songlist:',this.components.toArray());
    }

    onAnchorClick (e) 
    {
        this.route.fragment.subscribe ( f => {
        const element = document.querySelector ("#" + f)
        if ( element ) element.scrollIntoView ( true )
        }); 
    }
  
    clrConvert()
    {
        if(this.auth.authenticated())
        {
            this.bClicked = false;
            this.op1Flg = false;
            this.op2Flg = false;
            this.op3Flg = false;
            this.opFlg = false;
            this.testArr = [];
            this.input = "";
            this.router.navigate(['/convert']);
        }
        else
        {
            this.bClicked = false;
            location.reload();
        }

    }

    handleClick()
    {
      var element = <HTMLInputElement> document.getElementById("myCheck");
      var isChecked = element.checked;
      console.log('element.checked:',element.checked);
      if(isChecked)
      {
          this.showImgs = true;
      }
      else
      {
          this.showImgs = false;
      }
    }

   formatClick()
  {
      var element = <HTMLInputElement> document.getElementById("formatOps");
      var isChecked = element.checked;
      if(isChecked)
      {
          this.showFmts = true;
      }
      else
      {
          this.showFmts = false;
      }
  }

  hoverClick()
  {
      var element = <HTMLInputElement> document.getElementById("hoverOver");
      var isChecked = element.checked;
      if(isChecked)
      {
          this.hoverImgs = true;
      }
      else
      {
          this.hoverImgs = false;
      }

  }

  convert()
  {

        this.bClicked = true;
        if(this.op1Flg)
        {
            //Splits all the input text and stores each line in a separate array
            this.testArr = this.input.split('{ns}'||'{new_song}');
        }
        else if(this.op2Flg)
        {
            //Splits all the input text and stores each line in a separate array
            this.testArr = this.textFile.split('{ns}'||'{new_song}');
        }
        else if(this.op3Flg)
        {
            console.log('Zip option');
            //Checks if the file has more than one song in it
            for( var i = 0; i< this.op2Arr.length ;i++)
            {
                var regex = /{ns}||{new_song}/gi;
                //Checks if the first file has more songs in it
                if(this.op2Arr[i].search(regex) == -1 )
                {
                    this.testArr.push(this.op2Arr[i]);
                }
                else
                //If it has many other ns or new_song in it
                {
                    console.log('Contains other songs in the file');
                    this.sampArr = this.op2Arr[i].split('{ns}'||'{new_song}');
                    for(var j = 0 ; j<this.sampArr.length ; j++)
                    {
                        this.testArr.push(this.sampArr[j]);
                    }
                }
            }
        }
        else
        {
            console.log('Check Input from Text Area:',this.input);
            //Splits all the input text and stores each line in a separate array
            this.testArr = this.input.split('{ns}'||'{new_song}');
        }
  }

}//end of component class


