import { Component, OnInit, Input , ViewChild, ElementRef, ViewChildren,OnChanges,ChangeDetectionStrategy,SimpleChanges,Output, EventEmitter } from '@angular/core';
import { ChordPro } from '../chordformat';
import { ChordPos } from '../chordDefine';
import { DomSanitizer} from '@angular/platform-browser';
import { CustomFormat } from '../customformat';
import { ViewEncapsulation,Renderer2 } from '@angular/core';
import { AuthService } from '../auth.service';
import { SongService } from '../song.service';
import { SongBook } from '../songSave';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongComponent implements OnInit,OnChanges {

//   static songCounter = 0;
  @Input('song') songArr: any;
  @Input() index: any;
  @Input() imgFlg: Boolean;
  @Input() changeTrigger:any;
  @Input() cusForm:any;
  @Input() allSelected:Boolean;
  @Input() disabledChk:any;
  @Input('bgVerse')bgVerse: any;
  @Output() 
  saveEvent = new EventEmitter();
  @ViewChild('songContainer') songContainer:ElementRef;
  @ViewChild('chordDig') chordDig:ElementRef;
  @ViewChild('misCe') misCe: ElementRef;
  @ViewChild('containerDiv') containerDiv: ElementRef;
  @ViewChild('ngFdiv') ngFdiv: ElementRef;
  @ViewChild('checkID') checkID: ElementRef;
  inpArr = [];
  chArr=[];
  digArr=[];
  chordArr=[];
  masArr = [];
  samArr = [];
  bClicked:Boolean = false;
  cFormat: ChordPro = {};
  dFormat: ChordPos = {};
  check1;
  // cFormat: ChordPro[] = [{}];
  count:number = 0;
  choFlg:Boolean = false; //0
  verFlg:Boolean = false; //1
  tabFlg:Boolean = false; //2
  mDirFlg:Boolean = false;
  fDirFlg:Boolean = false;
  aRlg:Boolean = false;
  hrefFlg:Boolean = false;
  //For Environment Classes
  divc;
  divv;
  pt;
  mdiv;
  divpt;
  //Output strings to be buffered on the array
  verse;
  oupStr:any;
  counter:number = 1;
  //Text Formatting Directives
  textfont = `<div>`;
  textsize = `<div>`;
  textcolour = `<div>`;
  tFont;
  tSize;
  tColour;
  //Chord Formatting Directives
  chordfont = `<span>`;
  chordsize = `<span>`;
  chordcolour = `<span class="colorc">`;
  // divCfont;
  // divCsize;
  // divCcolor;
  cFlg:Boolean = false;
  //Tab Formatting Directives
  tabfont = `<span>`;
  tabsize = `<span>`;
  tabcolour = `<span>`;
  tFlg:Boolean = false;
  check:Boolean = false;
  //Chord Diagram elements
  acidjsxchord;
  acidjsxstring1;acidjsxstring2;acidjsxstring3;acidjsxstring4;acidjsxstring5;acidjsxstring6;
  li1;li2;li3;li4;
  ol;
  dkFret2;dkFret3;
  dKarr =[];  
  dkFlg1:Boolean = false;
  dkFlg2:Boolean = false;
  finFlg:Boolean = false;
  state;
  showImgs:Boolean = false;
  insImgStr;
  //Song Service Essentials
  authEmail:String;
  songName:String;
  songvHtml:String;
  songdHtml:String;
  songSerRes;
  songSaveFlg:Boolean = false;
  ngdivtags;
  acidjsxchordDb;
 
  constructor(private route: ActivatedRoute,private elementRef: ElementRef,private renderer2 : Renderer2, private sanitizer: DomSanitizer,private songSer:SongService,private auth: AuthService,private router: Router) 
  {
      if(auth.authenticated())
      {
        this.authEmail = auth.userProfile.email;
        console.log('Authemail:',this.authEmail);
      }
  }


    anchorClick ( ) 
    {
        this.route.fragment.subscribe ( f => {
        const element = document.querySelector ( "#" + f )
        if ( element ) element.scrollIntoView ( true )
        });

    }

  saveToSongBk()
  {
    console.log('Save To Song Book');
    var inde = this.index+1;
    console.log('Index inside save to songbook:',inde);
    var titleP = document.getElementById('titleid'+inde);
    console.log('titleid:',titleP);
    this.songName = titleP.innerHTML;
    this.songvHtml = this.misCe.nativeElement.innerHTML;
    console.log('Before bypassing security:',this.acidjsxchordDb);
    this.songdHtml = this.ngFdiv.nativeElement.innerHTML;
    const song = new SongBook(this.authEmail,this.songName,this.songvHtml,this.acidjsxchordDb,this.songdHtml);
    this.songSaveFlg = true;
    this.songSer.saveSong(song).subscribe(
        response => 
        {
         this.songSerRes = response;
         this.router.navigate(['/convert']);
        }); 
    console.log('Parent ID to be emitted:',this.checkID.nativeElement.parentElement.id);
    this.saveEvent.emit(this.checkID.nativeElement.parentElement.id);
   }

 ngOnChanges(changes:SimpleChanges) {
      console.log('changed things:',changes);
      if(this.cusForm)
      {
        this.custFormat();
      } 
      if(this.disabledChk)
      {
          var songDiv = this.checkID.nativeElement.parentElement.id;
          console.log('songDiv:',songDiv);
          if(this.disabledChk.indexOf(songDiv) > -1)
          {
              console.log('If the song component id is present disabledchk');
              this.songSaveFlg = true;
          }
      }
  }
  

  //Perform Conversion on Init
  ngOnInit() 
  {
    console.log("INDEX:",this.index);
    this.bClicked = true;
    this.inpArr = this.songArr.split('\n');
    console.log('Breaking the song into several lines and storing them in inpArr:',this.inpArr);
    for( var i=0; i< this.inpArr.length; i++)
    {
    //Comment # Check
    console.log('Content of input array:',this.inpArr[i]);
    //IF1
    if(/^\s*?\#/.test(this.inpArr[i]))
    {
        console.log("inside comment check");
        this.inpArr[i] = this.inpArr[i].slice(1);
        this.cFormat[this.count] = {comment: this.inpArr[i]};
        // this.cFormat.comment = this.inpArr[i];
    }//end of IF1
    //Meta Directive,Formatting Directive and Environment Directive Check - IF2
    else if(/^\s*?\{/.test(this.inpArr[i]))
    {
        console.log('Inside else for directive check');
        //Formatting Dir Check for Chorus and Image - IF6
        if(/^\s*?\{\s*?([a-z]*|[A-Z]*)\s*?\}/.test(this.inpArr[i]))
        {
            console.log('Checking for formatting dir chorus/new_song');
            var result = /^\s*?\{\s*?(([a-z]*|[A-Z]*)|(new_song|ns))\s*?\}/ig.exec(this.inpArr[i]);
            console.log('Formatting dir:',result);
            switch(result[1])
            {
            case 'chorus':
                this.fDirFlg = true;
                var line = "<p class=\"chorus_bg\">Chorus</p>"
                var div = this.renderer2.createElement('div');
                this.renderer2.setProperty(div,'innerHTML',line);
                //this.renderer2.appendChild(this.outputTest.nativeElement,div);
                this.renderer2.appendChild(this.misCe.nativeElement,div);
                console.log('div:',div);
                break;
            case 'textfont': this.textfont = ""; break;
            case 'textsize': this.textsize = "";break;
            case 'textcolour': this.textcolour = "";break;
            case 'tabfont' : this.tabfont = "";break;
            case 'tabsize' : this.tabsize = "";break;
            case 'tabcolour': this.tabcolour = "";break;
            case 'chordfont': this.chordfont = "";break;
            case 'chordcolour': this.chordcolour = "";break;
            case 'chordsize': this.chordsize ="";break;
            }        
        }//IF6
        //Meta Directive Check, (AND FORMATTING DIRECTIVES (except chorus and image)) -IF3 
        if(/^\s*?\{\s*?([a-z]*|[A-Z]*)\s*?\:/.test(this.inpArr[i]))
        {
        console.log('Inside meta/format directive check');
        var result = /^\s*?\{\s*?([a-z]*|[A-Z]*)\s*?\:/ig.exec(this.inpArr[i])
        console.log('Result:',result[1]);
        //Call Meta Directive Check / Formatting Check Function  
        this.metaForCheck(result[1],i);
        }//IF3
        //Environment Directive Check - IF4
        else if(/^\s*?\{\s*?((?:(so[a-z]|eo[a-z]))|(?:(start|end))\s*?\_\s*?(?:of)\s*?\_\s*?([a-z]*))\s*?\}/.test(this.inpArr[i]))
        {
        console.log('Inside environment directive check');
        var result = /^\s*?\{\s*?((?:(so[a-z]|eo[a-z]))|(?:(start|end))\s*?\_\s*?(?:of)\s*?\_\s*?([a-z]*))\s*?\}/ig.exec(this.inpArr[i]);
        console.log('check new result:',result);
        result[1] = result[1].replace(/\s/g,''); //removing whitespaces
        console.log('Result:',result[1]);
        //Call Environment Directive Check Function
        this.envCheck(result[1]);
        console.log('Choflg:',this.choFlg);
        }//IF4
    }//IF2
    //Guitar Tab Instructions
    else if(this.tabFlg && /^\s*?(e|B|G|D|A|E)\|/.test(this.inpArr[i]))
    {
        console.log('Guitar Tab line:',this.inpArr[i]);
        this.verse = this.tabfont+this.tabcolour+this.tabsize+this.inpArr[i]+`<br/></span></span></span>`;
        var span = this.renderer2.createElement('span');
        this.renderer2.setProperty(span,'innerHTML',this.verse);
        this.renderer2.appendChild(this.pt,span);
        console.log('Tab span:',span);
        console.log('Tab p:',this.pt);
        console.log('Tab div:',this.divpt);
    }
    //Chord and Note Check - IF5
    else
    {
        console.log('Inside chord and note check');
        // var loopRes = this.inpArr[i].match(/\[([A-Z]|[A-Z][0-9])\]([a-zA-Z]*[,|.]?)/g);
        // console.log('LoopResult:',loopRes);
        console.log('Input String:',this.inpArr[i]);
        //Store chords in an array
        var re1 = /\[/g;
        var re2 = /\]/g;
        // if(/\[([A-Z]|[A-Z][0-9])\]/g.test(this.inpArr[i]))
        //Storing chords in the master array
        //Getting the index of the [ bracket
        var obr = "[";
        var index = this.inpArr[i].indexOf(obr);
        var indexObr = [];
        while (index >= 0) {
            indexObr.push(index);
            index = this.inpArr[i].indexOf(obr, index + 1);
        }
        //Getting the index of the ] bracket
        var cbr = "]";
        var index = this.inpArr[i].indexOf(cbr);
        var indexCbr = [];
        while (index >= 0) {
            indexCbr.push(index);
            index = this.inpArr[i].indexOf(cbr, index + 1);
        }
        if(indexObr.length == indexCbr.length)
        {
            console.log('LENGTH SAME weee');
            for( var m=0;m<indexObr.length;m++)
            {
                var subStr = this.inpArr[i].substring(indexObr[m]+1,indexCbr[m]);
                console.log('Extracted chord:',subStr);
                this.chordArr.push(subStr);
            }
            console.log('finalMast:',this.chordArr);
            this.storeMasChord(this.chordArr);
        }
        //Consecutive chord characters with spaces in between
        if(/(\]\s*?\[)/g.test(this.inpArr[i]))
        {
            console.log('Valar Dohaeris');
            // var testArr = this.inpArr[i].match(/(\]([a-z]|[A-Z]|.|\,|\-)\[)/g);
            var testArr = this.inpArr[i].match(/(\]\s*?\[)/g);
            console.log('matching strings:',testArr);
            //var obracket = /\[/g;
            var cbracket = /\]/g;
            var ntestArr = [];
            for(var j=0;j<testArr.length;j++)
            {    
                var buf = testArr[j];
                buf = buf.replace(cbracket,"]<span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>.</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span>");
                ntestArr.push(buf);
            }
            console.log('Pushed content inside ntestArr:',ntestArr);
            for( var k=0;k<testArr.length;k++)
            {
                console.log('testArr[k]:',testArr[k]);
                console.log('ntestArr[k]:',ntestArr[k]);
                this.inpArr[i] = this.inpArr[i].replace(testArr[k],ntestArr[k]);
            }
            console.log('STRING CHECK outside for loop:',this.inpArr[i]);
        }
        //Spacing for repetitive chord characters
        if(/(\]\s*?([a-z]|[A-Z]|.|\,|\-)\s*?\[)/.test(this.inpArr[i]))
        {
            console.log('Valar Morghulis');
            // var testArr = this.inpArr[i].match(/(\]([a-z]|[A-Z]|.|\,|\-)\[)/g);
            var testArr = this.inpArr[i].match(/(\]\s*?([a-z]|[A-Z]|.|\,|\-)\s*?\[)/g);
            console.log('matching strings:',testArr);
            var obracket = /\[/g;
            var cbracket = /\]/g;
            var ntestArr = [];
            for(var j=0;j<testArr.length;j++)
            {    
                var buf = testArr[j];
                // buf = buf.replace(obracket,"          <span>&nbsp;</span>[");
                // buf = buf.replace(cbracket,"]          <span>&nbsp;</span>");
                buf = buf.replace(obracket,"<span>&nbsp;</span><span>&nbsp;</span>[");
                buf = buf.replace(cbracket,"]<span>&nbsp;</span><span>&nbsp;</span>");
                ntestArr.push(buf);
            }
            console.log('Pushed content inside ntestArr:',ntestArr);
            for( var k=0;k<testArr.length;k++)
            {
                console.log('testArr[k]:',testArr[k]);
                console.log('ntestArr[k]:',ntestArr[k]);
                this.inpArr[i] = this.inpArr[i].replace(testArr[k],ntestArr[k]);
            }
            console.log('STRING CHECK outside for loop:',this.inpArr[i]);
        }
        this.inpArr[i] = this.inpArr[i].replace(re1,"<span id=\"chordid\" class=\"chord\">"+this.chordfont+this.chordsize+this.chordcolour);
        this.inpArr[i] = this.inpArr[i].replace(re2,"</span></span></span></span>");
        //this.inpArr[i] = this.inpArr[i].trim();
        console.log('After replacing [] String:',this.inpArr[i]);
        if(this.inpArr[i] !== "")
        {
        //this.verse = `<p class=\"verse\">`+this.inpArr[i]+`</p>`;
        this.verse = `<div class=\"masTxt\">`+this.textfont+this.textcolour+this.textsize+`<p class=\"verse\">`+this.inpArr[i]+`</p></div></div></div></div>`;
        console.log('Innerhtml look:',this.verse);  

            if(this.choFlg)
            {
                console.log('chorus flag set');
                var div1 = this.renderer2.createElement('div');
                this.renderer2.setProperty(div1,'innerHTML',this.verse);
                this.renderer2.appendChild(this.divc,div1);

                console.log('DivC:',this.divc);
            }
            if(this.verFlg)
            {
                console.log('verse flag set');
                var div2 = this.renderer2.createElement('div');
                this.renderer2.setProperty(div2,'innerHTML',this.verse);
                this.renderer2.appendChild(this.divv,div2);
                console.log('Divv:',this.divv);
            }
            else if((!this.choFlg) && (!this.verFlg))
            {
                this.mdiv = this.renderer2.createElement('div');
                this.renderer2.setProperty(this.mdiv,'innerHTML',this.verse);
                this.renderer2.appendChild(this.misCe.nativeElement,this.mdiv);
                console.log('why div:',this.mdiv);
            }
        }
        else //when line breaks are present
        {
        var brk = this.renderer2.createElement('br');
        console.log('line break',brk);
        this.renderer2.appendChild(this.misCe.nativeElement,brk);
        }
    }//end of IF5 
    console.log('Misce:',this.misCe.nativeElement);
    console.log('MasARR weeeeeeeeeeeee:',this.masArr);
    console.log('CHECK1 weeeeeeeeeeeee:',this.check1);
    this.check1 = this.masArr;
    // console.log('outputtest:',this.outputTest.nativeElement);
    } //end of for loop
    console.log('Loop end');
  }//ngInit closure

  //function definitions
  storeMasChord(chordArr)
  {
    console.log('storeMasChord weeeeeeeee');
    for( var i = 0 ;i<chordArr.length;i++)
    {
        console.log('ADVAY chordArr:',chordArr[i]);
        this.masArr.push(chordArr[i]);
        console.log('inside storemaschord:',this.masArr);
    }
    //Removing duplicates from the Array
    this.masArr = this.masArr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
    })
    console.log('inside storemaschord after duplicate removal:',this.masArr);
  }
  metaForCheck(mdir:String,i)
  { 
      var directive = mdir.toLowerCase();
      switch(directive)
         {
          case 'define':
              var chStr = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              chStr = chStr.trim();
              console.log('After trim:',chStr);
              chStr = chStr.replace(/  +/g, ' ');
              console.log('After removing double whitespaces');
              this.chArr = chStr.split(' ');
              console.log('Define split into arrays:',this.chArr);
              this.createChordDiagram(this.chArr);
              break;
          case 'title':
          case 't':
              this.cFormat.title = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              var inde = this.index + 1;
              this.renderer2.setProperty(p,'id','titleid'+inde);
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.title);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'subtitle':
          case 'st':
              this.cFormat.subtitle = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.subtitle);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'artist':
              this.cFormat.artist = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.artist);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'composer':
              this.cFormat.composer = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.composer);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'lyricist':
              this.cFormat.lyricist = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.lyricist);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'copyright':
              this.cFormat.copyright = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.copyright);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'album':
              this.cFormat.album = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.album);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'year':
              this.cFormat.year = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.year);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'key':
              this.cFormat.key = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.key);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'time':
              this.cFormat.time = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.time);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'tempo':
              this.cFormat.tempo = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.tempo);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'duration':
              this.cFormat.duration = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.duration);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'capo':
              this.cFormat.capo = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.capo);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.mDirFlg = true;
              break;
          case 'comment':
          case 'c':
              this.cFormat.cmnt = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.cmnt);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.fDirFlg = true;
              break;
          case 'comment_italic':
          case 'ci':
              this.cFormat.cmnt_it = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.cmnt_it);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.fDirFlg = true;
              break;
          case 'comment_box':
          case 'cb':
              this.cFormat.cmnt_box = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'centercls');
              this.renderer2.setProperty(p,'innerHTML',this.cFormat.cmnt_box);
              var div = this.renderer2.createElement('div');
              this.renderer2.appendChild(div,p);
              this.renderer2.appendChild(this.misCe.nativeElement,div);
              console.log('div:',div);
              this.fDirFlg = true;
              break;
          case 'textfont':
              this.tFont = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.textfont = `<div style=\"font-family:`+this.tFont+`;\">`;
              console.log('textfont:',this.textfont);
              break;
          case 'textsize':
              this.tSize = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              console.log('textsize in %:',this.tSize+'%');
              console.log('textsize in px:',this.tSize+'px');
              if(/^\s*?([0-9]*)\%/.test(this.tSize))
              {
                  this.tSize = this.tSize.replace("%",'');
                  this.tSize = this.tSize+'%';
                  this.textsize = `<div style=\"font-size:`+this.tSize+`;\">`;
                  break;
              }
              else
              {
                  this.tSize = this.tSize+'px';
                  this.textsize = `<div style=\"font-size:`+this.tSize+`;\">`;
                  break;
              }
          case 'textcolour':
              this.tColour = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              console.log('textcolour:',this.tColour);
              this.textcolour = `<div style=\"color:`+this.tColour+`;\">`;
              break;
          case 'chordfont':
              this.chordfont = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.cFlg = true;
              this.chordfont = `<span style=\"font-family:`+this.chordfont+`;\">`;
              console.log('chordfont:',this.chordfont);
              break;
          case 'chordsize':
              this.chordsize = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.cFlg = true;
              console.log('chordsize:',this.chordsize);
              if(/^\s*?([0-9]*)\%/.test(this.chordsize))
              {
                  this.chordsize = this.chordsize.replace("%",'');
                  this.chordsize = `<span style=\"font-size:`+this.chordsize+`;display:block;\">`;
                  break;
              }
              else
              {
                  this.chordsize = this.chordsize.concat('px');
                  this.chordsize = `<span style=\"font-size:`+this.chordsize+`;display:block;\">`;
                  console.log('chordsize:',this.chordsize);
                  break;
              }
          case 'chordcolour':
              this.chordcolour = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.cFlg = true;
              console.log('chordcolour:',this.chordcolour);
              this.chordcolour = `<span class=\"colorc\" style=\"color:`+this.chordcolour+`;display:block;\">`;
              break;
          case 'tabfont':
              this.tabfont = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.tFlg = true;
              this.tabfont = `<span style=\"font-family:`+this.tabfont+`;\">`;
              console.log('tabfont:',this.tabfont);
              break;
          case 'tabsize':
              this.tabsize = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.tFlg = true;
              console.log('tabsize:',this.tabsize);
              if(/^\s*?([0-9]*)\%/.test(this.tabsize))
              {
                  this.tabsize = this.tabsize.replace("%",'');
                  this.tabsize = `<span style=\"font-size:`+this.tabsize+`;display:block;\">`;
                  break;
              }
              else
              {
                  this.tabsize = this.tabsize.concat('px');
                  this.tabsize = `<span style=\"font-size:`+this.tabsize+`;display:block;\">`;
                  console.log('tabsize:',this.tabsize);
                  break;
              }
          case 'tabcolour':
              this.tabcolour = this.inpArr[i].substring(this.inpArr[i].indexOf(":")+1,this.inpArr[i].lastIndexOf("}"));
              this.tFlg = true;
              console.log('tabcolour:',this.tabcolour);
              this.tabcolour = `<span style=\"color:`+this.tabcolour+`;display:block;\">`;
              break;
         }//end of switch
    }//end of metaCheck Function
    envCheck(eDir:String)
    {
      console.log('Envcheck');
      var directive = eDir.toLowerCase();
      switch(directive)
      {
         case 'start_of_chorus':
         case 'soc':
              this.choFlg = true;
              this.divc = this.renderer2.createElement('div');
              this.renderer2.addClass(this.divc,'chorus');
              this.renderer2.appendChild(this.misCe.nativeElement,this.divc);
              break;
         case 'end_of_chorus':
         case 'eoc':
              this.choFlg = false;
              break;
         case 'start_of_verse':
              this.verFlg = true;
              // this.verStr = "versecls";
              // this.oupArr.push(`<div><p class=\"`+this.verStr+`\"><b><i>`+this.counter+`</i></b></p><br>`);
              this.divv = this.renderer2.createElement('div');
              var p = this.renderer2.createElement('p');
              this.renderer2.addClass(p,'versecls');
              this.renderer2.setProperty(p,'innerHTML',this.counter);
              this.renderer2.appendChild(this.divv,p);
            //   this.renderer2.appendChild(this.outputTest.nativeElement,this.divv);
              this.renderer2.appendChild(this.misCe.nativeElement,this.divv);
              console.log('Counter:',this.counter);
              this.counter++;
              break;
         case 'end_of_verse':
              this.verFlg = false;
              break;
         case 'start_of_tab':
         case 'sot':
              this.tabFlg = true;
              // this.tabStr = "tab";
              // this.oupArr.push(`<p class=\"`+this.tabStr+`\">`);
              this.divpt = this.renderer2.createElement('div');
              this.pt = this.renderer2.createElement('p');
              this.renderer2.addClass(this.pt,'tab');
              this.renderer2.appendChild(this.divpt,this.pt);
             //this.renderer2.appendChild(this.outputTest.nativeElement,this.divpt);
             this.renderer2.appendChild(this.misCe.nativeElement,this.divpt);
              break;
         case 'end_of_tab':
         case 'eot':
              this.tabFlg = false;
              break;
      }//end of Switch
    }//end of envCheck
    createChordDiagram(diArr:any)
    {
        this.digArr = diArr;
        console.log('Array received from function call:',this.digArr);
        this.dFormat.label = this.digArr[0];
        this.dFormat.base_fret = this.digArr[2];
        this.dFormat.frp1 = this.digArr[4];
        this.dFormat.frp2 = this.digArr[5];
        this.dFormat.frp3 = this.digArr[6];
        this.dFormat.frp4 = this.digArr[7];
        this.dFormat.frp5 = this.digArr[8];
        this.dFormat.frp6 = this.digArr[9];
        if(this.digArr[10]==="fingers")
        {
            console.log('fingers set');
            this.dFormat.finp1 = this.digArr[11];
            this.dFormat.finp2 = this.digArr[12];
            this.dFormat.finp3 = this.digArr[13];
            this.dFormat.finp4 = this.digArr[14];
            this.dFormat.finp5 = this.digArr[15];
            this.dFormat.finp6 = this.digArr[16];
            this.finFlg = true;
        }
        var bfnum = +this.dFormat.base_fret;
        var startat = bfnum + 1;
        var sDiv = `<div class=\"center\">`;
        this.acidjsxchord = sDiv+`<acidjs-xchord label=\"`+this.dFormat.label+`\" startat=\"`+startat+`\">`;
        //Sets the key,state,fret and appends the 6 children to the parent acidjsxchord
        this.createXChordString(this.dFormat.frp1,this.dFormat.frp2,this.dFormat.frp3,this.dFormat.frp4,this.dFormat.frp5,this.dFormat.frp6);
        // this.renderer2.setProperty(this.chordDig.nativeElement,'innerHTML',this.acidjsxchord);
    }
    
    createXChordString(frp1:any,frp2:any,frp3:any,frp4:any,frp5:any,frp6:any)
    {  
        console.log('Inside createXChordString');
        console.log('Frets:',this.dFormat.frp1,this.dFormat.frp2,this.dFormat.frp3,this.dFormat.frp4,this.dFormat.frp5,this.dFormat.frp6)
        //acidjsxstring1
        switch(frp1)
        {
            case 'x':
            case 'X':
            case 'n':
            case 'N':
            this.state = "muted";
            break;
            case '0':
            this.state = "empty";
            break;
            case '1':
            case '2':
            case '3':
            case '4':
            this.state = "pressed";
            break;
        }       
        //<acidjs-xchord-string key="e" state="muted" fret="0"></acidjs-xchord-string>
        if((this.state === "muted")||(this.state === "empty")||(!this.finFlg))
        {
            this.acidjsxstring1 = `<acidjs-xchord-string key=\"e\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp1+`\"></acidjs-xchord-string>`;
        }
        else if(this.finFlg)
        {
            this.acidjsxstring1 = `<acidjs-xchord-string key=\"e\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp1+`\" position=\"`+this.dFormat.finp1+`\"></acidjs-xchord-string>`;
        }
        //acidjsxstring2
        switch(frp2)
        {
            case 'x':
            case 'X':
            case 'n':
            case 'N':
            this.state = "muted";
            break;
            case '0':
            this.state = "empty";
            break;
            case '1':
            case '2':
            case '3':
            case '4':
            this.state = "pressed";
            break;
        }        
        if((this.state === "muted")||(this.state === "empty")||(!this.finFlg))
        {
            this.acidjsxstring2 = `<acidjs-xchord-string key=\"a\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp2+`\" position=\"0\"></acidjs-xchord-string>`;
        }
        else if(this.finFlg)
        {
            this.acidjsxstring2 = `<acidjs-xchord-string key=\"a\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp2+`\" position=\"`+this.dFormat.finp2+`\"></acidjs-xchord-string>`;
        }
        //acidjsxstring3
        switch(frp3)
        {
            case 'x':
            case 'X':
            case 'n':
            case 'N':
            this.state = "muted";
            break;
            case '0':
            this.state = "empty";
            break;
            case '1':
            case '2':
            case '3':
            case '4':
            this.state = "pressed";
            break;
        }        
        if((this.state === "muted")||(this.state === "empty")||(!this.finFlg))
        {
            this.acidjsxstring3 = `<acidjs-xchord-string key=\"d\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp3+`\" position=\"0\"></acidjs-xchord-string>`;
        }
        else if(this.finFlg)
        {
            this.acidjsxstring3 = `<acidjs-xchord-string key=\"d\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp3+`\" position=\"`+this.dFormat.finp3+`\"></acidjs-xchord-string>`;
        }
        //acidjsxstring4
        switch(frp4)
        {
            case 'x':
            case 'X':
            case 'n':
            case 'N':
            this.state = "muted";
            break;
            case '0':
            this.state = "empty";
            break;
            case '1':
            case '2':
            case '3':
            case '4':
            this.state = "pressed";
            break;
        }        
        if((this.state === "muted")||(this.state === "empty")||(!this.finFlg))
        {
            this.acidjsxstring4 = `<acidjs-xchord-string key=\"g\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp4+`\" position=\"0\"></acidjs-xchord-string>`;
        }
        else if(this.finFlg)
        {
            this.acidjsxstring4 = `<acidjs-xchord-string key=\"g\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp4+`\" position=\"`+this.dFormat.finp4+`\"></acidjs-xchord-string>`;
        }
        //acidjsxstring5
        switch(frp5)
        {
            case 'x':
            case 'X':
            case 'n':
            case 'N':
            this.state = "muted";
            break;
            case '0':
            this.state = "empty";
            break;
            case '1':
            case '2':
            case '3':
            case '4':
            this.state = "pressed";
            break;
        }        
        if((this.state === "muted")||(this.state === "empty")||(!this.finFlg))
        {
            this.acidjsxstring5 = `<acidjs-xchord-string key=\"b\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp5+`\" position=\"0\"></acidjs-xchord-string>`;
        }
        else if(this.finFlg)
        {
            this.acidjsxstring5 = `<acidjs-xchord-string key=\"b\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp5+`\" position=\"`+this.dFormat.finp5+`\"></acidjs-xchord-string>`;
        }
        //acidjsxstring6
        switch(frp6)
        {
            case 'x':
            case 'X':
            case 'n':
            case 'N':
            this.state = "muted";
            break;
            case '0':
            this.state = "empty";
            break;
            case '1':
            case '2':
            case '3':
            case '4':
            this.state = "pressed";
            break;
        }        
        if((this.state === "muted")||(this.state === "empty")||(!this.finFlg))
        {
            this.acidjsxstring6 = `<acidjs-xchord-string key=\"e\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp6+`\" position=\"0\"></acidjs-xchord-string>`;
        }
        else if(this.finFlg)
        {
            this.acidjsxstring6 = `<acidjs-xchord-string key=\"e\" state=\"`+this.state+`\" fret=\"`+this.dFormat.frp6+`\" position=\"`+this.dFormat.finp6+`\"></acidjs-xchord-string>`;
        }
        // var divngIf = `<div id="check" *ngIf=\"bClicked && showImgs\">`
        var acidjsxstring = this.acidjsxstring1+this.acidjsxstring2+this.acidjsxstring3+this.acidjsxstring4+this.acidjsxstring5+this.acidjsxstring6;
        // this.acidjsxchord = divngIf+this.acidjsxchord+acidjsxstring+`</div>`;
        this.acidjsxchord = this.acidjsxchord+acidjsxstring+`</div>`;
        this.acidjsxchordDb = this.acidjsxchord;
        this.acidjsxchord = this.sanitizer.bypassSecurityTrustHtml(this.acidjsxchord);
        console.log('HTML:',this.acidjsxchord);
    }

    putHref()
    {
      if(!this.hrefFlg)
      {
        console.log('SC I am in here 2 puthref');
        var chordtags = document.getElementsByClassName("colorc");
        console.log('chord:',chordtags);
        for(var i=0;i<chordtags.length;i++)
        {
         //this.renderer2.setStyle(chordtags[i],'color',this.cusForm.tabColor);
          var chord = chordtags[i].innerHTML;
          var newSpan = this.renderer2.createElement('span');
          this.renderer2.setProperty(newSpan,'id','chover');
          this.renderer2.addClass(newSpan,'hoverc');
          this.renderer2.appendChild(chordtags[i],newSpan);
          console.log('The chord from innerhtml of chord class:',chord);
          var insStr = `<ins class=\"scales_chords_api\" chord=\"`+chord+`\"></ins>`;
          console.log('Innerhtml for ins:',insStr);
          this.renderer2.setProperty(newSpan,'innerHTML',insStr);
          console.log('New Span:',newSpan);
        }
        console.log('Final Misce:',this.misCe.nativeElement);
        this.hrefFlg = true;
        console.log('Hrefflg:',this.hrefFlg);
      }
    }

    removeHref()
    {
        console.log('Inside removehref');
        var remSpan = document.getElementsByClassName("hoverc");
        var remColorc = document.getElementsByClassName("colorc");
        for(var i=0;i<remColorc.length;i++)
        {
            console.log('Loop counter:',i);
            this.renderer2.removeChild(remColorc[i],remSpan[0]);
            console.log('remColorc:',remColorc);
            console.log('remSpan:',remSpan);
        }

    } 
    custFormat()
    {
        if(this.cusForm.bgVerse)
        {
            this.renderer2.setStyle(this.misCe.nativeElement,'background-color',this.cusForm.bgVerse);
        }
        if(this.cusForm.bgDia)
        {
            this.renderer2.setStyle(this.chordDig.nativeElement,'background-color',this.cusForm.bgDia);
        }
        if(this.cusForm.tabColor)
        {  
            var tabtags = document.getElementsByClassName("tab");
            console.log('tabtags:',tabtags);
            for(var i=0;i<tabtags.length;i++)
            {
               this.renderer2.setStyle(tabtags[i],'color',this.cusForm.tabColor);
            }
        }
        if(this.cusForm.tabFont)
        {
            var tabtags = document.getElementsByClassName("tab");
            console.log('tabtags:',tabtags);
            for(var i=0;i<tabtags.length;i++)
            {
               this.renderer2.setStyle(tabtags[i],'font-family',this.cusForm.tabFont);
            }
        }
        if(this.cusForm.tabSize)
        {
            var tabtags = document.getElementsByClassName("tab");
            console.log('tabtags:',tabtags);
            for(var i=0;i<tabtags.length;i++)
            {
               this.renderer2.setStyle(tabtags[i],'font-size',this.cusForm.tabSize+`px`);
            }
        }
        if(this.cusForm.textFont)
        {
            var versetags = document.getElementsByClassName("masTxt");
            console.log('Verse:',versetags);
            for(var i=0;i<versetags.length;i++)
            {
               this.renderer2.setStyle(versetags[i],'font-family',this.cusForm.textFont);
            }
        }
       if(this.cusForm.textColor)
        {
            var versetags = document.getElementsByClassName("masTxt")
            console.log('Verse:',versetags);
            for(var i=0;i<versetags.length;i++)
            {
               this.renderer2.setStyle(versetags[i],'color',this.cusForm.textColor);
            }
        }
       if(this.cusForm.textSize)
        {
            var versetags = document.getElementsByClassName("masTxt")
            console.log('Verse:',versetags);
            for(var i=0;i<versetags.length;i++)
            {
               this.renderer2.setStyle(versetags[i],'font-size',this.cusForm.textSize+`px`);
            }
        }
        if(this.cusForm.chordColor)
        {
            var spantags = document.getElementsByClassName("chord")
            console.log('Chord ID:',spantags);
            for(var i=0;i<spantags.length;i++)
            {
               this.renderer2.setStyle(spantags[i],'color',this.cusForm.chordColor);
            }
            
        }
        if(this.cusForm.chordFont)
        {
            var spantags = document.getElementsByClassName("chord")
            console.log('Chord ID:',spantags);
            for(var i=0;i<spantags.length;i++)
            {
               this.renderer2.setStyle(spantags[i],'font-family',this.cusForm.chordFont);
            }
        }
        if(this.cusForm.chordSize)
        {
            var spantags = document.getElementsByClassName("chord")
            console.log('Chord ID:',spantags);
            for(var i=0;i<spantags.length;i++)
            {
               this.renderer2.setStyle(spantags[i],'font-size',this.cusForm.chordSize+`px`);
            }
        }
        if(this.cusForm.metaColor)
        {
            var ptags = document.getElementsByClassName("centercls")
            console.log('Div:',ptags);
            for(var i=0;i<ptags.length;i++)
            {
               this.renderer2.setStyle(ptags[i],'color',this.cusForm.metaColor);
            }
            
        }
        if(this.cusForm.metaFont)
        {
            var ptags = document.getElementsByClassName("centercls")
            console.log('Div:',ptags);
            for(var i=0;i<ptags.length;i++)
            {
               this.renderer2.setStyle(ptags[i],'font-family',this.cusForm.metaFont);
            }
        }
        if(this.cusForm.metaSize)
        {
            var ptags = document.getElementsByClassName("centercls")
            console.log('Div:',ptags);
            for(var i=0;i<ptags.length;i++)
            {
               this.renderer2.setStyle(ptags[i],'font-size',this.cusForm.metaSize+`px`);
            }
        }
    }

}//component end
