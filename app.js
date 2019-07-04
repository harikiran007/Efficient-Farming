const express    = require("express"),
      app        = express(),
      bodyparser = require("body-parser"),
      passport   = require("passport"),
      Localstartegy = require("passport-local"),
      passportlocalmongoose = require("passport-local-mongoose"),
      User                  = require("./models/users"),
      mongoose 				= require("mongoose"), 
      Index = require("./routes/index"),
      Middleware  = require("./middleware/index"),
      UserInfo    = require("./routes/userinfo"),
      RentalService = require("./routes/rental-service");

mongoose.connect("mongodb://localhost/BigO",{useNewUrlParser:true});


//serve static file and form data retrieve 
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.set("view engine","ejs");

//sessions
app.use(require("express-session")({
    secret:"holla bolla dolla",
    resave:false,
    saveUninitialized:false
}));

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

//passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/" , function(req,res){
    res.send("all details saved");  
});

app.get("/sample", Middleware.isLoggedIn,function(req,res){
  res.send("ok all set");
});



//redirecting the routes
app.use("/", Index);
app.use("/user", UserInfo);
app.use("/find", RentalService);

app.listen(3000,function(){
	console.log("server running " + this.address().port);
});

