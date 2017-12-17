function playAudio3(id_number) {
    console.log('Inside play audio');
    var button = document.getElementById('playbut_' + id_number);
    button.style.background = "url('https://www.scales-chords.com/images/snd-mute-green-2.png') no-repeat";
    button.style.backgroundSize = "100%";
    var music = document.getElementById('music' + id_number);
    console.log('Music route:',music);
    music.play();
    console.log('Promise:',music.play());
}

function audioStop(id_number) {
    console.log('Audio stop');
    var button = document.getElementById('playbut_' + id_number);
    button.style.background = "url('https://www.scales-chords.com/images/snd-play-green-2.png') no-repeat";
    button.style.backgroundSize = "100%";
}

    
function scales_chords_api_onload()
    {   
            console.log('INSIDE SCALES API ONLOAD');
            var api_url = "https://www.scales-chords.com/api/scapi.1.3.php";
            if (typeof api_override_url !== 'undefined') {var api_url = api_override_url; }
            if (typeof scales_chords_api_debug === 'undefined') { var scales_chords_api_debug = false; }
            var x = document.getElementsByClassName("scales_chords_api");
            var obj_id_count = 1;
            if (scales_chords_api_debug) console.log(x);
            for (var i = 0; i < x.length; i++) 
            {
            // params for one object
                var params = "";
                var first = true;
                var obj = x[i];
                obj.id = "scapiobjid" + obj_id_count;
                obj_id_count +=1;
                var att = x[i].attributes;
                if (scales_chords_api_debug) console.log(x[i]);
                if (scales_chords_api_debug) console.log(att);
                if (scales_chords_api_debug) console.log(att.length);
                for (j = 0; j < att.length ; j++) 
                {
                    if (scales_chords_api_debug) console.log(att[j]);
                    if (scales_chords_api_debug) console.log("name: " + att[j].nodeName + " value: " + att[j].nodeValue );
                    if (!first) params += "&"; 
                    else params = "id=" + obj.id + "&";
                    first = false;
                    params += encodeURI(att[j].nodeName) + "=" + encodeURI(att[j].nodeValue);
                }
                if (scales_chords_api_debug) alert(params);
                // make the ajax call here
                ajaxCall(api_url,params,function(xmlhttp)
                {
                    console.log('INSIDE ajax call');
                    var myString = xmlhttp.responseText; 
                    var myStringArray = myString.split("###RAWR###");
                    var objid = myStringArray[0];
                    console.log('My string array:',objid);
                    if (scales_chords_api_debug)
                    {
                        document.getElementById(objid).innerHTML = "<!--" + mystring + "-->";
                        if (myStringArray[2].length > 0) document.getElementById(objid).innerHTML += myStringArray[2];
                    } 
                    else 
                    {
                        if (myStringArray[2].length > 0)
                        console.log('My string array 2:',myStringArray[2]);
                        console.log('objid:',document.getElementById(objid));
                        document.getElementById(objid).innerHTML = myStringArray[2]; 
                    }
                });
                //ajax call
                function ajaxCall( url, params, successCallback, failCallback, ongoingCallback, cfg )
                {
                var xhr;
                if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();} else {xhr = new ActiveXObject( "Microsoft.XMLHTTP" );}

                xhr.onreadystatechange = function() {
                    if ( xhr.readyState === 4 ){
                        if ( xhr.status === 200 ) {
                            if ( successCallback ) {
                                successCallback( xhr );
                            }
                        } else {
                            if ( failCallback ) {
                                failCallback( xhr );
                            }          
                        }
                    } else {
                        if ( ongoingCallback ) {
                            ongoingCallback( xhr );
                        }
                    }
                };

                var paramString = "";

                if ( typeof params === "string" )
                    paramString = params;
                else
                    if ( params && typeof params === "object" )
                    {
                        for ( var p in params )
                        {
                            var pValue = params[ p ];

                            if ( typeof pValue === "string" )
                                pValue = encodeURIComponent( pValue );

                            paramString += "&" + p + "=" + pValue;
                        }

                        if ( paramString.length > 0 )
                            paramString = paramString.substring( 1 );
                    }

                

                xhr.open( "POST", url , true );

                if ( cfg )
                {
                    if ( cfg.options )
                    {
                        for( var o in cfg.options )
                        {
                            if ( o in xhr )
                                xhr[ o ] = cfg.options[ o ];
                        }
                    }

                    if ( cfg.headers )
                    {
                        for( var h in cfg.headers )
                        {
                            xhr.setRequestHeader( h, cfg.headers[ h ] );
                        }
                    }
                }

                xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
                xhr.send( paramString );
            }
        } //end of for 
        
        }//end of onload


