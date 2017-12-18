import { Component, OnInit,ViewChild, ElementRef,ViewEncapsulation,HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SongService } from '../song.service';
import { SongBook } from '../songSave';
import { DomSanitizer} from '@angular/platform-browser';
import { Renderer2 } from '@angular/core';
import { CustomFormat } from '../customformat';
import {MatExpansionModule} from '@angular/material/expansion';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-songview',
  templateUrl: './songview.component.html',
  styleUrls: ['./songview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SongviewComponent implements OnInit {

  @ViewChild('verseHtml') verseHtml:ElementRef;
  @ViewChild('chordHtml') chordHtml:ElementRef;
  @ViewChild('chordImg') chordImg:ElementRef;
  songId;
  goBackComp;
  songDetail;
  verseHTML;
  chordHTML;
  acidjsHTML;
  cancelFS:Boolean = false;
  showImgs:Boolean = false;
  hoverImgs:Boolean = false;
  susFlg:Boolean = false;
  cusForm:CustomFormat = {};
  tFonts = ["Times New Roman","Georgia","Lucida Sans Unicode"];
  cFonts = ["Times New Roman","Georgia","Lucida Sans Unicode"];
  tabFonts = ["Courier", "Courier New", "Lucida Console", "Monaco", "Consolas", "Inconsolata"];
  sizes = ["12","14","16","18","20","22","24"];
  //Increase pitch
  keyArray = [];
  incrPitchObj = {};
  lookupArr1 = [
                {"A":"A#"},
                {"A#":"B"},
                {"Bb":"B"},
                {"B":"C"},
                {"C":"C#"},
                {"C#":"D"},
                {"Db":"D"},
                {"D":"D#"},
                {"D#":"E"},
                {"Eb":"E"},
                {"E":"F"},
                {"F":"F#"},
                {"F#":"G"},
                {"Gb":"G"},
                {"G":"G#"},
                {"G#":"A"},
                {"Ab":"A"}
            ];
  //Decrease pitch
  lookupArr2 = [
                {"A":"Ab"},
                {"A#":"A"},
                {"Bb":"A"},
                {"B":"Bb"},
                {"C":"B"},
                {"C#":"C"},
                {"Db":"C"},
                {"D":"Db"},
                {"D#":"D"},
                {"Eb":"D"},
                {"E":"Eb"},
                {"F":"E"},
                {"F#":"F"},
                {"Gb":"F"},
                {"G":"Gb"},
                {"G#":"G"},
                {"Ab":"G"}
            ];
  chordsStr = [];
  changedArr = [];
  orgArr = [];
  incrFlag:Boolean = false;
  decrFlag:Boolean = false;
  
  
  constructor(private renderer2:Renderer2,private sanitizer: DomSanitizer,private songSer:SongService,private route: ActivatedRoute, private router: Router,) { }
    
    // //To check for window resize  
    onWindowResize(e) {
        console.log(e);
        const screenHeight = window.screen.height;
        if(!(screenHeight === e.target.innerHeight))
        {
            var fsButton = document.getElementById("vfullscreen");
            this.renderer2.setStyle(fsButton,'display','visible');
            // this.renderer2.removeClass(fsButton,'butClick');
            this.cancelFS = false;
        }
    }

  ngOnInit() 
  {
    this.songId = this.route.snapshot.paramMap.get('id');
    this.goBackComp = this.route.snapshot.paramMap.get('call');
    //Fetching song from DB
    this.songSer.fetchSong(this.songId).subscribe(
      data => {
        this.songDetail = data;
        this.verseHTML = this.songDetail.songvHtml;
        this.chordHTML = this.songDetail.songdHtml;
        if(this.songDetail.songDef)
        {
          this.acidjsHTML = this.sanitizer.bypassSecurityTrustHtml(this.songDetail.songDef);
        }
        this.verseHtml.nativeElement.innerHTML = this.verseHTML;
        this.chordHtml.nativeElement.innerHTML = this.chordHTML;
        //Saving chords in original array
        var remSpan = document.getElementsByClassName("hoverc");
        if(remSpan.length > 0)
        {
            var remColorc = document.getElementsByClassName("colorc");
            for( var i=0;i<remColorc.length;i++)
            {
                var store = remColorc[i].childNodes[0].nodeValue;
                remColorc[i].innerHTML = '';
                remColorc[i].innerHTML = store;
            }
        }
        var tempCheck = document.getElementsByClassName("colorc");
        for( var i = 0 ; i< tempCheck.length ; i++)
        {
          this.orgArr.push(tempCheck[i].innerHTML);
        }
      });
  }
  
  increasePitch()
  {
      console.log('Inside Increase Pitch');
      this.incrFlag = true;
      this.pitchAction();
  }
  //To decrease the pitch
  decreasePitch()
  {
      console.log('Inside Decrease Pitch');
      this.decrFlag = true;
      this.pitchAction();
  }
  //Chord Changes
  pitchAction()
  {
      //If Hover was activated when pitch increase was done
      var parentTags = document.getElementsByClassName("colorc");
      var remHref = document.getElementsByClassName("hoverc");
      if(this.hoverImgs)
      {
          for( var j = 0 ; j < remHref.length ; j++)
          {
            remHref[j].remove();
          }
          this.hoverImgs = false;
          var hsCheck = document.getElementById("hsCheck");
          this.renderer2.setProperty(hsCheck,'checked',false);
      }
      for( var i = 0 ; i< parentTags.length ; i++)
      {
          this.chordsStr.push(parentTags[i].childNodes[0].nodeValue);
      }
      //Convert lookuparr to json object
      var obj = {};
      if(this.incrFlag)
      {
        console.log('Incr flag set');
        this.lookupArr1.forEach( function(item)
        { 
            var key = Object.keys(item)[0]; 
            obj[ key ] = item [ key ];  
        });
      }
      else if(this.decrFlag)
      {
        console.log('decr flag set');
        this.lookupArr2.forEach( function(item)
        { 
            var key = Object.keys(item)[0]; 
            obj[ key ] = item [ key ];  
        });

      }
      let chordMap = new Map(Object.entries(obj)); 
      for( var i = 0; i < this.chordsStr.length ; i++)
      {
          //todoo
          console.log('MAIN CHORDSTR LOOP');
          var tempvar = chordMap.get(this.chordsStr[i]);
          if((tempvar == undefined) || (tempvar == "undefined"))
          {
              this.keyArray = Object.keys(obj);
              var iofm = this.chordsStr[i].charAt(1);
              //Character at 2nd position is b or #
              if((iofm == 'b')||(iofm == '#'))
              {
                  console.log('Second char is b or #')
                  var baseValue = this.chordsStr[i].slice(0,2);
                  for(var j=0;j<this.keyArray.length;j++)
                  {
                      if(baseValue == this.keyArray[j])
                      {
                          console.log('Base Value and key value is same');
                          var re1 = new RegExp(baseValue,"g");
                          var temp = chordMap.get(baseValue);
                          var changeArrVal = this.chordsStr[i].replace(re1,temp);
                          this.changedArr.push(changeArrVal);
                          break;
                      }
                  }
              }
              //When 2nd char is m|s|a|...
              else if(! ( (iofm == 'b')||(iofm == '#')) )
              {
                console.log('Second char is m or s or some number')
                  var baseValue = this.chordsStr[i].slice(0,1);
                  console.log('BaseValue:',baseValue);
                  for(var j=0;j<this.keyArray.length;j++)
                  {
                      if(baseValue == this.keyArray[j])
                      {
                          console.log('Base Value and key value is same');
                          var re1 = new RegExp(baseValue,"g");
                          var temp = chordMap.get(baseValue);
                          var changeArrVal = this.chordsStr[i].replace(re1,temp);
                          this.changedArr.push(changeArrVal);
                          break;
                      }
                  }   
              }
          }
          else
          {
             this.changedArr.push(tempvar);
          }
      }
      console.log('ChangedArr:',this.changedArr);
      //Replace the Chords in the song verse

      for( var i = 0; i < parentTags.length ; i++)
      {
          this.renderer2.setProperty(parentTags[i],'innerHTML',this.changedArr[i]);
      }
      //Remove duplicates from chorsstr and changedArr for chord diagram display
      this.chordsStr = this.chordsStr.filter(function(elem, index, self)
      {
        return index === self.indexOf(elem);
      });
      this.changedArr = this.changedArr.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })
      var chordDigs;
      this.chordHtml.nativeElement.innerHTML = "";
      for(var i = 0 ; i < this.chordsStr.length ; i++)
      {
          chordDigs = "<div class=\"center\"><ins class=\"scales_chords_api\" chord=\""+this.changedArr[i]+"\"></ins><ins class=\"scales_chords_api\" chord=\""+this.changedArr[i]+"\" output=\"sound\"></ins></div>";
          this.chordHtml.nativeElement.innerHTML += chordDigs;
      }
      //this.chordHtml.nativeElement.innerHTML = chordDigs;
      //console.log('chorddig:',chordDigs); 
      this.chordsStr = [];
      this.changedArr = [];   
      this.incrFlag = false;
      this.decrFlag = false;
  }
  //Reset Pitch to original
  resetPitch()
  {
      console.log('Inside reset pitch');
      //If Hover was activated when pitch increase was done
      var parentTags = document.getElementsByClassName("colorc");
      var remHref = document.getElementsByClassName("hoverc");
      if(this.hoverImgs)
      {
          for( var j = 0 ; j < remHref.length ; j++)
          {
            remHref[j].remove();
          }
          this.hoverImgs = false;
          var hsCheck = document.getElementById("hsCheck");
          this.renderer2.setProperty(hsCheck,'checked',false);
      }
      var tempArray = [];
      var orgArray = [];
      for( var i = 0; i < parentTags.length ; i++)
      {
          tempArray.push(parentTags[i].childNodes[0].nodeValue);
          this.renderer2.setProperty(parentTags[i],'innerHTML',this.orgArr[i]);
      }
      tempArray = tempArray.filter(function(elem, index, self)
      {
        return index === self.indexOf(elem);
      })
      orgArray = this.orgArr.filter(function(elem, index, self)
      {
        return index === self.indexOf(elem);
      })
      var chordDigs = this.chordHtml.nativeElement.innerHTML;
      for(var i = 0 ; i < tempArray.length ; i++)
      {
          var rep = tempArray[i];
          var re = new RegExp(rep,"g"); 
          chordDigs = chordDigs.replace(re,orgArray[i]);
      }
      this.chordHtml.nativeElement.innerHTML = chordDigs;
      tempArray = [];
      orgArray = [];
  }
  

  setCancelfs()
  {
    if(!this.cancelFS)
    {
     this.cancelFS = true;
    }
  }

  setFormat()
  {
      if(this.cusForm)
      {
        this.custFormat();
      } 
  }

  handleClick()
  {
      var element = <HTMLInputElement> document.getElementById("fsCheck");
      var isChecked = element.checked;
      console.log('element.checked:',element.checked);
      if(isChecked)
      {
          this.showImgs = true;
          this.renderer2.addClass(this.verseHtml.nativeElement,'hidden');
          this.renderer2.removeClass(this.chordImg.nativeElement,'hidden');
      }
      else
      {
          this.showImgs = false;
          this.renderer2.removeClass(this.verseHtml.nativeElement,'hidden');
          this.renderer2.addClass(this.chordImg.nativeElement,'hidden');
      }
  }

  handleHclick()
  {
      console.log('HandleHclick');
      var element = <HTMLInputElement> document.getElementById("hsCheck");
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

  navigateBack()
  {
    switch(this.goBackComp)
    {
      case 'songbook':
      this.router.navigate(['/songbook']);
      break;
      case 'group':
      this.router.navigate(['/group']);
      break;
      default:
      this.router.navigate(['/']);
      break;
    }
  }

  //Setting formatting options
  custFormat()
    {
        if(this.cusForm.bgVerse)
        {
            this.renderer2.setStyle(this.verseHtml.nativeElement,'background-color',this.cusForm.bgVerse);
        }
        if(this.cusForm.tabColor)
        {  
            var tabtags = document.getElementsByClassName("tab");
            for(var i=0;i<tabtags.length;i++)
            {
               this.renderer2.setStyle(tabtags[i],'color',this.cusForm.tabColor);
            }
        }
        if(this.cusForm.tabFont)
        {
            var tabtags = document.getElementsByClassName("tab");
            for(var i=0;i<tabtags.length;i++)
            {
               this.renderer2.setStyle(tabtags[i],'font-family',this.cusForm.tabFont);
            }
        }
        if(this.cusForm.tabSize)
        {
            var tabtags = document.getElementsByClassName("tab");
            for(var i=0;i<tabtags.length;i++)
            {
               this.renderer2.setStyle(tabtags[i],'font-size',this.cusForm.tabSize+`px`);
            }
        }
        if(this.cusForm.textFont)
        {
            var versetags = document.getElementsByClassName("masTxt");
            for(var i=0;i<versetags.length;i++)
            {
               this.renderer2.setStyle(versetags[i],'font-family',this.cusForm.textFont);
            }
        }
       if(this.cusForm.textColor)
        {
            var versetags = document.getElementsByClassName("masTxt")
            for(var i=0;i<versetags.length;i++)
            {
               this.renderer2.setStyle(versetags[i],'color',this.cusForm.textColor);
            }
        }
       if(this.cusForm.textSize)
        {
            var versetags = document.getElementsByClassName("masTxt")
            for(var i=0;i<versetags.length;i++)
            {
               this.renderer2.setStyle(versetags[i],'font-size',this.cusForm.textSize+`px`);
            }
        }
        if(this.cusForm.chordColor)
        {
            var spantags = document.getElementsByClassName("chord")
            for(var i=0;i<spantags.length;i++)
            {
               this.renderer2.setStyle(spantags[i],'color',this.cusForm.chordColor);
            }
            
        }
        if(this.cusForm.chordFont)
        {
            var spantags = document.getElementsByClassName("chord")
            for(var i=0;i<spantags.length;i++)
            {
               this.renderer2.setStyle(spantags[i],'font-family',this.cusForm.chordFont);
            }
        }
        if(this.cusForm.chordSize)
        {
            var spantags = document.getElementsByClassName("chord")
            for(var i=0;i<spantags.length;i++)
            {
               this.renderer2.setStyle(spantags[i],'font-size',this.cusForm.chordSize+`px`);
            }
        }
        if(this.cusForm.metaColor)
        {
            var ptags = document.getElementsByClassName("centercls")
            for(var i=0;i<ptags.length;i++)
            {
               this.renderer2.setStyle(ptags[i],'color',this.cusForm.metaColor);
            }
            
        }
        if(this.cusForm.metaFont)
        {
            var ptags = document.getElementsByClassName("centercls")
            for(var i=0;i<ptags.length;i++)
            {
               this.renderer2.setStyle(ptags[i],'font-family',this.cusForm.metaFont);
            }
        }
        if(this.cusForm.metaSize)
        {
            var ptags = document.getElementsByClassName("centercls")
            for(var i=0;i<ptags.length;i++)
            {
               this.renderer2.setStyle(ptags[i],'font-size',this.cusForm.metaSize+`px`);
            }
        }
    }

}
