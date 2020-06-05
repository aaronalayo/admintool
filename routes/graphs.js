const route = require('express').Router();
const Device = require("../model/Device.js");
var moment = require('moment');
const Sensor = require("../model/Sensor.js");
const Measurement = require("../model/Measurement")

const server = require('../app.js');
const io = server.getIO(); 
const escape = require('escape-html');

var sensorId = 64;
var start = "2020-05-28T07:40:27.665Z";
var end = "2020-05-28T13:40:27.665Z"; 
var limit = 50;

io.on('connection', socket => { 
  console.log("Socket joined", socket.id);

  socket.on("graphs", ({ startDate, endDate, sensor, newLimit}) => {
     
  
     start = startDate;
     end = endDate;
     end = new Date().getTime();
     sensorId = sensor;
     limit = newLimit;
    
      // sends back to the very same client
      // socket.emit("graphs", { sensor: escape(sensor) });

      // sends to all clients but the client itself
      // socket.broadcast.emit("Color", { color });

  
  });
  

 socket.on('disconnect', () => {
      console.log("Socket left", socket.id);
  });
});



route.get('/admin/graphs', async (req, res) => {                                                                                                                                                        
  if(req.session.user ) {
          // const sensor = await Sensor.query().select({'sensor_id': 58} ).withGraphJoined('calibration as c').where({'c.calibration_uuid': 'f0cd5958-308c-4923-b8ae-1bd9f5b215c5'});
  
          try {

            const measurement = await Measurement.query().select("time", "value")
            .whereBetween("time", [start, end])
            .where({ sensor_id: sensorId })
              .orderBy("time")
              .limit(limit);

            const labels = [];
            const dataset = [];
            for (var i = 0; i < measurement.length; i++) {
              var obj = measurement[i];
              for (var key in obj) {
                labels.push(obj["time"]);
                dataset.push(obj["value"]);
              }
            }

            res.render("graphs/graphs", {
              labels: labels,
              dataset: dataset,
              sensor: sensorId,
              username: req.session.user[0].username,
            });
          } catch (e) {
            res.render("graphs/graphs", {
              message: "Error in Fetching devices",
            });
          }

    } else{
      return res.redirect("/login");
    }
  
  });



module.exports = route;