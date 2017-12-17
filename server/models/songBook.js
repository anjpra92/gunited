var mongoose = require('mongoose');

var songBookSchema = mongoose.Schema({

    authEmail :{ type : String},
    songName:{ type:String},
    songvHtml :{type : String},
    songDef:{type:String},
    songdHtml :{type : String},

});
//Creating a model for the schema
var SongBook = module.exports = mongoose.model('SongBook',songBookSchema,'songbook');
