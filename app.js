//require necessary modules
//test////
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database')
})
mongoose.connect(process.env.MONGODB_URI)

var models = require('./models/model');
var User = models.User;
var Message = models.Message;
var Community = models.Community;

//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//ROUTES GO HERE
app.post('/handletext',function(req,res){
  res.writeHead(200,{'Content-Type': 'text/xml'});
  console.log(req.body);
  var content;

  if (req.body.Body === "Hello"){
    content = "Welcome to community text!! What's one thing that you grateful today?";
  } else {
    content = "Awesome! Here's another person gratitude: ...";
  }

  //create a User with their phone number in the database
  // var newUser = new User({
  //   phoneNumber: req.body.From
  // })
  // 
  // console.log("before save");
  //
  // newUser.save(function(err) {
  //   if (err) {
  //     console.log("error saving user");
  //   }
  // })

  console.log("after save");

  client.messages.create({
    to: req.body.From,
    from: '+14245238634',
    body: content,
  })
  res.end();
})

//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
