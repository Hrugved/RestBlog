var bodyParser = require("body-parser"), //so that we can use req.body
	methodOverride = require("method-override"), //to solve problem where we cant use PUT with html-forms
	expressSanitizer = require("express-sanitizer"), //to remove all script tags from user-input
	mongoose = require("mongoose"), //js overlay to interact with mongodb
	express = require("express"), 
	app = express(); 

// APP config
//mongoose.connect("mongodb://localhost/Blog");

mongoose.connect("mongodb+srv://pineappleiitian:moongoosepassword@cluster0-qvm9l.mongodb.net/cluster0?retryWrites=true&w=majority");

app.set("view engine", "ejs"); //to save us fro type .ejs repeatedy
app.use(express.static("public")); //to be able to use .css external files
app.use(bodyParser.urlencoded({extended:true})); 
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MOONGOOSE/model config
var blogSchema = new mongoose.Schema({
	title : String,
	img : String,
	body : String,
	created : {type : Date, default : Date.now}
});
var Blog = mongoose.model("Blog",blogSchema); 

//-- RESTFUL routes --//

//ROOT
app.get("/",(req,res)=>{
	res.redirect("/blogs");
});

//SHOW-INDEX
app.get("/blogs",(req,res)=>{
	Blog.find({},(err,Blogs)=>{	
		if(err) {console.log('Error fetching all blogs from DB', e)}
		else {res.render("index",{blogs:Blogs});}
	})
});

//CREATE-FORM
app.get("/blogs/new",(req,res)=>{
	res.render("new");
});

//CREATE-POST
app.post("/blogs",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err) { res.render("new");}
		else { res.redirect("/blogs");}
	});
});

//SHOW
app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err) { res.redirect("/blogs");}
		else { res.render("show", {blog:foundBlog});}
	});
});

//EDIT-FORM
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err) { res.redirect("/blogs");}
		else {res.render("edit", {blog:foundBlog});}
	});
});

//EDIT-PUT
app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err, updatedBlog)=>{
		if(err) {res.redirect("/blogs");}
		else {res.redirect("/blogs/" + req.params.id);}
	});
});

//DELETE
app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err) { res.redirect("/blogs");}
		else {res.redirect("/blogs"); }
	});
});

const port = process.env.PORT || 3001 
app.listen(port,process.env.IP,()=>{
	console.log("Server is up and Running!");
});
	