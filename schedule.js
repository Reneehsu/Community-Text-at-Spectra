var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
console.log('schedule');

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


Community.find(function(err,community){
  if (err){
    console.log(err);
  } else {
    for (var i=0; i<community.length; i++){
      for (var j=0; j<community[i].users.length; j++){
        client.messages.create({
          to: community[i].users[j],
          from: '+14245238634',
          body: community[i].question,
        });
      }
    }
  }
})


// client.messages.create({
//   to: '+13109233881',
//   from: '+14245238634',
//   body: "please work",
// });
