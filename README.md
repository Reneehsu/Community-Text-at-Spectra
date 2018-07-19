# Inline Exercise: Twilio Webhooks

The goal of this exercise is to use Twilio webhooks to receive text messages.
When a message is received we will send an automated reply based on the following rules:
  1. "Over the horizons" if the text message you sent was "Nihar" 
  1. or "I don't understand" otherwise

## Step 1: Setup
- cd to the `week04/day4/examples/webhooks` directory
- run `git init` to initialize webhooks_examples as a git repository
- run `npm init` to initialize webhooks_examples as a npm project
- using npm and with the `--save` flag, install `express`, `express-handlebars`, `mongoose`, `twilio`, and `body-parser`
- add a `MONGODB_URI` to the given `env.sh`
- source `env.sh`
- turn this git repo into a heroku project by running `heroku create` (you should then be given some url for your project)
- set up `MONGODB_URI` as a heroku environment variable by running `heroku config:set MONGODB_URI=YOUR_URI_HERE`
- add the following lines to your `.gitignore` file: 

    ```
    node_modules
    DS_Store
    env.sh
    ```

- run `git add .` to add all files to be staged to commit
- run `git commit -m "SOME_COMMIT_MESSAGE"` to commit your files
- run `git push heroku master` to push our project up to heroku

## Step 2: Fill out stubbed files
Whenever a text message is sent to our twilio number, we want Twilio to send a post request to some route that we get to define.
- define a handler for post requests sent to a `/handletext` route in `app.js` under `ROUTES GO HERE`
- this handler should 
  - log the contents of `req.body` to the console *Note that Twilio sends message data in the body of the request it sends to you via webhook*
  - send a response back to twilio with a 200 status code - **don't forget this**
  
## Step 3: Configure a Twilio messaging service
- Head over to `https://www.twilio.com/login` and login
- Once logged in, go to `https://www.twilio.com/console/sms/dashboard` - this is the dashboard for all of your programmable sms applications
- In the left sidebar, click 'Messaging Services'
- Add a new messaging service with whatever name you desire and `mixed` for the `Use Case` field (you'll know what I'm talking about when you click on the button to create a new messaging service)
- When you are redirected to a Configure page, make sure to check the box that says `Process Inbound Messages`
  ![Inbount Messages](https://snag.gy/IgYP0F.jpg)
- Make sure to add your route (that you defined earlier in app.js that accepts Twilio requests) in the field titled `Request URL` (otherwise Twilio has no way to send your application requests)
  - *Note that your route should be prepended by the heroku domain given to you by heroku and not `localhost:3000`*
- Save your configuration settings
- Add your twilio number under the `Number` tab

## Step 4: CHECKPOINT! WOOHOO!
- in your console and still under the webhooks_examples directory, run `heroku logs --tail` (you should see a list of server processes)
- text anything to your Twilio phone number. You should see your message logged to the console

## Step 5: Send a text back
- in your `env.sh` file, export two more variables `TWILIO_SID` and `TWILIO_AUTH_TOKEN`, which should have the values of your SID and Auth Token (which can be found at `https://www.twilio.com/console` once you've logged in to twilio)
- source your `env.sh` file
- in your heroku configuration, add two more variables `TWILIO_SID` and `TWILIO_AUTH_TOKEN`, which should have the values of your SID and Auth Token
- add `var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)` in `app.js` where all the node modules are required
  - *Note: You can find examples and detailed documentation about the Twilio REST API at https://www.twilio.com/docs/api/rest/sending-messages*
- using the following code, edit your Twilio webhook handler route to send messages back to the original texter 

    ```
      client.messages.create({ 
        to: "SENDER_NUMBER", 
        from: "MY_TWILIO_NUMBER", 
        body: "THIS_PART_IS_UP_TO_YOU", 
      })
    ```

 ## Step 6: FINAL CHECKPOINT
 At the step you should have been able to achieve the original goal of this exercise (at the top of this README)
