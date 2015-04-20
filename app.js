var bodyParser = require('body-parser');
var express = require('express');
var hashids = require('hashids');
var http = require('http');
var ejs = require('ejs');
var mongo = require('mongojs');
var uid = require('node-uuid');
var moment = require('moment');

var collections = ["posts","categories","comments"];
var db = require("mongojs").connect("mongodb://localhost:27017/adbcrud", collections);

var app = express();
var httpServer = http.createServer(app);

app.use('/views', express.static('/views'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// If you delete this WW3 will become a reality
app.use(bodyParser.json());
// This is needed for the forms to work
app.use(bodyParser.urlencoded({extended:false}));

/*=================================
		  Initial Route
=================================*/

// Home Route
app.get('/', function(req, res){
	/*  
		This route will query all posts in the mongo posts collection 
		and load a post with it's corresponding comments
	*/
	
	db.posts.find(function(err, docs){
		
		res.render('index', {
		  title: 'Home',
		  docs: docs
		});
		
	});
	
	

})


/*=================================
		  Posts Routes
=================================*/

// Posts Add Route
app.get('/posts/create', function(req, res){
	/*  
		This route will render a post add form
	*/
	
	res.render('postadd', {
      title: 'Create Post',
    });

})

// Posts Add Route
app.get('/posts/createaction', function(req, res){
	/*  
		This route will render a post add form
		
		inputs: Author, Category, Title, Content
		URL: http://localhost:3000/posts/createaction?author=John&category=General&title=Hello&content=My%20Posts%20content
	*/
	
	var author=req.param('author');
	var category=req.param('category');
	var title=req.param('title');
	var content=req.param('content');
	
	if( author == ""  
	   && title == "" 
	   && content == ""
	   || category == ""
	   || category == "Select a Category..."
	){
		res.redirect('/posts/create');
	}else{
		var document = Array();
		document['author'] = author;
		document['category'] = category;
		document['title'] = title;
		document['content'] = content;
		document['comments'] = [];

		//var collection = db.collection('posts');

		//console.log(db.posts.save);

		// Insert into the db
		var now = moment().format('MMMM Do YYYY, h:mm:ss a');
		db.posts.save
		(
			{
				_id: uid.v1(),
				author:author,
				time: now,
				category:category,
				title: title,
				content: content,
				comments: []
			}
		);
		res.redirect('/');
	}
})

// Posts Update Route
app.get('/posts/set', function(req, res){
	/*  
		This route will render a post add form
	*/
	
	var id=req.param('postId');
	
	db.posts.find({_id:id},function(err, docs){
		res.render('postset', {
		  	title: 'Edit Post',
		  	postId: id,
			author: docs[0]['author'],
			content: docs[0]['content'],
			category: docs[0]['category'],
			postTitle: docs[0]['title'],
		});
	});

})

// Posts Update Route
app.get('/posts/setaction', function(req, res){
	/*  
		This route will render a post add form
	*/
	var id = req.param('postId');
	
	db.posts.find({_id:id},function(err, docs){
	
		var author = req.param('author');
		var content = req.param('content');
		var category = req.param('category');
		var title = req.param('title');
		
		db.posts.update({_id: id},{$set:{ author: author, content: content, category:category, title:title }});
		res.redirect('/');
		
	});
	

})

// Posts Show Details Route
app.get('/posts/show', function(req, res){
	/*  
		This route will render a post add form
	*/
	var id=req.param('postId');
	
	db.posts.find({_id:id},function(err, docs){
		
		 res.json(docs);
		
	});
})


/*=================================
		  Comments Route
=================================*/

// Comments Add Route
app.get('/comments/create', function(req, res){
	/*  
		This route will render a post add form
	*/
	var id=req.param('postId');
	
	res.render('commentadd', {
      title: 'Write Comment',
      _id: id
    });

})

// Comments Add Route
app.get('/comments/createaction', function(req, res){

	
	// Store GET values	
	var author=req.param('author');
	var id=req.param('_id');
	var content=req.param('content');
	
	// If empty submission redirect
	if( author == ""   
	   || id == "" 
	   || content == ""
	){
		res.redirect('/comments/create');
		
	// Else try to update
	}else{
		
		// Get time for "now"
		var now = moment().format('MMMM Do YYYY, h:mm:ss a');
		
		// Prepare the comment to be inserted
		document={
			author:author,
			postId:id,
			time:now,
			content:content
		};
		
		
		// Find where the post id exists
		db.posts.find({_id:id},function(err, docs){
	
			// Update where id = postid
			db.posts.update({_id: id},{$addToSet:{ comments: document }});
			res.redirect('/');
		});
	}
})

/*=================================
		  API's Route
=================================*/

// Categories API
app.get('/categories/api', function(req, res){
	/*  
		This route will render a post add form
	*/
	
	db.posts.distinct("category", function(err, docs){
		
		 res.json(docs);
		
	});
	
})

// Posts API
app.get('/posts/api', function(req, res){
	
	db.posts.find(function(err, docs){
		
		 res.json(docs);
		
	});
	
})

httpServer.listen(3000, function() {
	console.log('Express server listening on port 3000');
});