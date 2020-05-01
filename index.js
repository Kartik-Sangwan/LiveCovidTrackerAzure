const express = require("express");
const Datastore = require("nedb");
const app = express();
var port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening at port: ", port));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.post("/api", (request, response) => {
  console.log("I GOT A REQUEST");
  const data = request.body;
  console.log(data);
  data.timeStamp = new Date();

  database.update({ username: request.body.username }, data, {}, function (
    err,
    numReplaced
  ) {
    // numReplaced = 1
    console.log(numReplaced);
    if (numReplaced == 0) {
      database.insert(data);
    }
  });
  // Create a json object and update it.

  // To manually persist the database and compress the redundant ids.
  //database.persistence.compactDatafile();

  response.json({
    status: "Success",
    timeStamp: data.timeStamp,
    lat: request.body.lat,
    lgn: request.body.lng,
  });
});

app.get("/data", (request, response) => {
  // To manually persist the database and compress the redundant ids.
  //database.persistence.compactDatafile();
  // Query all the data
  database.find({}, (err, data) => {
    // Sending the data
    const newData = new Array();
    for (each of data) {
      newData.push({ lat: each.latitude, lng: each.longitude });
    }

    response.json(newData);
  });
  // data contains the full database we have till now.
});
