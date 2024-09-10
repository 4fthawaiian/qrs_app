var express = require('express');
var router = express.Router();
const { FSDB } = require("file-system-db");
const db = new FSDB("boxes.json", false);

/* GET home page. */
router.get('/', function(req, res, next) {
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
router.get('/boxes', function(req, res, next) {
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

module.exports = router;
