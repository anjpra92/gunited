const express = require('express');
var request = require("request");
const router = express.Router();
var multer = require('multer');
var DIR = './server/routes/uploads/';
var upload = multer({dest: DIR}).single('file');




//Getting auth0 BEARER token
var request = require("request");

router.get('/users',(req,res)=>
{
    var options = { method: 'POST',
      url: 'https://gunited.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: {
             client_id:"U6VZvXWrWiCUi0dMUtiV6zmbZNMu5fOO",
             client_secret:"jct52sojpEoYrntPSW8FT50HMbYV3BRZ0nLLqco3pwBDpFqQdNKAgYIuChYft_-s",
             audience:"https://gunited.auth0.com/api/v2/",
             grant_type:"client_credentials"}, 
      json:true };
    var tokenHolder;
    request(options, function (error, response, body) 
    {
      if (error) throw new Error(error);
      tokenHolder = 'Bearer '+body.access_token;
      var option = { 
                method: 'GET',
                url: 'https://gunited.auth0.com/api/v2/users',
                headers: { authorization: tokenHolder } 
               };
      request(option, function (error, response, users) 
        {
            if (error) throw new Error(error);
            res.send(users);
        });
    });
});

//Sending the bearer token for Profile Edit Update
router.get('/users/userupdate',(req,res)=>
{
    console.log('USER UPDATE ENTER');
    var options = { method: 'POST',
      url: 'https://gunited.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: {
             client_id:"U6VZvXWrWiCUi0dMUtiV6zmbZNMu5fOO",
             client_secret:"jct52sojpEoYrntPSW8FT50HMbYV3BRZ0nLLqco3pwBDpFqQdNKAgYIuChYft_-s",
             audience:"https://gunited.auth0.com/api/v2/",
             grant_type:"client_credentials"}, 
      json:true };
    var tokenHolder;
    request(options, function (error, response, body) 
    {
      if (error) throw new Error(error);
      tokenHolder = 'Bearer '+body.access_token;
      res.send(tokenHolder);
    });
});

//Image Upload
router.post('/uploads', function (req, res, next) {
     console.log('Image Uploaded call - post');
     upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          console.log(err);
          return res.status(422).send("an Error occured")
        }  
       // No error occured.
        var path = req.file.path;
        var filename = req.file.filename;
        return res.send(filename); 
  });     
});

//Accessing Image for displaying user profile details
router.get('/uploads/:fname', function (req, res, next) {
        console.log('Image Uploaded call - get');
       // No error occured.
        var fname = req.params.fname;
        var floc = "/uploads/"+fname;
        var path = req.params.fpath;
        return res.sendFile(__dirname + floc); 
     
});

//To display the Logo
router.get('/uploads/serverpic/:fname', function (req, res, next) {
       // No error occured.
        var fname = req.params.fname;
        var floc = "/uploads/serverpic/"+fname;
        return res.sendFile(__dirname + floc); 
})

//To send the x-tag-components.js file
router.get('/AcidJs.XChord/lib/:fname', function (req, res, next) {
       // No error occured.
        console.log('Inside getting component.js/scales-chords-api');
        var fname = req.params.fname;
        var floc = "/AcidJs.XChord/lib/"+fname;
        return res.sendFile(__dirname + floc); 
})

//To send the test.js/xchord.html
router.get('/AcidJs.XChord/classes/:fname', function (req, res, next) {
       // No error occured.
        console.log('Inside getting test.js/xchord.html');
        var fname = req.params.fname;
        var floc = "/AcidJs.XChord/classes/"+fname;
        return res.sendFile(__dirname + floc); 
})

//To send the Xchord.css
router.get('/AcidJs.XChord/styles/:fname', function (req, res, next) {
       // No error occured.
        console.log('Inside getting css');
        var fname = req.params.fname;
        var floc = "/AcidJs.XChord/styles/"+fname;
        return res.sendFile(__dirname + floc); 
})

//Database calls

//Song Details
//Posting the song details to the database
router.post('/songBook', function (req, res, next) 
{
     console.log('Inside posting /songBook');
      var songbook = new SongBook
      ({
          authEmail : req.body.emailAddr,
          songName : req.body.sName,
          songvHtml : req.body.svHtml,
          songDef : req.body.sdefHtml,
          songdHtml : req.body.sdHtml,
      });
      songbook.save(function(err,result)
      {
          if (err)
            return console.log(err);
          else
            res.send(result);
      })    
});


//Getting all the songs from the database saved by the specific user
router.get('/songBook/:user_email', function (req, res, next) {
    console.log('Inside getting songBook');
    console.log('Email:',req.params.user_email);
    SongBook.find({authEmail: req.params.user_email } ,function(err,songdetails)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(songdetails);
    });    
});

//Getting specific song from the database saved by the specific user
router.get('/songBook/single/:id', function (req, res, next) {
    console.log('Inside getting single song');
    SongBook.findById( req.params.id ,function(err,songdetail)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(songdetail);
    });    
});

//Deleting song from DB
router.delete('/songBook/delreq/:_id', function (req, res, next) {
    console.log('Inside delreq');
    SongBook.remove({_id : req.params._id}, function(err,songDet)
    {
        if(err)
            return console.log(err);
        else
            res.send(songDet);
    });    
});

//PlayList Details

//Saving PlayList with songs to DB
router.post('/playList', function (req, res, next) 
{
     console.log('Inside posting /playList');
      var playlist = new PlayList
      ({
          authEmail : req.body.emailAddr,
          playlistName : req.body.plName,
          songName : req.body.sName
      });
      playlist.save(function(err,result)
      {
          if (err)
            return console.log(err);
          else
            res.send(result);
      })    
});


