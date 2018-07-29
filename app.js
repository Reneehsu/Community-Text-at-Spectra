//require necessary modules
//test////
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var cronJob = require('cron').CronJob;

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
var Community = models.Community;

//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// var communityArr = ["Gratitude","Health/Fitness","Education","Empowerment"];
// var questionArr = [ "What is one thing you are grateful for that happened today?",
// "What is one healthy choice you made today","What is one thing you learned today?",
// "What is one thing you are proud of today?"]

// var responses = ["My family", "I made my 10,000 step count!", "All about iOS", "Completing my first hackathon"]
//
// for (var i=0; i<communityArr.length; i++){
//   var newCommunity = new Community({
//     name: communityArr[i],
//     number: i+1,
//     question: questionArr[i]
//     responses: {user: "Anony"}
//   });
//   newCommunity.save(function(err){
//     if (err) console.log('Error saving community');
//   })
// }

var textJob = new cronJob('* * * * *',function*(){
  var date = new Date();
  console.log('cronJob ' + date);
  client.messages.create( { to:'+13109233881', from:'+14245238634', body:'Hello! Hope you’re having a good day.'}, function( err, data ) {
    console.log( data.body );
  });
})

/*Community.findOne({question: ---}, function(err, theCommunity) {
  theCommunity.responses.push({
    user:
  })
})*/

//ROUTES GO HERE
app.get('/', function(req, res) {
  res.send("GOT /");
})

app.post('/handletext',function(req,res){
  res.writeHead(200,{'Content-Type': 'text/xml'});
//  console.log(req.body);
  var content;
  User.findOne({phoneNumber:req.body.From}, function(err, theUser){
    if (theUser){
      if (req.body.Body.substr(0, 4) === 'JOIN'){
        console.log("body " + req.body.Body);
        var comm = req.body.Body.substr(5).split(' ');
        console.log(comm);
        theUser.community = theUser.community.concat(comm);
        content = "You just joined communities " + req.body.Body.substr(5);
        var communityString = '';
        for (var i = 0; i < comm.length; i++) {
          var num = parseInt(comm[i]);
          Community.findOne({number: num}, function(err, theCommunity) {
            if (err){
              console.log(err);
            }
          //  console.log("the community is " + theCommunity);
            theCommunity.users.push(theUser._id);
            // communityString += theCommunity.name;
            // console.log("the community name is " + theCommunity.name);
            theCommunity.save(function(err) {
              if (err) {
                console.log(err);
              }
            })
          });
          content += " ";
        }

        theUser.save(function(err) {
          if (err) {
            console.log(err);
          }
        });

        client.messages.create({
          to: req.body.From,
          from: '+14245238634',
          body: content,
        });
      }
    } else {
      content = "Welcome to community text!! These are the communities you can join: 1. Gratitude 2. Health/Fitness 3. Education 4. Empowerment -- Reply with 'JOIN' plus the number(s) of the communities you want to join.";
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
  res.end();
});

app.get('/community',function(req, res){
  Community.find(function(err,communities){
    if (err){
      res.send(err);
    } else {
      res.json(communities);
    }
  })
})

//add a route that will respond to post requests sent by Twilio via
//webhooks

//start up our server
var port = process.env.PORT || 3000

app.listen(port)
