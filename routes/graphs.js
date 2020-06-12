const route = require('express').Router();

const Measurement = require("../model/Measurement.js");
const Sensor = require("../model/Sensor.js");

const server = require('../app.js');
const io = server.getIO(); 
const escape = require('escape-html');

var moment = require('moment');

const defaultSensorId = 64;
const defaultStart = "2020-05-28T07:40:27.665Z";            
const defaultEnd = "2020-05-28T13:40:27.665Z"; 
const defaultLimit = 100;

var sensorId = 64;
var start = "2020-05-28T07:40:27.665Z";            
var end = "2020-05-28T13:40:27.665Z"; 
var limit = 100;

io.on('connection', socket => { 
  console.log("Socket joined", socket.id);

  socket.on("graphs", ({ newSensor, newLimit, startDate, endDate}) =>  {
     

    
      startDate = (startDate === null || startDate === "") ? defaultStart: startDate;
      endDate = (endDate === null || endDate === "") ? defaultEnd: endDate;
      newSensor = (newSensor === null || newSensor === "") ? defaultSensorId: newSensor;
      newLimit = (newLimit === null || newLimit === "") ? defaultLimit: newLimit;


      sensorId = newSensor == null ? defaultSensorId: newSensor;
      limit = newLimit == null ? defaultLimit :newLimit;  
      
      start = moment((new Date(startDate).toISOString())).add(2,'hours') == "" ? defaultStart: startDate;
      end = moment(new Date(endDate).toISOString()).add(2,'hours')== "" ? end:endDate; 



      // sends back to the very same client
      // socket.emit("graphs", { sensorId: escape("sensorId") });


  });
  

 socket.on('disconnect', () => {
      console.log("Socket left", socket.id);
  });
});



route.get('/admin/graphs', async (req, res) => {                                                                                                                                                        
  if(req.session.user ) {

          try {
            const sensor = await Sensor.query().select().where({'sensorId': sensorId}).limit(1);
              if (Object.keys(sensor).length === 0){
                res.render("graphs/graphs", { message:"Sensor doesnt exist", username: req.session.user[0].username, labels:[],dataset: [],
                sensor: []});
                sensorId = defaultSensorId;
              } else {
                const measurement = await Measurement.query().select("time", "value")
                .whereBetween("time", [start, end])
                .where({ sensor_id: sensorId })
                .orderBy("time", 'desc')
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
            }
          
          } catch (e) {
            res.render("graphs/graphs", {message: "Error in Fetching data",username: req.session.user[0].username, labels:[],dataset: [],
            sensor: []});
            sensorId = defaultSensorId;
          }

    } else{
      return res.redirect("/login");
    }
  
  });

module.exports = route;