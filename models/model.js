var mongoose = require('mongoose');

console.log(process.env.MONGODB_URI);

if (!process.env.MONGODB_URI){
  console.log('Error: MONGODB_URI NOT SET');
  process.exit(1);
}

var userSchema = {
  phoneNumber: {
    type: String,
    required: true
  },
  community: {
    type: Array,
  },
  zipCode: {
    type: String
  },
  responses: {
    type: Array
  }
}

var communitySchema = {
  name: {
    type: String
  },
  number: {
    type: Number
  },
  users: {
    type: Array
  },
  question: {
    type: String
  }
  responses: { // {user: "user", response: "response"}
    type: Array
  }
}

//gratitude, health/fitness, cs, fluffies, memes, self-esteem booster

var User = mongoose.model("User", userSchema);
var Community = mongoose.model("Community", communitySchema);

module.exports = {
  User: User,
  Message: Message,
  Community: Community
}
