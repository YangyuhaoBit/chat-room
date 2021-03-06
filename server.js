let express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser'),
    userModel = require('./db').userModel,
    roomModel = require('./db').roomModel;

let app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('app')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'yyh',
    resave: true,
    saveUninitialized: true
}));

app.get('/', function (req, res) {
    res.sendFile(path.resolve('app/index.html'));
});

app.post('/user/login', function (req, res) {
    let user = {email: req.body.email};
    userModel.findOne(user).then(function (data) {
        if (data) {
            req.session.user = data;
            res.send({code: 0, msg: 'success', data});
        } else {
            user.avatar = 'https://secure.gravatar.com/avatar/email?s=32';
            userModel.create(user).then(function (data) {
                req.session.user = data;
                res.send({code: 0, msg: 'success', data});
            }, function (error) {
                res.send({code: 1, msg: 'error', error});
            })
        }
    }, function (error) {
        res.send({code: 1, msg: 'error', error});
    })
});

app.get('/user/session', function (req, res) {
    if (!req.session.user) {
        res.send({code: 1, msg: 'error'});
    } else {
        res.send({code: 0, msg: 'success', data: req.session.user});
    }
});

app.get('/user/logout', function (req, res) {
    req.session.user = null;
    res.send({code: 0, msg: 'success'});
});

app.get('/rooms', function (req, res) {
    roomModel.find({}).then(function (data) {
        res.send({code: 0, msg: 'success', data});
    }, function (error) {
        res.send({code: 1, msg: 'error', error});
    })
});

app.post('/rooms', function (req, res) {
    let room = {name: req.body.room};
    room.users = room.messages = [];
    roomModel.create(room).then(function (data) {
        res.send({code: 0, msg: 'success', data});
    }, function (error) {
        res.send({code: 1, msg: 'error', error})
    })
});

app.get('/room/:_id', function (req, res) {
    roomModel.findById(req.params._id).populate('users').populate('messages.user').then(function (data) {
        res.send({code: 0, msg: 'success', data});
    }, function (error) {
        res.send({code: 1, msg: 'error', error});
    });
});

io.on('connection', function (socket) {
    socket.on('enter room', function (info) {
        let _id = info._id;
        socket.join(_id);
        roomModel.findOne({_id, users: info.user}).then(function (data) {
            if (!data) {
                roomModel.update({_id}, {$push: {users: info.user}}).then();
            }
        });
        let user = null;
        userModel.findById(info.user).then(function (data) {
            user = data;
        });
        socket.on('message', function (message) {
            roomModel.update({_id}, {$push: {messages: message}}).then();
            message.user = user;
            io.in(_id).emit('message', message);
        })
    });
    socket.on('leave room', function (info) {
        let _id = info._id;
        roomModel.update({_id}, {$pull: {users: info.user}}).then();
        socket.leave(_id);
    })
});

server.listen(80, ()=> {
    console.log('Server is listening on 80 port');
});
