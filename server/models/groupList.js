var mongoose = require('mongoose');

var groupListSchema = mongoose.Schema({

    authEmail :{ type : String},
    groupName:{ type:String},
    friendEmails:[{type:String}],
    playListNames:[{type : String}]
});
//Creating a model for the schema
var GroupList = module.exports = mongoose.model('GroupList',groupListSchema,'grouplist');