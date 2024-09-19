var express = require('express');
var router = express.Router();
const { FSDB } = require("file-system-db");
const db = new FSDB("boxes.json", false);
const passport = require('passport');
const cookieSession = require('cookie-session');


// app.get('/', (req, res) => {
// 	res.send("<button><a href='/auth'>Login With Google</a></button>")
// });

// Auth 
router.get('/auth' , passport.authenticate('google', { scope:
		[ 'email', 'profile' ]
}));

// Auth Callback
router.get('/auth/callback', function(req, res, next) {
	console.log('req: %o',req);
	passport.authenticate( 'google',
		{
			successRedirect: '/auth/callback/success?redirect',
			failureRedirect: '/auth/callback/failure',
		}
	)(req,res)
});

// Success 
router.get('/auth/callback/success' , (req , res) => {
	if(!req.user)
		res.redirect('/auth/callback/failure');
	if(req.state?.redirect) res.redirect(req.state.redirect);
	if(req.query?.redirect) res.redirect(req.query.redirect);
	res.send(`Welcome ${req.user.email} - go <a href="/">home</a>`);
});

// failure
router.get('/auth/callback/failure' , (req , res) => {
	res.send("Error");
})

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.get('host'));
	if(!req.user) {
		res.send("<button><a href='/auth?redirect=/'>Login With Google</a></button>");
	}
	if(req.query.contents && req.query.code) {
		db.set("box"+req.query.code, {index: req.query.code, contents: req.query.contents+"\n"});
	}
	let boxOutput = "";
	if(req.query.code) {
		boxOutput="";
		if(db.get("box"+req.query.code) && db.get("box"+req.query.code).contents) {
			boxOutput = db.get("box"+req.query.code).contents;
		}
	}
	res.render('index', { title: 'code', code: req.query.code, output: boxOutput });
});
/* get boxes list */
router.get('/boxes', function(req, res, next) {
	if(!req.user) {
		res.send("<button><a href='/auth?redirect=/'>Login With Google</a></button>");
		next();
	}
	var boxes = db.getAll();
	var boxmap = boxes.map(b => {
		return {
			...b,
			title: b.value.contents.substring(0, b.value.contents.indexOf("\n"))
		}
	})
	.sort((a,b) => (Number(a.value.index) > Number(b.value.index)) ? 1 : ((Number(b.value.index) > Number(a.value.index)) ? -1 : 0))
	res.render('boxes', { title: 'boxes', boxes: boxmap });
});
router.get('/test', function(req, res, next) {
	res.render('test', { title: 'test' });
});

module.exports = router;
