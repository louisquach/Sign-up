const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// response when received request to local host
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// response when received post request
app.post("/", function(req, res) {

// assign value users post into constant
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
// use the constant to create a data object (mailchimp requires)
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }]
  };
// transform the data object into JSON format (mailchimp require)
  const jsData = JSON.stringify(data);
  // create url to send POST request to mailchimp
  const url = "https://us18.api.mailchimp.com/3.0/lists/7e0474dff5";
  // create options object HTTPS.REQUEST structure require when do POST request
  const options = {
    // method and auth is required
    method: "POST",
    auth: "louisquach:e61d9fcb7f55bfb94afb1684612aa7e7-us18"
  };
// create a request constant
  const requestData = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });
// sent and end request
  requestData.write(jsData);
  requestData.end();
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Listenning to port 3000...");
});

// API key e61d9fcb7f55bfb94afb1684612aa7e7-us18
// client key 7e0474dff5
