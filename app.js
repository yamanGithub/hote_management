/* controllers impor*/
const authUser = require('./controller/auth');
const getDashBoardData = require('./controller/dashboard');
const guestModuel = require('./controller/guest');

const cors = require('cors')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
var session = require('express-session')
const port = 3000;
var corsOptions = {
	origin: 'http://localhost:4200', // webpack dev server port
	credentials:true
  }
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    maxAge:900000
}));
// app.use(cookieParser());

// Login Page Route
app.post('/login', (req, res) => {
    authUser(req.body.username, req.body.password, (result) => {
        let user;
        if (result.data.length > 0 && result.status) {
            user = result.data;
            req.session['userData'] = user[0];
            console.log('After Session Set')
            console.log(req.session);
        }
        res.send(result);
    });
});
app.get('/logout', (req, res) => {
    req.session.destroy(function () {
        res.send({ status: true, msg: 'Logout completed !' });
    });
});
// Dashboard Page Route
app.get('/dashboard', (req, res) => {
    getDashBoardData((result) => {
        res.send(result);
    });

});
// Guest Route
app.get('/getAllGuest', (req, res) => {
    guestModuel.getAllGuest((result) => {
        res.send(result);
    });
});
app.post('/checkoutGuest', (req, res) => {
    guestModuel.checkOutGuest(req.body.data,(result) => {
        res.send(result);
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// middleware
function checkSignIn(req, res, next) {
    console.log('In other routes')
    console.log(req.session)
    if (req.session.user) {
        next();     //If session exists, proceed to page
    } else {
        var err = { msg: "Not logged in!", data: [], status: false };
        res.send(err);
    }
}