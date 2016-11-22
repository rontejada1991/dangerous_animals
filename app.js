var expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express();

// APP CONFIG //
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); // Must go after bodyParser
mongoose.connect("mongodb://localhost/animals");

// SCHEMA CONFIG //
var animalSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    created: {type: Date, default: Date.now}
});

// MODEL CONFIG //
var Animal = mongoose.model("Animal", animalSchema);

// home route
app.get("/", function(req, res) {
   res.redirect("/animals"); 
});

// RESTFUL ROUTES //
// index
app.get("/animals", function(req, res) {
    Animal.find({}, function(err, animals) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {animals:animals});
        }
    });
});

// new
app.get("/animals/new", function(req, res) {
    res.render("new");
});

// create
app.post("/animals", function(req, res) {
    req.body.animal.body = req.sanitize(req.body.animal.body);
    Animal.create(req.body.animal, function(err, animal) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/animals");
        }
    });
});

// show
app.get("/animals/:id", function(req, res) {
    Animal.findById(req.params.id, function(err, animal) {
        if (err) {
            console.log(err);
        } else {        
          res.render("show", {animal:animal});
        }
    });
});

// edit
app.get("/animals/:id/edit", function(req, res) {
   Animal.findById(req.params.id, function(err, animal) {
       if (err) {
           console.log(err);
       } else {
           res.render("edit", {animal:animal});           
       }
   });
});

// update
app.put("/animals/:id", function(req, res) {
   req.body.animal.body = req.sanitize(req.body.animal.body);
   Animal.findByIdAndUpdate(req.params.id, req.body.animal, function(err, animal) {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/animals/" + req.params.id);
      } 
   });
});

// delete
app.delete("/animals/:id", function(req, res) {
   Animal.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/animals");
      }
   });
});

// SERVER //
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server has started"); 
});
