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

var communityArr = ["Gratitude","Health/Fitness","Education","Empowerment"];
for (var i=0; i<communityArr.length; i++){
  var newCommunity = new Community({
    name: communityArr[i],
    number: i+1
  });
  newCommunity.save(function(err){
    if (err) console.log('Error saving community');
  })
}

//ROUTES GO HERE
app.post('/handletext',function(req,res){
  res.writeHead(200,{'Content-Type': 'text/xml'});
//  console.log(req.body);
  var content;
  User.findOne({phoneNumber:req.body.From}, function(err, theUser){
    if (theUser){
      if (req.body.Body.substr(0, 4) === 'JOIN'){
        var comm = req.body.Body.substr(4).split(' ');
        theUser.community = theUser.community.concat(comm);
        content = "You just joined communities " ;
        for (var i = 0; i < comm.length; i++) {
          Community.findOne({number: comm[i+1]}, function(err, theCommunity) {
            theCommunity.users.concat(theUser);
            content += comm[i].name;
          });
          content += " ";
        }

        client.messages.create({
          to: req.body.From,
          from: '+14245238634',
          body: content,
        });
      }
    } else {
      content = "Welcome to community text!! These are the communities you can join:...Reply with 'JOIN' plus the number(s) of the communities you want to join.";
      client.messages.create({
        to: req.body.From,
        from: '+14245238634',
        body: content,
      });
      var newUser = new User({
        phoneNumber: req.body.From,
        zipCode: req.body.FromZip
      });
      newUser.save(function(err) {
        if (err) {
          console.log("Error saving user");
        }
      });
    }
  });

  console.log("after find one");

  //initial text to our app
  // if (req.body.Body === "Hello"){
  //   content = "Welcome to community text!! What's one thing that you grateful today?";
  // } else {
  //   content = "Awesome! Here's another person gratitude: ...";
  // }
  //
  // //create a User with their phone number in the database
  // var newUser = new User({
  //   phoneNumber: req.body.From
  // });
  //
  // newUser.save(function(err) {
  //   if (err) {
  //     console.log("Error saving user");
  //   }
  // });

  //our response to the user
  // client.messages.create({
  //   to: req.body.From,
  //   from: '+14245238634',
  //   body: content,
  // });
  console.log('after create');
  res.end();
})

//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