window.addEventListener('load',load_function);
window.addEventListener('change',change_function);
window.addEventListener('click',click_function); //full screen


var b1;

function change_function()
{   
    console.log('Change function');
    b1 = document.getElementById("b1");
    console.log('b1:',b1);
    if((b1!== null)&&(b1!== undefined)) 
    {
      console.log('EVent listener added for b1');
      b1.addEventListener("click",button_clickedfn);
    }   
}

function click_function()
{   
    console.log('click_function');
    vfullscreen = document.getElementById("vfullscreen");
    if((vfullscreen!== null)&&(vfullscreen!== undefined)) 
    {
      vfullscreen.addEventListener("click",full_clickedfn);
    }
    fsCheck = document.getElementById("fsCheck");
    console.log('fsCheck:',fsCheck);
    var dflg = false;
    if((fsCheck!== null)&&(fsCheck!== undefined)) 
    {
      console.log('EVent listener added for fsCheck');
      fsCheck.addEventListener('change',chordDiagram_fn);
    }   
    hsCheck = document.getElementById("hsCheck");
    console.log('hsCheck:',hsCheck);
    var hflg = false;
    if((hsCheck!== null)&&(hsCheck!== undefined)) 
    {
      console.log('EVent listener added for hsCheck');
      hsCheck.addEventListener('change',hoverDiagram_fn);
    }  
}


function load_function()
{   
    console.log('Load function');
    b1 = document.getElementById("b1");
    console.log('b1:',b1);
    if((b1!== null)&&(b1!== undefined)) 
    {
      console.log('EVent listener added for b1');
      b1.addEventListener("click",button_clickedfn);
    }   
}

function full_clickedfn()
{
    console.log('Inside full_clickedfn');
    var docElm = document.getElementById("mainCont");
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.msRequestFullscreen) {
        docElm = document.body; //overwrite the element (for IE)
        docElm.msRequestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
}

function button_clickedfn()
{
    var hflg = false;
    var dflg = false;
    console.log('Checkbox Click');
    var byid = document.getElementById("myCheck");
    console.log('myCheck:',byid);
    byid.addEventListener( 'change', chordDiagram_fn);
    var byid1 = document.getElementById("hoverOver");
    console.log('hoverOver:',byid1);
    byid1.addEventListener( 'change', hoverDiagram_fn);
}

function chordDiagram_fn()
{
    console.log('INSIDE CDF');
    if(this.checked) 
    {
        // Checkbox is checked..
        console.log('Inside chordDiagram_fn checked');
        console.log('Only called');
        scales_chords_api_onload();
        dflg = true;
    } 
};
function hoverDiagram_fn()
{
        if(this.checked) 
        {
            // Checkbox is checked..
            console.log('Inside checked 2');
            hflg = true;
            addHref();
            scales_chords_api_onload()
        }
        else 
        {
            console.log('Inside remove checked 2');
            if(hflg)
            {
                removeHref()
            }  
        }
}

function addHref(){
    var chordtags = document.getElementsByClassName("colorc");
    for(var i=0;i<chordtags.length;i++)
    {
         //this.renderer2.setStyle(chordtags[i],'color',this.cusForm.tabColor);
          var chord = chordtags[i].innerHTML;
          console.log('The chord from innerhtml of chord class:',chord);
          var newSpan = document.createElement("span");
          newSpan.className = 'hoverc';
          //document.addClass(newSpan,'hoverc');
          chordtags[i].appendChild(newSpan);
          console.log('Chord Tag after appending:',chordtags[i])
          var insStr = `<ins class=\"scales_chords_api\" chord=\"`+chord+`\"></ins>`;
          console.log('Innerhtml for ins:',insStr);
          newSpan.innerHTML = insStr;
    }
}

function removeHref()
{
     console.log('Inside removehref');
     var remSpan = document.getElementsByClassName("hoverc");
     var remColorc = document.getElementsByClassName("colorc");
     for(var i=0;i<remColorc.length;i++)
    {
        console.log('Loop counter:',i);
        console.log('be4 remColorc:',remColorc);
        console.log(' be4 remSpan:',remSpan)
        remColorc[i].removeChild(remSpan[0]);
        console.log('remColorc:',remColorc);
        console.log('remSpan:',remSpan);
    }
}
