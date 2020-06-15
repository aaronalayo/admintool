const route = require('express').Router();

// const Sensor = require('../model/Sensor.js');
// const Measurement = require('../model/Measurement.js');


// const server = require('../app.js');
// const io = server.getIO(); 
// const escape = require('escape-html');

// var moment = require('moment');

// const defaultStart = "2020-05-28T07:40:27.665Z";            
// const defaultEnd = "2020-05-28T13:40:27.665Z"; 
// const defaultLimit = 100;

// var start = "2020-05-28T07:40:27.665Z";            
// var end = "2020-05-28T13:40:27.665Z"; 
// var limit = 100;

//Socket connection to receive data from user input 
// io.on('connection', socket => { 
//   console.log("Socket joined", socket.id);

//   socket.on("graphs", ({newLimit, startDate, endDate}) =>  {
     

//       //Checks that data received is not empty or null, 
//       //if one of the previous, uses default values.
//       startDate = (startDate === null || startDate === "") ? defaultStart: startDate;
//       endDate = (endDate === null || endDate === "") ? defaultEnd: endDate;
//       newLimit = (newLimit === null || newLimit === "") ? defaultLimit: newLimit;


      
//       limit = newLimit == null ? defaultLimit :newLimit;  
      
//       //Converts datetime-local to Timestamp UTC
//       start = moment((new Date(startDate).toISOString())).add(2,'hours') == "" ? defaultStart: startDate;
//       end = moment(new Date(endDate).toISOString()).add(2,'hours')== "" ? end:endDate; 



//       // sends back to the very same client
//       const message = "Searching...";
//       socket.emit("graphs", { message: escape(message)});


//   });
  

//  socket.on('disconnect', () => {
//       console.log("Socket left", socket.id);
//   });
// });

// route.get('/device/sensor/:id', async (req, res) => {
//     if(req.session.user) {

//         const sensorId = req.params.id;
//         // const start = "2020-05-28T07:40:27.665Z";            
//         // const end = "2020-05-28T13:40:27.665Z"; 
//         // const limit = 100;

        
        
//         try {
//             const sensor = await Sensor.query().select().where({'sensorId': sensorId});

//             // res.render("sensorpage/sensor", { sensor: sensor[0].sensorId,sensorDetail: sensor, username: req.session.user[0].username});
//                 const measurement = await Measurement.query().select("time", "value")
//                 .whereBetween("time", [start, end])
//                 .where({ sensor_id: sensorId })
//                 .orderBy("time", 'desc')
//                 .limit(limit);
        
//               const labels = [];
//               const dataset = [];
//               for (var i = 0; i < measurement.length; i++) {
//                 var obj = measurement[i];
//                 for (var key in obj) {
//                   labels.push(obj["time"]);
//                   dataset.push(obj["value"]);
//                 }
//               }
//               res.render("sensorpage/sensor", {labels: labels,dataset: dataset, sensor: sensor[0].sensorId, sensorDetail: sensor, username: req.session.user[0].username,
//               });
//         } catch (error) {
//             res.render("sensorpage/sensor", { message: "Error in Fetching data" , username: req.session.user[0].username});
//         }
       

//     }else {
//         return res.redirect("/login");
//     }

// });




module.exports = route;