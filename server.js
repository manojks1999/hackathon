(function () {
  const fs = require("fs"),
    express = require("express"),
    helmet = require("helmet");
    const path = require('path')

  app = express();
  app.use(helmet()); // Add Helmet as a middleware
  app.use(express.static(path.resolve(__dirname, 'client')))
  // const options = {
  //       key: fs.readFileSync("/etc/letsencrypt/live/api.evivve.com/privkey.pem"),
  //       cert: fs.readFileSync("/etc/letsencrypt/live/api.evivve.com/fullchain.pem"),
  // };

  let options = {};
  if (process.env.NODE_ENV === "production") {
    options = {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/production.evivve.com/privkey.pem",
        "utf8"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/production.evivve.com/fullchain.pem",
        "utf8"
      ),
    };
  } else if (process.env.NODE_ENV === "staging") {
    options = {
      // key: fs.readFileSync(
      //   "/etc/letsencrypt/live/staging.evivve.com/privkey.pem",
      //   "utf8"
      // ),
      // cert: fs.readFileSync(
      //   "/etc/letsencrypt/live/staging.evivve.com/fullchain.pem",
      //   "utf8"
      // ),
    };
  }

  app.get("/status", function (req, res, next) {
    res.send("Deploy version:1.0");
  });

  var https = require("http").createServer(options, app);
  // var https = require('https').Server(options,app);
  // var http = require('http').Server(app);
  var io = require("socket.io")(https, {
    pingTimeout: 3000,
    pingInterval: 3000,
  });
  var port = process.argv[2] || 3002;
  var Promise = require("bluebird");
  var moment = require("moment");
  var Validator = require("validatorjs");
  var _ = require("underscore");

  app.get("/", function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
  });

  app.get("/events_view", function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client', 'event.html'));
  });

  app.get("/restart", function (req, res, next) {
    process.exit(1);
  });

  app.get("/health", function (req, res, next) {
    res.send("Deploy version:1.0");
  });

  app.get("/db_data", function (req, res, next) {
    try {
      let query = `select * from events_logs order by created_at desc limit 365`;
      let params = [];
      objectModules.Query.executeQueryWithPromise(query, params)
        .then(function (object) {
          let data = object["results"];
          console.log("datadatadata", data)
          return data;
        }).then((data) => {
          let arr = data.map((ele) => {
              ele['data'] = JSON.stringify(ele['data'])
              return ele
          })
          res.json(arr)
        })
    } catch(e) {
      console.log("Errorinresponse", e.message)
    }
  });

  // http.listen(port, function () {
  //     console.log('listening on : ' + port);
  // });

  https.listen(port, () => {
    console.log(`Server is running on port : ${port}`); // eslint-disable-line no-console
  });

  var mysql = require("mysql2");
  var host;
  if (process.env.NODE_ENV === "staging") {
    host = JSON.parse(fs.readFileSync("./config/_data_base_.json", "utf8"));
  } else if (process.env.NODE_ENV === "production") {
    host = JSON.parse(fs.readFileSync("./config/prod_database.json", "utf8"));
  }
  var connection;

  function handleDisconnect() {
    connection = mysql.createConnection(host); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) {
      // The server is either down
      if (err) {
        console.log("error in connecting", err)
        // or restarting (takes a while sometimes).
        // console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }
      callMiddleWares(); // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on("error", function (err) {
      console.log("error in connecting", err)
      // console.log('db error', err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        // Connection to the MySQL server is usually
        handleDisconnect(); // lost due to either server restart, or a
      } else {
        // connnection idle timeout (the wait_timeout
        throw err; // server va riable configures this)
      }
    });
  }

  handleDisconnect();

  function callMiddleWares() {
    var mySql = require("./middleware/query")(connection, Promise);
    objectModules["Query"] = mySql;
    var socket = require("./Controllers/Socket")(objectModules);
  }

  var objectModules = {
    io: io,
    Promise: Promise,
    fs: fs,
    moment: moment,
    _: _,
  };

  process.on("uncaughtException", function (err) {
    console.log(err);
  });

  app.use(function (err, req, res, next) {
    var error = {
      code: 0,
      message: "something went wrong",
      data: {
        error: err,
        input_params: JSON.stringify(req.body),
      },
    };
    res.send(error);
  });
})();
