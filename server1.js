let express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser');

let app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

let users = [],
    rooms = [];

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
    let email = req.body.email;
    let user = users.find(function (item) {
        if (item.email == email) {
            return item;
        }
    });
    if (user) {
        req.session.user = user;
        res.send({code: 0, msg: 'success', data: user});
    } else {
        user = {
            email,
            _id: Math.random(),
            avatar: 'https://secure.gravatar.com/avatar/email?s=32'
        };
        users.push(user);
        req.session.user = user;
        res.send({code: 0, msg: 'success', data: user});
    }
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
    res.send({code: 0, msg: 'success', data:rooms});
});

app.post('/rooms', function (req, res) {
    let room = {name: req.body.room};
    room.users = room.messages = [];
    room._id = Math.random();
    rooms.push(room);
    res.send({code: 0, msg: 'success', data:room});
});

app.get('/room/:_id', function (req, res) {
    let _id = req.params._id;
    let room = rooms.find(function (item) {
        if (item._id == _id) {
            return item;
        }
    });
    if (room) {
        res.send({code: 0, msg: 'success', data:room});
    } else {
        res.send({code: 1, msg: 'error'});
    }
});

io.on('connection', function (socket) {
    socket.on('enter room', function (info) {
        let _id = info._id;
        socket.join(_id);
        let room = rooms.find(function (item) {
            if (item._id == _id) {
                return item;
            }
        });
        let userId = info.user;
        let user = users.find(function (item) {
            if (item._id == userId) {
                return item;
            }
        });
        room.users = room.users.filter(function (item) {
            return item._id != userId;
        });
        room.users.push(user);
        socket.on('message', function (message) {
            message.user = user;
            room.messages.push(message);
            io.in(_id).emit('message', message);
        })
    });
    socket.on('leave room', function (info) {
        let _id = info._id,
            userId = info.user;
        let room = rooms.find(function (item) {
            if (item._id == _id) {
                return item;
            }
        });
        room.users = room.users.filter(function (item) {
            return item._id != userId;
        });
        socket.leave(_id);
    })
});

server.listen(80, ()=> {
    console.log('Server is listening on 80 port');
});
