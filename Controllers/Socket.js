(function () {
  "use strict";
  module.exports = function (mods) {
    var ids = {};
    var users = [];
    var admin = null;
    var presentation = null;
    var devices = {};
    var room = null;
    var tilesID = [];
    var turns = [];
    var currentTurn = 0;
    var daysPerOffer = 10;
    var daysPerOfferRejection = 3;
    var totalCalamities = 0;
    var secPerDay = 5;
    var days = 0;
    var mov = 3000;
    var thatSocket;
    var offerArray = [];
    var acceptedOffers = [];
    var CROBCredits = 0;
    var CROBCreditsUser = [];
    var CROBMv = 0;
    var offerIndex = 0;
    var acceptedOfferIndex = 0;
    var CROBMvUser = [];
    var bountyHunter = {};
    var calamitiesArray = [];
    var tileLayOut = [];
    var gameStarted = false;
    var totalDelivery = 0;
    var totalAccepted = 0;
    var allHarvest = [];
    var deviceById = {};
    var reconnect = false;
    var resumedDays = 0;
    var calTotalDays = 0;
    var pulluserparam = null;
    var midgamedevices = {};
    var prevDevicesLength = 0;
    // establishing connection with the devicces
    mods.io.on("connection", function (socket) {
      thatSocket = socket;
      socket.emit("connected", {
        id: socket.id,
      });
      console.log("socket:");
      console.log("emit connected");
      //socketMethods.sendRoomData();

      socket.on("set-required-params", function(data) {
        socketMethods.round_name = data.round_name
        console.log("socketMethods.round_name", socketMethods.round_name)
      })
      socket.on("server-get-user-type", socketMethods.getUsers); // defines type of the user

      socket.on("node-interaction", function(data) {
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [socket.id, 'node_interaction', JSON.stringify({daysLeft: socketMethods.remainingDays, cost: data.price, land: data.harvestName}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
      })

      socket.on("resource-generated", function(data) {
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [socket.id, 'resource_generation', JSON.stringify({daysLeft: socketMethods.remainingDays, expiration: data.expiration, resource: data.harvestName}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
      })


      
      socket.on(
        "server-create-game",
        function (
          data // creates server room
        ) {
          console.log("socketMethodssocketMethods", socketMethods.user_id)
          socketMethods.user_id = 989898
          console.log("socket:");
          console.log("on server-create-game");
          console.log(data);
          socketMethods.emitData("refresh-shared-page", {}, "all");
          console.log("socket:");
          console.log("emit refresh-shared-page");
          room = data["game-name"].trim();
          socket.join(room);
          socketMethods.sendRoomData();
          var parameters = {};
          socketMethods.emitData("connect1", {}, "all");
        }
      );

      socket.on("server-get-user-type", socketMethods.getUsers); // defines type of the user

      socket.on(
        "server-create-game",
        function (
          data // creates server room
        ) {
          console.log("socket:");
          console.log("on server-create-game");
          console.log(data);
          socketMethods.emitData("refresh-shared-page", {}, "all");
          console.log("socket:");
          console.log("emit refresh-shared-page");
          room = data["game-name"].trim();
          socket.join(room);
          socketMethods.sendRoomData();

        }
      );

      socket.on(
        "server-join-devices",
        function (
          data // create room for devices
        ) {
          console.log("socket:");
          console.log(" on server-join-devices");
          console.log(data);
          socket.join(room);
          socket.join("devices");
          console.log(room);

          for (var d in devices) {
            if (devices[d]["id"] == null) {
              midgamedevices.d = devices[d];
              console.log("midgamedevices", midgamedevices.d);
              //console.log(midgamedevices);
            }
          }

          socketMethods.emitData(
            "alert-new-user",
            { midgamedevices, devices },
            "all"
          );
        }
      );

      socket.on("server-resume-startGameTimer", function (param) {
        // console.log("socket:");
        // console.log(" on server-resume-startGameTimer");
        // console.log(param);
        if (typeof param.days === "undefined") {
          return;
        }
        resumedDays = param.days;
        presentation = param.id;
        reconnect = true;
        socketMethods.calamityFlag = false;
        console.log("reconnect variable false");
        console.log(
          "clear interval of gameInterval, calamityTimeOut, offerTimeOut, commenceGameInterval"
        );
        clearInterval(socketMethods.gameInterval);
        clearInterval(socketMethods.calamityTimeOut);

        clearTimeout(socketMethods.offerTimeOut);
        clearTimeout(socketMethods.commenceGameInterval);
        socketMethods.pauseGame();
        console.log("call function pauseGame");

        setTimeout(() => {
          socketMethods.calamityFlag = false;
          socketMethods.startGameTimer();
          socketMethods.strikeCalamity();
          socketMethods.resendOffer();
          console.log("start resendOffer, strikeCalamity, startGameTimer");
        }, 50);
      });

      socket.on("server-resume-device", function () {
        console.log("socket :");
        console.log("on server-resume-devices");
        reconnect = true;
        socketMethods.calamityFlag = false;

        console.log("reconnect variable false");

        clearInterval(socketMethods.gameInterval);
        clearInterval(socketMethods.calamityTimeOut);

        clearTimeout(socketMethods.offerTimeOut);
        clearTimeout(socketMethods.commenceGameInterval);
        socketMethods.pauseGame();

        console.log(
          "clear interval of gameInterval, calamityTimeOut, offerTimeOut, commenceGameInterval"
        );

        setTimeout(() => {
          socketMethods.calamityFlag = false;
          socketMethods.startGameTimer();
          socketMethods.strikeCalamity();
          socketMethods.resendOffer();
          console.log("start resendOffer, strikeCalamity, startGameTimer");
        }, 10);
      });
      // when device disconnect
      socket.on("disconnect", function () {
        console.log("socket :");
        console.log("on disconnect");
        console.log(socket.id);
        console.log(deviceById[socket.id]);
        console.log("");
        for (var d in devices) {
          if (devices[d]["id"] == socket.id) {
            devices[d]["id"] = "";
          }
        }
        var params = {
          users: devices,
        };
        reconnect = true;
        console.log("reconnect varaible true");
        // clearInterval(socketMethods.gameInterval);
        // clearInterval(socketMethods.calamityTimeOut);

        // clearTimeout(socketMethods.offerTimeOut);
        // clearTimeout(socketMethods.commenceGameInterval);
        // socketMethods.pauseGame();

        socketMethods.emitData("updated-users", params, "devices");
        console.log("socket: emit updated-users");
      });

      // starting the game
      socket.on("start-the-game", socketMethods.startGame);
      socket.on("refresh-page", function () {
        console.log("socket:");
        console.log("on refresh-page");
        ids = {};
        admin = null;
        presentation = null;
        devices = {};
        room = null;
        tilesID = [];
        turns = [];
        daysPerOffer = 10;
        currentTurn = 0;
        daysPerOfferRejection = 3;
        totalCalamities = 0;
        secPerDay = 5;
        days = 0;
        mov = 3000;
        thatSocket;
        offerArray = [];
        acceptedOffers = [];
        CROBCredits = 0;
        CROBCreditsUser = [];
        CROBMv = 0;
        offerIndex = 0;
        acceptedOfferIndex = 0;
        CROBMvUser = [];
        bountyHunter = {};
        calamitiesArray = [];
        tileLayOut = [];
        gameStarted = false;
        totalDelivery = 0;
        totalAccepted = 0;
        allHarvest = [];
        deviceById = {};
        console.log("Refresh The Game");
        socket.broadcast.emit("refresh-page-all", {});
        console.log("socket:");
        console.log("broadcast refresh-pages-all");

        setTimeout(function () {
          process.exit(1);
        }, 2000);
      });
      socket.on("buy-tile", function (data) {
        console.log("socketid", socket.id)
        console.log("socket:");
        console.log("on buy-title");
        console.log(data);
        if (
          isNaN(data.tile_id) ||
          tilesID.find((el) => el.tile_id === data.tile_id)
        ) {
          console.log("already purchased tile");
          return;
        }
        
        socket.broadcast.to("devices").emit("tiles-bought", data);
        socketMethods.buyTile({...data, user_id: socket.id});
        tilesID.push(data);
      });
      socket.on("server-disable-add-button", function (data) {
        console.log("socket:");
        console.log("on server-disable-add-button");
        console.log(data);
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [socket.id, 'land_screen_access', JSON.stringify({daysLeft: socketMethods.remainingDays, accessScreen: 1}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
        socket.broadcast.to("devices").emit("disable-add-button", data);
      });
      socket.on("server-enable-add-button", function (data) {
        console.log("socket:");
        console.log("on server-enable-add-button");
        console.log(data);

        socket.broadcast.to("devices").emit("enable-add-button", data);
      });
      socket.on("skip-buying", function (data) {
        console.log("socket:");
        console.log("on skip-buying");
        console.log(data);

        socketMethods.skipBuying(data);
        socketMethods.emitData("skip-called", data, "devices");
      });
      socket.on("get-round-setup", async function (data) {
        var parameters = {};

        var query = `select * from ev_setup, ev_calamity where user_id = ? and round_name = ?`;
        // var query1 = `select * from ev_calamity where user_id = ? and round_name = ?`;

        var params = [data.user_id, data.round_name];

        // console.log("before current-round-setup");

        // var quyerResp = await mods.Query.executeQueryWithPromise(query, params);

        // console.log("quyerResp", quyerResp);

        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            parameters["setup"] = object["results"][0];

            // daysPerOffer = object["results"][0]["offers"];
            // daysPerOfferRejection = object["results"][0]["offers_rejection"];
            // secPerDay = object["results"][0]["sec_days"];
            // days = object["results"][0]["days"];
            // resumedDays = object["results"][0]["days"];
            // mov = object["results"][0]["mov"];

            return parameters;
          })
          .then(function (parameters) {
            console.log("parameters in get-round-setup");
            console.log(parameters);
            socketMethods.emitData("current-round-setup", parameters, "all");
            console.log("after in then");
          });

        // socketMethods.emitData("current-round-setup", parameters, "all");
        console.log("after current-round-setup");
      });
      // new socket 1
      socket.on("player-status", function (data) {
        var parameters = {
          data,
        };
        socketMethods.emitData(
          "handle-player-status",
          parameters,
          "devices",
          presentation
        );
        socketMethods.emitData(
          "handle-player-status",
          parameters,
          "user",
          admin
        );
      });
      // new socket2
      socket.on("before-game-start", function (data) {
        console.log("socket:");
        console.log("on server-commence-game");
        console.log(data);
        // socketMethods.startGame(data);
        // gameStarted = true;
        // console.log("start game");
        // var round = data['round'];
        var query = `select * from ev_setup where user_id = ? and round_name = ?`;
        var params = [data.id, data.round_name];
        // var params = [id];
        var parameters = {
          users: devices,
        };
        // retrieve data from database and distribute it to all devices
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            parameters["setup"] = object["results"][0];

            daysPerOffer = object["results"][0]["offers"];
            daysPerOfferRejection = object["results"][0]["offers_rejection"];
            secPerDay = object["results"][0]["sec_days"];
            days = object["results"][0]["days"];
            resumedDays = object["results"][0]["days"];
            mov = object["results"][0]["mov"];
            console.log("days from server : " + days);
            //socketMethods.emitData("initialize-data", parameters, "devices");
            for (var d in devices) {
              turns.push(devices[d]);
            }
            return parameters;
          })
          .then(function (parameters) {
            var query = `select * from ev_calamity where user_id = ? and round_name = ?`;
            var params = [data.id, data.round_name];
            // var param = [id];
            mods.Query.executeQueryWithPromise(query, params).then(function (
              object
            ) {
              parameters["calamities"] = object["results"];
              totalCalamities = JSON.parse(
                object["results"][0]["no_calamities"]
              );
              var calamities = [];
              var calamitiesLevel = [];
              try {
                calamities = JSON.parse(object["results"][0]["calamities"]);
                calamitiesLevel = JSON.parse(
                  object["results"][0]["calamities_lvl"]
                );
              } catch (error) {
                calamities = object["results"][0]["calamities"].split(",");
                calamitiesLevel =
                  object["results"][0]["calamities_lvl"].split(",");
                console.log(error, calamitiesLevel, calamitiesLevel);
              }
              // for (var i = 0; i < calamities.length; i++) {
              //   calamitiesArray.push({
              //     calamity: calamities[i],
              //     level: calamitiesLevel[i],
              //     eradicate: 0,
              //   });
              // }

              calTotalDays =
                Math.round(days / (totalCalamities + 1)) * secPerDay;
              //var calTotalDays = 20;
              console.log("calTotalDays");
              console.log(calTotalDays);

              // console.log(calamitiesArray);
              parameters["setup"]["exhaust"] =
                object["results"][0]["days_check"];
              parameters["setup"]["exhaust_land"] =
                object["results"][0]["exhaust_land"];

              socketMethods.emitData(
                "demo-data",
                parameters,
                "user",
                presentation
              );
              socketMethods.emitData("demo-data", parameters, "user", admin);
              // pulluserparam = parameters;
              // socket.broadcast.emit("commence-game", parameters, "all");
              // socketMethods.commenceGame(data);
            });
          });
      });

      socket.on("server-commence-game", function (data) {
        data.socket_user_id = socket.id
        console.log("socket:");
        console.log("on server-commence-game");
        console.log(data);
        // socketMethods.startGame(data);
        gameStarted = true;
        // assigning round_name global to  function
        console.log('dfsfs', data)
        socketMethods.round_name = data.round_name
        console.log("start game");
        // var round = data['round'];
        var query = `select * from ev_setup where user_id = ? and round_name = ?`;
        var params = [data.user_id, data.round_name];
        // var params = [id];
        var parameters = {
          users: devices,
        };
        // retrieve data from database and distribute it to all devices
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            parameters["setup"] = object["results"][0];

            daysPerOffer = object["results"][0]["offers"];
            daysPerOfferRejection = object["results"][0]["offers_rejection"];
            secPerDay = object["results"][0]["sec_days"];
            days = object["results"][0]["days"];
            resumedDays = object["results"][0]["days"];
            mov = object["results"][0]["mov"];
            console.log("days from server : " + days);
            //socketMethods.emitData("initialize-data", parameters, "devices");
            for (var d in devices) {
              turns.push(devices[d]);
            }
            return parameters;
          })
          .then(function (parameters) {
            var query = `select * from ev_calamity where user_id = ? and round_name = ?`;
            var params = [data.user_id, data.round_name];
            // var param = [id];
            mods.Query.executeQueryWithPromise(query, params).then(function (
              object
            ) {
              parameters["calamities"] = object["results"];
              totalCalamities = JSON.parse(
                object["results"][0]["no_calamities"]
              );
              var calamities = [];
              var calamitiesLevel = [];
              try {
                calamities = JSON.parse(object["results"][0]["calamities"]);
                calamitiesLevel = JSON.parse(
                  object["results"][0]["calamities_lvl"]
                );
              } catch (error) {
                calamities = object["results"][0]["calamities"].split(",");
                calamitiesLevel =
                  object["results"][0]["calamities_lvl"].split(",");
                console.log(error, calamitiesLevel, calamitiesLevel);
              }
              for (var i = 0; i < calamities.length; i++) {
                calamitiesArray.push({
                  calamity: calamities[i],
                  level: calamitiesLevel[i],
                  eradicate: 0,
                });
              }

              calTotalDays =
                Math.round(days / (totalCalamities + 1)) * secPerDay;
              //var calTotalDays = 20;
              console.log("calTotalDays");
              console.log(calTotalDays);

              // console.log(calamitiesArray);
              parameters["setup"]["exhaust"] =
                object["results"][0]["days_check"];
              parameters["setup"]["exhaust_land"] =
                object["results"][0]["exhaust_land"];
              // socketMethods.setTurns();
              // socketMethods.emitData("initialize-data", parameters, "devices");
              // socketMethods.emitData(
              //   "initialize-data",
              //   parameters,
              //   "user",
              //   presentation
              // );
              // socketMethods.emitData(
              //   "initialize-data",
              //   parameters,
              //   "user",
              //   admin
              // );
              socketMethods.emitData(
                "initialize-data",
                parameters,
                "user",
                presentation
              );
              socketMethods.emitData(
                "initialize-data",
                parameters,
                "user",
                admin
              );
              pulluserparam = parameters;
              socket.broadcast.emit("commence-game", parameters, "all");
              socketMethods.commenceGame(data);
            });
          });
      });
      //new socket2
      socket.on("server-start-game", function () {
        socket.join(room);
        socket.join("devices");

        var parameters = {
          users: devices,
        };
        socketMethods.emitData("games-data", parameters, "user", presentation);
        socketMethods.emitData("games-data", parameters, "user", admin);
      });

      //hide calamity video
      socket.on("hide-calamity-video", function () {
        socket.broadcast.emit("remove-calam-vid", {}, "all");
      });

      // socket.on("new-user-notify", function () {
      //   for (var d in devices) {
      //     if (devices[d]["id"] == null) {
      //       midgamedevices.d = devices[d];
      //       console.log("midgamedevices", midgamedevices.d);
      //       //console.log(midgamedevices);
      //     }
      //     console.log("show-waiting-playersmidgamedevices", midgamedevices);
      //   }

      //   socketMethods.emitData(
      //     "alert-new-user",
      //     { midgamedevices, devices },
      //     "all"
      //   );
      // });

      //show waiting room players
      socket.on("show-waiting-players", function () {
        for (var d in devices) {
          if (devices[d]["id"] == null) {
            midgamedevices.d = devices[d];
            console.log("midgamedevices", midgamedevices.d);
            //console.log(midgamedevices);
          }
          console.log("show-waiting-playersmidgamedevices", midgamedevices);
        }
        socketMethods.emitData(
          "waiting-players",
          { midgamedevices, devices },
          "all"
        );
      });

      //pull user in the middle of the game
      socket.on("add-user-midgame", function () {
        console.log("add-user-midgame" + devices);
        for (var d in devices) {
          if (devices[d]["id"] == null) {
            midgamedevices.d = devices[d];
            console.log("midgamedevices");
            //console.log(midgamedevices);
          }
        }
        pulluserparam["users"] = midgamedevices;
        console.log(pulluserparam.users);
        console.log("pull user param");
        console.log(pulluserparam);
        socket.broadcast.emit("commence-midgame", pulluserparam);
        console.log("commence-midgame");
      });

      socket.on("server-vr-game", function (data) {
        console.log("socket:");
        console.log("on server-vr-game");
        console.log(data);

        socket.broadcast.emit("play-vr", {}, "all");
      });
      // offer accepted by user and checking whether offer is accepted or not
      socket.on("offer-accepted", function acceptOffer(data) {
        console.log("socket");
        console.log("offer-accepted");
        console.log(data, offerArray);
        if(offerArray.length === 0) {
          var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
          var params = [socket.id, 'offer_accepted', JSON.stringify({offer: "Still not offer generated yet"}), socketMethods.round_name];
          mods.Query.executeQueryWithPromise(query, params)
            .then(function (object) {
              console.log("succccc")
              return;
            }).catch(function(error) {
              console.log("erroro", error)
            })
            return
        }
        data = {...data, ...offerArray[0]}
        if (offerArray[data["index"]]["status"] != "accepted") {
          offerArray[data["index"]]["status"] = "accepted";

          offerArray[data["index"]]["user_id"] = data["id"];
          offerArray[data["index"]]["user_name"] = data["name"];
          var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
          var params = [socket.id, 'offer_accepted', JSON.stringify({daysLeft: socketMethods.remainingDays, resource: data.harvest, quantity: data.quantity, reward: data.credits}), socketMethods.round_name];
          mods.Query.executeQueryWithPromise(query, params)
            .then(function (object) {
              console.log("succccc")
              return;
            }).catch(function(error) {
              console.log("erroro", error)
            })
          socketMethods.emitData(
            "offer-accepted-ack",
            data,
            "user",
            data["id"]
          );
          totalAccepted++;
          socketMethods.tribeValue();
        }
        //socketMethods.startOfferTime(data['index']);
        var params = {
          index: data["index"],
        };

        socket.broadcast.to("devices").emit("offer-closed", params);
        if (socketMethods.calamityFlag == false) {
          socketMethods.resendOffer();
        }
      });

      // all the ons
      socket.on("execute-method", socketMethods.executeMethod);
      socket.on("trade-good-with-friends", function(data) {
        data.socket_user_id = socket.id
        socketMethods.tradeGoodsWithFriend(data)
      });
      socket.on("server-trade-accepted", function(data) {
        data.socket_user_id = socket.id
        socketMethods.acceptTrade(data)
      });
      socket.on("server-goods-expired", socketMethods.goodsExpired);
      socket.on("server-submit-credits", socketMethods.submitCreditsToCROB);
      socket.on("server-submit-mv", socketMethods.submitMvToCROB);
      socket.on("server-deliver-offer", function (data){
        console.log("data", data)
        socketMethods.deliverOffer({...data, user_id: socket.id})
      });
      socket.on("decline-offer", socketMethods.declineOffer);
      socket.on("generate-offer", socketMethods.generateOffer);
      socket.on("offer-timed-out", socketMethods.offerTimedOut);
      socket.on(
        "server-submit-mv-to-bounty-hunter",
        socketMethods.submitMVToBountyHunter
      );
      socket.on("server-skill-level-updated", socketMethods.skillLevelUpdated);
      socket.on("server-submit-harvest", function(data) {
        data.socket_user_id = socket.id
        socketMethods.submitHarvest(data)
      });
      socket.on("server-play-video", socketMethods.playVideo);
      socket.on("server-is-calamity-gone", socketMethods.isCalamityGone);
      socket.on(
        "server-resume-game-manually",
        socketMethods.resumeGameManually
      );
      socket.on("server-transfer-credits", socketMethods.transferCredits);
      socket.on("server-pause-game", socketMethods.pauseGameFromAdmin);
      socket.on("server-lose-video-type", socketMethods.loseVideoType);
      socket.on("server-badge-highlight", socketMethods.badgeHighlight);
    });

    var socketMethods = {
      getUsers: function (data) {
        console.log("socket: ");
        console.log("on server-get-user-type");
        console.log(data);
        console.log("reconnect : " + reconnect);
        let sucess = false;
        if (!reconnect) {
          console.log("!reconnect");

          // if admin connects then all the data resets
          if (data["type"] == "admin") {
            sucess = true;
            admin = null;
            presentation = null;
            devices = {};
            room = null;
            days = 365;
            resumedDays = 365;
            turns = [];
            admin = data["id"];
            currentTurn = 0;
            tilesID = [];
            offerArray = [];
            acceptedOffers = [];
            calamitiesArray = [];
            CROBCredits = 0;
            CROBMv = 0;
            offerIndex = 0;
            acceptedOfferIndex = 0;
            bountyHunter = {};
            gameStarted = false;
            daysPerOffer = 10;
            daysPerOfferRejection = 3;
            secPerDay = 5;
            totalCalamities = 0;
            totalDelivery = 0;
            totalAccepted = 0;
            allHarvest = [];
            deviceById = {};
            socketMethods.currentCalamityCount = 0;
            socketMethods.movPercentage = 0;
            tileLayOut = JSON.parse(
              mods.fs.readFileSync("./config/tile.json", "utf8")
            );
            socketMethods.currentProcess = 1;

            clearTimeout(socketMethods.offerTimeOut);
            clearTimeout(socketMethods.commenceGameInterval);
            clearTimeout(socketMethods.resumeGameTimeOut);
            clearInterval(socketMethods.bountyInterval);

            clearInterval(socketMethods.calamityTimeOut);
            clearInterval(socketMethods.gameInterval);
          }
        }

        console.log("getUsers data : ");
        console.log(data);

        // presentation screen
        if (data["type"] == "presentation") {
          sucess = true;
          presentation = data["id"];
          console.log("presentation:" + presentation);
        }

        // devices : reconnection logic and managing devices array
        if (data["type"] == "devices") {
          console.log("Devices");
          console.log(devices);

          if (
            gameStarted == true &&
            typeof devices[data["user-name"]] == "object"
          ) {
            // console.log("trying to connect again");
            devices[data["user-name"]]["id"] = data["id"];
            var params = {
              users: devices,
            };
            sucess = true;
            socketMethods.emitData("updated-users", params, "devices");
          }
          //Adding condition to handle adding users in midgame
          else if (
            gameStarted == true &&
            typeof devices[data["user-name"]] !== "object"
          ) {
            console.log("condition met");
            if (users.indexOf(data["user-name"].toLowerCase()) !== -1) {
              sucess = false;
              socketMethods.emitData("send-user-to-app", false, "devices");
            } else {
              sucess = true;
              var param = {
                id: data["id"],
                name: data["user-name"],
                "skill-level": 1,
              };
              users.push(data["user-name"].toLowerCase());
              devices[data["user-name"]] = param;
              bountyHunter[data["user-name"]] = 0;
              socketMethods.emitData("send-user-to-app", param, "devices");
              socketMethods.emitData(
                "send-user-to-presentation",
                param,
                "user",
                presentation
              );
            }
          } else if (gameStarted == false) {
            if (users.indexOf(data["user-name"].toLowerCase()) !== -1) {
              sucess = false;
              socketMethods.emitData("send-user-to-app", false, "devices");
            } else {
              sucess = true;
              var param = {
                id: data["id"],
                name: data["user-name"],
                "skill-level": 1,
              };
              users.push(data["user-name"].toLowerCase());
              devices[data["user-name"]] = param;
              bountyHunter[data["user-name"]] = 0;
              socketMethods.emitData("send-user-to-app", param, "devices");
              socketMethods.emitData(
                "send-user-to-presentation",
                param,
                "user",
                presentation
              );
            }
          }

          if (sucess === true) {
            deviceById[data["id"]] = data["user-name"];
          }
        }
      },
      // send the info about the tribe name
      sendRoomData: function () {
        var params = {
          "room-name": room,
        };
        socketMethods.emitData("get-rooms", params, "devices");
        setTimeout(function () {
          socketMethods.emitData("get-rooms", params, "user", presentation);
        }, 3000);
      },
      refreshPage: function () {
        // console.log("Refresh Page");
        socketMethods.emitData("refresh-page-all", {}, "all");
      },
      // common function to transmit data to the devices.
      emitData: function (key, object, type, id) {
        // emit data
        try {
          if (type == "all") {
            thatSocket.broadcast.emit(key, object);
          } else if (type == "devices") {
            var roster = mods.io.sockets.adapter.rooms["devices"];
            mods.io.sockets.in("devices").emit(key, object);
          } else if (type == "user") {
            if (mods.io.sockets.connected[id] !== undefined) {
              mods.io.sockets.connected[id].emit(key, object);
            }
          }
          // var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
          // var params = ['all', 'offer_open', JSON.stringify({daysLeft: socketMethods.remainingDays, resource: data.harvest, quantity: data.quantity, timeline: data.weeks, reward: data.credits}), socketMethods.round_name];
          // mods.Query.executeQueryWithPromise(query, params)
          //   .then(function (object) {
          //     console.log("succccc")
          //     return;
          //   }).catch(function(error) {
          //     console.log("erroro", error)
          //   })
        } catch (e) {
          console.warn("error at ", key);
          console.warn("error exception ", e);
          console.warn("error message ", e.messages);
          console.warn("error line ", e.lineNumber);
        }
      },
      // starting the game
      startGame: function (data) {
        gameStarted = true;
        console.log("start game");
        // var round = data['round'];
        var query = `select * from ev_setup where user_id = ? and round_name = ?`;
        var params = [data.user_id, data.round_name];
        // var params = [id];
        var parameters = {
          users: devices,
        };
        // retrieve data from database and distribute it to all devices
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            parameters["setup"] = object["results"][0];

            daysPerOffer = object["results"][0]["offers"];
            daysPerOfferRejection = object["results"][0]["offers_rejection"];
            secPerDay = object["results"][0]["sec_days"];
            days = object["results"][0]["days"];
            resumedDays = object["results"][0]["days"];
            mov = object["results"][0]["mov"];
            console.log("days from server : " + days);
            //socketMethods.emitData("initialize-data", parameters, "devices");
            for (var d in devices) {
              turns.push(devices[d]);
            }
            return parameters;
          })
          .then(function (parameters) {
            var query = `select * from ev_calamity where user_id = ? and round_name = ?`;
            var params = [data.user_id, data.round_name];
            // var param = [id];
            mods.Query.executeQueryWithPromise(query, params).then(function (
              object
            ) {
              totalCalamities = JSON.parse(
                object["results"][0]["no_calamities"]
              );
              var calamities = [];
              var calamitiesLevel = [];
              try {
                calamities = JSON.parse(object["results"][0]["calamities"]);
                calamitiesLevel = JSON.parse(
                  object["results"][0]["calamities_lvl"]
                );
              } catch (error) {
                calamities = object["results"][0]["calamities"].split(",");
                calamitiesLevel =
                  object["results"][0]["calamities_lvl"].split(",");
                console.log(error, calamitiesLevel, calamitiesLevel);
              }

              for (var i = 0; i < calamities.length; i++) {
                calamitiesArray.push({
                  calamity: calamities[i],
                  level: calamitiesLevel[i],
                  eradicate: 0,
                });
              }

              calTotalDays =
                Math.round(days / (totalCalamities + 1)) * secPerDay;
              //var calTotalDays = 20;
              console.log("calTotalDays");
              console.log(calTotalDays);

              // console.log(calamitiesArray);
              parameters["setup"]["exhaust"] =
                object["results"][0]["days_check"];
              parameters["setup"]["exhaust_land"] =
                object["results"][0]["exhaust_land"];
              // socketMethods.setTurns();
              // socketMethods.emitData("initialize-data", parameters, "devices");
              // socketMethods.emitData("initialize-data", parameters, "user", presentation);
              // socketMethods.emitData("initialize-data", parameters, "user", admin);

              socket.broadcast.emit("commence-game", {}, "all");
              socketMethods.commenceGame(data);
            });
          });
      },
      currentCalamityCount: 0,
      calamityFlag: false,
      // function to strike calamity in all devices
      strikeCalamity: function () {
        console.log("calamity strike");
        console.log("calamitiesArray");
        console.log(calamitiesArray);
        console.log("socketMethods.currentCalamityCount");
        console.log(socketMethods.currentCalamityCount);
        if (socketMethods.currentCalamityCount < calamitiesArray.length) {
          // calamity timeout. Time is dependent upon total calamity in the round
          socketMethods.calamityTimeOut = setInterval(function () {
            // console.log("calamity interval days : " + calTotalDays);
            if (socketMethods.calamityFlag == false) {
              calTotalDays--;
              if (calTotalDays === 0) {
                console.warn("strike");
                if (!calamitiesArray[socketMethods.currentCalamityCount])
                  return;
                socketMethods.pauseGame();
                var random = mods._.sample(tileLayOut, 4);
                var params = {
                  calamity: calamitiesArray[socketMethods.currentCalamityCount],
                  index: socketMethods.currentCalamityCount,
                  affected_tiles: random,
                };
                // checking ev points and decide whether it will effect the tiles or not
                var evPoints = socketMethods.checkEvPoints();
                // console.log("Evolution Points", evPoints);
                // console.log("Calamity", params);
                if (
                  calamitiesArray[socketMethods.currentCalamityCount][
                    "calamity"
                  ] == "Earthquake" &&
                  evPoints >= 40
                ) {
                  // console.log("earthquake");
                  calamitiesArray[socketMethods.currentCalamityCount][
                    "eradicate"
                  ] = 1;
                }
                if (
                  (calamitiesArray[socketMethods.currentCalamityCount][
                    "calamity"
                  ] == "Acid Rain" ||
                    calamitiesArray[socketMethods.currentCalamityCount][
                      "calamity"
                    ] == "Acid Storm") &&
                  evPoints >= 60
                ) {
                  // console.log("Acid Rain");
                  calamitiesArray[socketMethods.currentCalamityCount][
                    "eradicate"
                  ] = 1;
                }
                if (
                  calamitiesArray[socketMethods.currentCalamityCount][
                    "calamity"
                  ] == "Volcanic Eruption" &&
                  evPoints > 80
                ) {
                  // console.log("Volcanic Eruption");
                  calamitiesArray[socketMethods.currentCalamityCount][
                    "eradicate"
                  ] = 1;
                }

                socketMethods.emitData("strike-calamity", params, "devices");
                socketMethods.emitData(
                  "strike-calamity",
                  params,
                  "user",
                  presentation
                );
                socketMethods.emitData(
                  "strike-calamity",
                  params,
                  "user",
                  admin
                );
                socketMethods.currentCalamityCount++;
                calTotalDays =
                  Math.round(days / (totalCalamities + 1)) * secPerDay;
                socketMethods.resumeGame();
              }
            }
            //}, (days / totalCalamities) * secPerDay * 1000);
          }, 1000);
        } else {
          // console.log("end of calamity");
        }
      },
      // pausing the game
      pauseGame: function () {
        console.log("pause game");
        socketMethods.calamityFlag = true;

        clearTimeout(socketMethods.offerTimeOut);
        clearTimeout(socketMethods.commenceGameInterval);
        clearInterval(socketMethods.calamityTimeOut);
      },
      //resume game
      resumeGame: function () {
        socketMethods.resumeGameTimeOut = setTimeout(function () {
          socketMethods.resumeGameFunction(0);
        }, 75000);
      },
      // function to resume game
      resumeGameFunction: function (data) {
        socketMethods.calamityFlag = false;
        socketMethods.strikeCalamity();
        socketMethods.emitData("resume-game", { flag: data }, "devices");
        socketMethods.emitData(
          "resume-game",
          { flag: data },
          "user",
          presentation
        );
        socketMethods.emitData("resume-game", { flag: data }, "user", admin);
        socketMethods.resendOffer();
      },
      // whether the lose type is collab or non collab
      loseVideoType: function (data) {
        console.log("scoket");
        console.log("on server-lose-video-type");
        console.log(data);
        socketMethods.emitData("lose-type", data, "devices");
        socketMethods.emitData("lose-type", data, "user", presentation);
      },
      isUFBadge: 0,
      // highlighting the badges and logic accordingly
      badgeHighlight: function (data) {
        console.log("scoket:");
        console.log("on server-badge-highlight");
        console.log(data);
        socketMethods.isUFBadge = 0;
        if (data["flag"] == "on") {
          if (data["type"] == "hope") {
            CROBMv++;
            socketMethods.movCrob();
          } else if (data["type"] == "depression") {
            if (CROBMv > 0) {
              CROBMv--;
              socketMethods.movCrob();
            }
          } else if (data["type"] == "unity") {
            socketMethods.isUFBadge = 1; // unity
          } else if (data["type"] == "fear") {
            socketMethods.isUFBadge = 2; // fear
          }
        }

        socketMethods.emitData("badge-highlight", data, "devices");
        socketMethods.emitData("badge-highlight", data, "user", presentation);
        socketMethods.emitData("badge-highlight", data, "user", admin);
      },
      //buying tile and one by one turn to other user
      buyTile: function (data) {
        // console.log("in game", data['in_game']);
        if (data["in_game"] == "no") {
          socketMethods.setTurns();
        }

        var count = 0;
        for (var a in tilesID) {
          for (var b in tilesID[a]["tile_count"]) {
            if (b != "class-name" && b != "tile_id") {
              count++;
            }
          }
        }
        let total_cost  = 0;
        let taile_count = data["tile_count"]
        let all_taile = ["forest", "farm", "plain", "earth", "lake",]
        Object.keys(taile_count).forEach(function(key) {
            if(all_taile.includes(key)) {
              total_cost += taile_count[key]
            }
        });
        var params = {
          "tile-count": count,
        };
        console.log(socketMethods.remainingDays, socketMethods.round_name)
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [data.user_id, 'land_purchase', JSON.stringify({currentDay: socketMethods.remainingDays, cost: total_cost, purchase: data.id}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
        socketMethods.emitData(
          "presentation-buy-tile",
          params,
          "user",
          presentation
        );
      },
      // skipping the purchase and next turn
      skipBuying: function (data) {
        socketMethods.setTurns();
      },
      currentProcess: 1,
      //setting the next turn for purchasing the tiles. for round 1 its ascending and in last its descending
      setTurns: function () {
        if (socketMethods.currentProcess == 1) {
          if (currentTurn < turns.length) {
            socketMethods.emitData(
              "my-turn",
              {},
              "user",
              devices[turns[currentTurn]["name"]]["id"]
            );
            socketMethods.emitData(
              "presentation-my-turn",
              { profile: turns[currentTurn] },
              "user",
              presentation
            );
            currentTurn++;
            if (currentTurn == turns.length) {
              currentTurn = turns.length - 1;
              socketMethods.currentProcess = 2;
            }
          }
        } else {
          if (currentTurn > -1) {
            socketMethods.emitData(
              "my-turn",
              {},
              "user",
              devices[turns[currentTurn]["name"]]["id"]
            );
            socketMethods.emitData(
              "presentation-my-turn",
              { profile: turns[currentTurn] },
              "user",
              presentation
            );
            currentTurn--;
          } else {
            socketMethods.emitData("prepare-commence-game", {}, "user", admin);
            socketMethods.emitData(
              "prepare-commence-game",
              {},
              "user",
              presentation
            );
            socketMethods.emitData("prepare-commence-game", {}, "devices");
          }
        }
      },
      // commencing the game and starting of timers
      commenceGame: function (data) {
        socketMethods.startGameTimer(data);
        clearTimeout(socketMethods.commenceGameInterval);
        socketMethods.commenceGameInterval = setTimeout(function () {
          socketMethods.generateOffer();
        }, 10000);
        socketMethods.strikeCalamity();
        socketMethods.tribeValue();
        socketMethods.skillLevelUpdated();
        socketMethods.tribeCredits();
        socketMethods.movCrob();
        socketMethods.bountyOffer();
      },
      // starting the game timer
      startGameTimer: function (data) {
        var daysCount = resumedDays;
        const id = presentation;
        // clearInterval(socketMethods.gameInterval);
        setTimeout(() => {
          socketMethods.gameInterval = setInterval(() => {
            if (socketMethods.calamityFlag == false) {
              var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
              var params = [data.socket_user_id, 'days_count', JSON.stringify({daysCount: daysCount}), socketMethods.round_name];
              mods.Query.executeQueryWithPromise(query, params)
                .then(function (object) {
                  console.log("succccc")
                  return;
                }).catch(function(error) {
                  console.log("erroro", error)
                })
              if (daysCount > 0) {
                daysCount--;

                var param = {
                  total_days: days,
                  days_left: daysCount,
                };
                console.log(param);
                socketMethods.remainingDays = daysCount;
                // emit data
                socketMethods.emitData("days-left", param, "user", id);
                socketMethods.emitData("days-left", param, "user", admin);
                socketMethods.emitData("days-left", param, "devices");
              } else {
                // end - game
                var params = {
                  result: "loss",
                };

                socketMethods.gameOver(params);
              }
            }
          }, secPerDay * 1000);
        }, 1);
        //}, secPerDay);
      },
      lastOffer: "",
      // generating new offers after time interval
      generateOffer: function () {
        console.log("socket:");
        console.log("on generate-offer");
        var tiles = [
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
          "forest",
          "farm",
          "plain",
          "earth",
          "lake",
        ];
        var position = socketMethods.generateRandomNumber(1, tiles.length);
        // checking offer never repeats
        if (socketMethods.lastOffer == tiles[position - 1]) {
          // console.log("same thing");
          socketMethods.generateOffer();
          return false;
        }
        socketMethods.lastOffer = tiles[position - 1];
        // console.log("not the same thing");
        var weeks = 6;
        var credits = 0;
        var quantity = 0;
        var tribeValue = socketMethods.tribeValue();

        // console.log(tribeValue);
        // setting the value of offer depending upon days and tribevalue
        if (socketMethods.remainingDays > 253) {
          weeks = 5;
          if (tribeValue >= 0 && tribeValue <= 4) {
            credits = 300;
            quantity = 1;
          } else if (tribeValue >= 4.01 && tribeValue <= 7) {
            credits = 600;
            quantity = 2;
          } else if (tribeValue >= 7.01 && tribeValue <= 10) {
            credits = 1200;
            quantity = 3;
          }
        } else if (
          socketMethods.remainingDays <= 253 &&
          socketMethods.remainingDays > 190
        ) {
          weeks = 4;
          if (tribeValue >= 0 && tribeValue <= 4) {
            credits = 400;
            quantity = 1;
          } else if (tribeValue >= 4.01 && tribeValue <= 7) {
            credits = 800;
            quantity = 2;
          } else if (tribeValue >= 7.01 && tribeValue <= 10) {
            credits = 1600;
            quantity = 3;
          }
        } else if (
          socketMethods.remainingDays <= 190 &&
          socketMethods.remainingDays > 113
        ) {
          weeks = 3;
          if (tribeValue >= 0 && tribeValue <= 4) {
            credits = 600;
            quantity = 1;
          } else if (tribeValue >= 4.01 && tribeValue <= 7) {
            credits = 1200;
            quantity = 2;
          } else if (tribeValue >= 7.01 && tribeValue <= 10) {
            credits = 2400;
            quantity = 3;
          }
        } else if (
          socketMethods.remainingDays <= 113 &&
          socketMethods.remainingDays > 50
        ) {
          weeks = 2;
          if (tribeValue >= 0 && tribeValue <= 4) {
            credits = 800;
            quantity = 1;
          } else if (tribeValue >= 4.01 && tribeValue <= 7) {
            credits = 1600;
            quantity = 2;
          } else if (tribeValue >= 7.01 && tribeValue <= 10) {
            credits = 3200;
            quantity = 3;
          }
        } else if (
          socketMethods.remainingDays <= 50 &&
          socketMethods.remainingDays >= 0
        ) {
          weeks = 1;
          if (tribeValue >= 0 && tribeValue <= 4) {
            credits = 1000;
            quantity = 1;
          } else if (tribeValue >= 4.01 && tribeValue <= 7) {
            credits = 2000;
            quantity = 2;
          } else if (tribeValue >= 7.01 && tribeValue <= 10) {
            credits = 4000;
            quantity = 3;
          }
        } else {
          weeks = 5;
          if (tribeValue >= 0 && tribeValue <= 4) {
            credits = 300;
            quantity = 1;
          } else if (tribeValue >= 4.01 && tribeValue <= 7) {
            credits = 600;
            quantity = 2;
          } else if (tribeValue >= 7.01 && tribeValue <= 10) {
            credits = 1200;
            quantity = 3;
          }
        }

        var params = {
          weeks: weeks,
          harvest: tiles[position - 1],
          quantity: quantity,
          credits: credits,
          index: offerIndex,
          decline: 0,
          status: "pending",
        };
        offerArray[offerIndex] = params;
        console.log("new offer", params);
        // console.log(params);
        socketMethods.emitData("new-offer", params, "devices");
        try {
          var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
          var params = ['all', 'new_offer', JSON.stringify({daysLeft: socketMethods.remainingDays, resources: params.harvest, quantity: params.quantity, reward: params.credits, timeline: params.weeks}), socketMethods.round_name];
          mods.Query.executeQueryWithPromise(query, params)
            .then(function (object) {
              console.log("succccc")
              return;
            }).catch(function(error) {
              console.log("erroro", error)
            })
        } catch(e) {
          console.log("error")
        }

        offerIndex++;
        clearTimeout(socketMethods.offer60Timer);
        // offer timer. after sixty minutes it will automatically close generate new offer
        socketMethods.offer60Timer = setTimeout(function () {
          socketMethods.emitData("offer-closed", {}, "devices");
          socketMethods.resendOffer();
        }, 60000);
      },
      // offer time out. not used
      offerTimedOut: function (data) {
        console.log("socket:");
        console.log("on offer-timed-out");
        console.log(data);
        //offerArray[index]['timeout'] = setTimeout(function()
        //{
        if(offerArray.length === 0) {
          var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
          var params = ['all', 'offer_expired', JSON.stringify({message: 'No offer generated yet'}), socketMethods.round_name];
          mods.Query.executeQueryWithPromise(query, params)
            .then(function (object) {
              console.log("succccc")
              return;
            }).catch(function(error) {
              console.log("erroro", error)
            })
          return
        }
        var index = data["index"];
        offerArray[index]["status"] = "closed";
        // console.log(offerArray[index]);
        //var params = {
        //    "index" : index
        //};
        //socketMethods.emitData("offer-timed-out", params, 'user', devices[offerArray[index]['user_name']]['id']);

        //}, offerArray[index]['weeks'] * 7 * secPerDay);
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = ['all', 'offer_expired', JSON.stringify({daysLeft: socketMethods.remainingDays, resource: data.harvest, quantity: data.quantity, reward: data.credits}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
      },
      // when user declines the offer
      declineOffer: function (data) {
        console.log("socket");
        console.log("on decline-offer");
        console.log(data);
        offerArray[data["index"]]["decline"]++;

        var totalPlayers = Object.keys(devices).length;
        var declinedOffer = offerArray[data["index"]]["decline"];

        var percentage = (declinedOffer * 100) / totalPlayers;
        // if 60 percent of the total users decline the offer then new offer is generated
        if (percentage >= 60) {
          clearTimeout(socketMethods.offer60Timer);
          socketMethods.closeOffer(data["index"]);
          offerArray[data["index"]]["status"] = "declined";

          socketMethods.resendOffer("reject");
        }
        // console.log(offerArray[data['index']]);
      },
      // resend new offer
      resendOffer: function (type) {
        clearTimeout(socketMethods.offerTimeOut);
        clearTimeout(socketMethods.offer60Timer);
        socketMethods.offerTimeOut = setTimeout(function () {
          socketMethods.generateOffer();
        }, (type != "reject" ? daysPerOffer : daysPerOfferRejection) *
          secPerDay *
          1000);
      },
      // offer delivered
      deliverOffer: function (data) {
        console.log("socket:");
        console.log("on server-deliver-offer");
        console.log(data, offerArray);
        //clearTimeout(offerArray[data['index']]['timeout']);
        offerArray[data["index"]]["status"] = "delivered";
        totalDelivery++;
        socketMethods.tribeValue();
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [data.user_id, 'offer_delivered', JSON.stringify({daysLeft: socketMethods.remainingDays, resource: data.harvest, quantity: data.quantity, reward: data.credits}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
      },
      // close offer
      closeOffer: function (index) {
        clearTimeout(offerArray[index]["timeout"]);
        socketMethods.emitData("offer-closed", {}, "devices");
      },
      generateRandomNumber: function (min, max) {
        return mods._.random(min, max);
      },
      // executing some function manually - testing part
      executeMethod: function (data) {
        console.log("scoket:");
        console.log("on execute-method");
        console.log(data);
        socketMethods[data["function"]]();
      },
      // trading goods with friends. one sub tribe to other sub tribe
      tradeGoodsWithFriend: function (data) {
        console.log("scoket:");
        console.log("on trade-good-with-friends");
        console.log(data);
        console.log("socket io", data.socket_user_id);
        let socket_user_id = data.socket_user_id
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [data.socket_user_id, 'resource_sold', JSON.stringify({daysCount: socketMethods.remainingDays, price: data.price, sold_to: data.friend_id}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
        socketMethods.emitData(
          "get-trade-harvest",
          data,
          "user",
          data["friend_id"]
        );
      },
      // transfering credits to other sub tribes
      transferCredits: function (data) {
        console.log("socket");
        console.log("on server-transfer-credits");
        console.log(data);
        socketMethods.emitData(
          "transfer-credits",
          data,
          "user",
          data["friend_id"]
        );
      },
      // accepting the trade from the sub tribe
      acceptTrade: function (data) {
        console.log("socket");
        console.log("on server-trade-accepted");
        console.log(data);
        let event = 'land_delivered'
        let friend_id = data.friend_id
        if(data.socket_user_id === data.friend_id) {
          event = 'land_purchase'
          friend_id = data.id
        }
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [data.socket_user_id, event, JSON.stringify({currentDay: socketMethods.remainingDays, cost: data.price, bought_by: friend_id}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })
        socketMethods.emitData("trade-accept", data, "user", data["friend_id"]);
      },
      // if goods expired while trading then this function executes
      goodsExpired: function (data) {
        console.log("socket");
        console.log("on server-goods-expired");
        console.log(data);
        socketMethods.emitData("goods-expired", data, "devices");
      },
      
      // submitting credits to CROB. If badge is active then things changes accordingly. If amount is greater than 3000 then it converts to mov
      submitCreditsToCROB: function (data) {
        console.log("socket:");
        console.log("on server-submit-credits");
        console.log(data);
      //Commenting to see if the cronos doubling effect will continue to take place
        // if (socketMethods.isUFBadge == 1) {
        //   data["credits"] = data["credits"] * 2;
        // } else if (socketMethods.isUFBadge == 2) {
        //   data["credits"] = Math.round(data["credits"] / 2);
        // }

        CROBCredits = CROBCredits + data["credits"];
        CROBCreditsUser.push(data);
        if (CROBCredits >= mov) {
          var length = Math.floor(CROBCredits / mov);
          for (var i = 0; i < length; i++) {
            CROBMv++;
            CROBCredits = CROBCredits - mov;
          }
        }
        socketMethods.movCrob();
        socketMethods.tribeCredits();
      },
      // submit MV to CROB
      submitMvToCROB: function (data) {
        console.log("socket");
        console.log("on server-submit-mv");
        console.log(data);
        CROBMv = CROBMv + data["mv"];
        CROBMvUser.push(data);
        socketMethods.movCrob();
      },
      // check ev points on then basis of mvs submitted
      checkEvPoints: function () {
        var totalPlayers = Object.keys(devices).length;
        var percentage = Math.round((CROBMv * 100) / totalPlayers);
        percentage = percentage > 100 ? 100 : percentage;
        // console.log(percentage);
        return percentage;
      },
      // submitting the mvs to bounty hunter
      submitMVToBountyHunter: function (data) {
        console.log("socket");
        console.log("on server-submit-mv-to-bounty-hunter");
        console.log(data);
        bountyHunter[data["name"]] = 2;
        var length = Object.keys(bountyHunter).length * 2;
        var count = 0;
        for (var hunter in bountyHunter) {
          count = count + bountyHunter[hunter];
        }
        var percentage = (count * 100) / length;
        var params = {
          percentage: percentage,
        };
        socketMethods.emitData("bounty-hunter-completion", params, "devices");
      },
      // generating production quality of the tribe
      getProductionQuality: function () {
        var count = 0;
        for (var skill in devices) {
          count = count + parseInt(devices[skill]["skill-level"]);
        }
        // console.log("count", count);
        var value = (count / Object.keys(devices).length) * 2;
        // console.log("value", value);
        return value;
      },
      // if skill level is updated then production quality is changed
      skillLevelUpdated: function (data) {
        console.log("socket");
        console.log("on server-skill-level-updated");
        console.log(data);
        if (typeof data != "undefined") {
          devices[data["name"]]["skill-level"] = data["skill-level"];
        }
        var productionQuality = socketMethods.getProductionQuality();
        var params = {
          "production-quality": productionQuality,
        };
        socketMethods.emitData(
          "production-quality",
          params,
          "user",
          presentation
        );
      },
      // tribe value is calculated on the basis of total delivery and total accepted
      tribeValue: function () {
        // console.log(totalDelivery);
        // console.log(totalAccepted);

        var tribeValue = ((totalDelivery / totalAccepted) * 10).toFixed(2);
        tribeValue = isNaN(tribeValue) ? 0 : tribeValue;
        // console.log("tribe value : ", tribeValue);
        var params = {
          "tribe-value": tribeValue,
        };
        socketMethods.emitData("tribe-value", params, "user", presentation);
        return tribeValue;
      },
      bountyDaysCount: 0,
      // function to generate bounty hunter pop for 50% of the user playing the game
      bountyOffer: function () {
        socketMethods.bountyDaysCount = Math.round((days / 2) * secPerDay);
        socketMethods.bountyInterval = setInterval(function () {
          if (socketMethods.calamityFlag == false) {
            socketMethods.bountyDaysCount--;
            if (socketMethods.bountyDaysCount == 0) {
              var random = mods._.sample(
                devices,
                Math.floor(Object.keys(devices).length / 2)
              );
              for (var i = 0; i < random.length; i++) {
                var params = {};
                socketMethods.emitData(
                  "bounty-offer",
                  params,
                  "user",
                  random[i]["id"]
                );
              }
              clearInterval(socketMethods.bountyInterval);
            }
          }
        }, 1000);
      },
      // displaying the tribe credits
      tribeCredits: function () {
        var params = {
          "tribe-credits": CROBCredits,
        };
        socketMethods.emitData("tribe-credits", params, "user", presentation);
      },
      movPercentage: 0,
      lastPercentage: 0,
      // function to display mov and checking whether global study is oompleted or not
      movCrob: function () {
        var length = Object.keys(devices).length * 2;
        socketMethods.movPercentage = (CROBMv * 100) / length;
        socketMethods.movPercentage =
          socketMethods.movPercentage > 100 ? 100 : socketMethods.movPercentage;
        var params = {
          "tribe-mov": CROBMv,
          percentage: socketMethods.movPercentage,
        };
        socketMethods.emitData("tribe-mov", params, "user", presentation);

        if (socketMethods.lastPercentage < socketMethods.movPercentage) {
          socketMethods.emitData("tribe-mov", params, "devices");
        }

        socketMethods.lastPercentage = socketMethods.movPercentage;
        if (socketMethods.movPercentage >= 100) {
          // end - game
          var params = {
            result: "won",
          };
          socketMethods.gameOver(params);
        }
      },
      // function to track all the harvest done by user and calculate average harvest cost and week
      submitHarvest: function (data) {
        console.log("socket");
        console.log("on server-submit-harvest");
        console.log(data);
        allHarvest.push(data);
        var harvestWeek = 0;
        var harvestCost = 0;

        for (var i = 0; i < allHarvest.length; i++) {
          harvestWeek = harvestWeek + parseInt(allHarvest[i]["week"]);
          harvestCost = harvestCost + parseInt(allHarvest[i]["cost"]);
        }

        var averageWeek = Math.round(harvestWeek / allHarvest.length) * 7;
        var averageCost = Math.round(harvestCost / allHarvest.length);

        var params = {
          "average-week": averageWeek,
          "average-cost": averageCost,
        };

        console.log("came_hreere")
        var query = `insert into events_logs (userid, event_name, data, game_id) values (?, ?, ?, ?)`;
        var params = [data.socket_user_id, 'harvest', JSON.stringify({daysCount: socketMethods.remainingDays, cost: data.cost, time: data.week, land: data.tileName}), socketMethods.round_name];
        mods.Query.executeQueryWithPromise(query, params)
          .then(function (object) {
            console.log("succccc")
            return;
          }).catch(function(error) {
            console.log("erroro", error)
          })

        socketMethods.emitData(
          "average-week-and-cost",
          params,
          "user",
          presentation
        );
      },
      // on game over
      gameOver: function (params) {
        socketMethods.emitData("game-over", params, "devices");
        socketMethods.emitData("game-over", params, "user", presentation);
        socketMethods.emitData("game-over", params, "user", admin);

        clearTimeout(socketMethods.offerTimeOut);
        clearTimeout(socketMethods.commenceGameInterval);
        clearTimeout(socketMethods.resumeGameTimeOut);
        clearInterval(socketMethods.calamityTimeOut);
        clearInterval(socketMethods.bountyInterval);
        clearInterval(socketMethods.gameInterval);
      },
      // play video
      playVideo: function () {
        console.log("scoket");
        console.log("on server-play-video");
        // console.log("play video");
        socketMethods.emitData("play-video", {}, "user", presentation);
      },
      // send data when calamity is finished
      isCalamityGone: function (data) {
        console.log("socket");
        console.log("on server-is-calamity-gone");
        console.log(data);
        var params = {
          "calamity-flag": socketMethods.calamityFlag,
        };
        socketMethods.emitData("calamity-flag", params, "user", data["id"]);
      },
      // resuming the game manually
      resumeGameManually: function (data) {
        console.log("scoket:");
        console.log("on server-resume-game-manually");
        console.log(data);
        socketMethods.emitData("resume-game-manually", {}, "devices");
      },
      // when admin pauses the entire game. it resumes after 3 mins
      pauseGameFromAdmin: function (data) {
        console.log("scoket");
        console.log("on server-pause-game");
        console.log(data);
        socketMethods.pauseGame();
        socketMethods.emitData("pause-game", {}, "devices");
        setTimeout(function () {
          // console.log('resume  game');
          socketMethods.resumeGameFunction(1);
        }, 3 * 60 * 1000);
      },
    };
  };
})();