//Getting all the playlist names and associated songs with each name
router.get('/playList/:user_email', function (req, res, next) {
    console.log('Inside getting playList');
    PlayList.find({authEmail: req.params.user_email } ,function(err,listdetails)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(listdetails);
    });    
});

//Getting all the songs in the playlist name specified
router.get('/playList/:user_email/:plname', function (req, res, next) {
    console.log('Inside getting playList');
    PlayList.find({authEmail: req.params.user_email,playlistName:req.params.plname } ,function(err,listdetails)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(listdetails);
    });    
});

//Deleting playlist from DB
router.delete('/playList/delplreq/:email/:plname', function (req, res, next) {
    console.log('Inside playList delplreq delreq');
    PlayList.remove({authEmail:req.params.email,playlistName : req.params.plname}, function(err,listDet)
    {
        if(err)
            return console.log(err);
        else
            res.send(listDet);
    });    
});

//Deleting a song from a PlayList
router.delete('/playList/delsgreq/:_id', function (req, res, next) {
    console.log('Inside playList delsgreq ');
    PlayList.remove({_id : req.params._id}, function(err,listDet)
    {
        if(err)
            return console.log(err);
        else
            res.send(listDet);
    });    
});

//Deleting a song that was removed from songlist
router.delete('/playList/delslreq/:auth_email/:song_name', function (req, res, next) {
    console.log('Inside playList delslreq ');
    PlayList.remove({authEmail : req.params.auth_email,songName:req.params.song_name}, function(err,listDet)
    {
        if(err)
            return console.log(err);
        else
            res.send(listDet);
    });    
});

//Friend Group Details

//Saving new group to DB from FG component
router.post('/group/newgroup', function (req, res, next) 
{
     console.log('Inside posting /newgroup');
      var group = new GroupList
      ({
          authEmail : req.body.emailAddr,
          groupName : req.body.gName
          
      });
      group.friendEmails.push(req.body.femailAddr);
      group.save(function(err,result)
      {
          if (err)
            return console.log(err);
          else
            res.send(result);
      })    
});

//Saving new group from songbook component
router.post('/group/newgrouppl', function (req, res, next) 
{
     console.log('Inside posting /newgrouppl');
      var group = new GroupList
      ({
          authEmail : req.body.emailAddr,
          groupName : req.body.gName
          
      });
      group.playListNames.push(req.body.plNames);
      group.save(function(err,result)
      {
          if (err)
            return console.log(err);
          else
            res.send(result);
      })    
});

//Updating the friend emailaddr in the group db from FG component
router.put('/group/updgroup/:auth_email/:g_name/:fr_email', function (req, res, next) 
{
    console.log('Inside updating /updgroup');
    GroupList.findOneAndUpdate( {authEmail:req.params.auth_email, groupName:req.params.g_name}, {$push:{friendEmails:req.params.fr_email}}, {new: true} ,function(err,grpdetail)
    {
        if(err)
            return console.log(err);
        else
          res.send(grpdetail);
    });  
});

//Updatin the playlist for the given group name for the given email _id - songbook component
router.put('/group/updplgroup/:auth_email/:g_name/:plname', function (req, res, next) 
{
    console.log('Inside updating /updplgroup');
    GroupList.findOneAndUpdate( {authEmail:req.params.auth_email, groupName:req.params.g_name}, {$push:{playListNames:req.params.plname}}, {new: true} ,function(err,grpdetail)
    {
        if(err)
            return console.log(err);
        else
          res.send(grpdetail);
    });  
});

//Deleting the playlist for the given group name for the given email _id - songbook component
router.put('/group/delplgroup/:auth_email/:g_name/:plname', function (req, res, next) 
{
    console.log('Inside updating /delplgroup');
    GroupList.findOneAndUpdate( {authEmail:req.params.auth_email, groupName:req.params.g_name}, {$pull:{playListNames:req.params.plname}}, {new: true} ,function(err,grpdetail)
    {
        if(err)
            return console.log(err);
        else
          res.send(grpdetail);
    });  
});

//Deleting the friend for the given group name for the given email _id - songbook component
router.put('/group/delfrgroup/:auth_email/:g_name/:femail', function (req, res, next) 
{
    console.log('Inside updating /delfrgroup');
    GroupList.findOneAndUpdate( {authEmail:req.params.auth_email, groupName:req.params.g_name}, {$pull:{friendEmails:req.params.femail}}, {new: true} ,function(err,grpdetail)
    {
        if(err)
            return console.log(err);
        else
          res.send(grpdetail);
    });  
});

//Getting the Group Details for the current user
router.get('/group/:user_email', function (req, res, next) {
    console.log('Inside getting groupdet');
    GroupList.find({authEmail: req.params.user_email } ,function(err,grpdetails)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(grpdetails);
    });    
});

//Getting friend/playlist name details for given group name
router.get('/group/getgroup/:email/:gname', function (req, res, next) {
    console.log('Inside getting getgroup');
    GroupList.find({authEmail:req.params.email,groupName: req.params.gname} ,function(err,grpdetails)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(grpdetails);
    });    
});

//Getting all group Details
router.get('/allgroup', function (req, res, next) {
    console.log('Inside getting allgroup');
    GroupList.find({} ,function(err,grpdetails)
    {
        if(err)
            return console.log(err);
        else
            // console.log('DETAIL FROM DB:',songdetails);
            res.send(grpdetails);
    });    
});

//Deleting the group from the DB
router.delete('/group/delgroup/:email/:gname', function (req, res, next) {
    console.log('Inside delgroup');
    GroupList.remove({authEmail:req.params.email,groupName : req.params.gname}, function(err,grpDet)
    {
        if(err)
            return console.log(err);
        else
            res.send(grpDet);
    });    
});


module.exports = router;