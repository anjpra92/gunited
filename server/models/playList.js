var mongoose = require('mongoose');

var playListSchema = mongoose.Schema({

    authEmail :{ type : String},
    playlistName:{ type:String},
    songName :{type : String}
});
//Creating a model for the schema
var PlayList = module.exports = mongoose.model('PlayList',playListSchema,'playlist');