let mongoose = require('mongoose'),
    config = require('../config/index');

mongoose.connect(config.dbUrl);
mongoose.Promise = Promise;

let UserSchema = new mongoose.Schema({
    email: String,
    avatar: String
});

ObjectId = mongoose.Schema.Types.ObjectId;

let RoomSchema = new mongoose.Schema({
    name: String,
    users: [{type: ObjectId, ref: "User"}],
    messages: [{
        user: {type: ObjectId, ref: "User"},
        content: String,
        createAt: {type: Date, default: Date.now()}
    }]
});

let userModel = mongoose.model('User', UserSchema),
    roomModel = mongoose.model('Room', RoomSchema);

module.exports = {userModel, roomModel};
