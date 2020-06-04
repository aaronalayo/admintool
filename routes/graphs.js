const route = require('express').Router();
const Device = require("../model/Device.js");
var moment = require('moment');
const Sensor = require("../model/Sensor.js");
const Measurement = require("../model/Measurement")

var Chart = require('chart.js');


route.get('/admin/graphs', async (req, res) => {                                                                                                                                                        
  if(req.session.user ) {
  
        try {  
            const sensor = await Sensor.query().select({'sensor_id': 58} ).withGraphJoined('calibration as c').where({'c.calibration_uuid': 'f0cd5958-308c-4923-b8ae-1bd9f5b215c5'});
            
            const startTime = '2020-05-28T07:40:27.665Z';
            const endTime = '2020-05-28T13:40:27.665Z';
            const measurement = await Measurement.query().select('time', 'value').whereBetween('time',[startTime , endTime]).where({'sensor_id':64}).orderBy('time').limit('50') ;
          
            const labels = [];
            const dataset = [];
            for (var i = 0; i < measurement.length; i++) {
              var obj = measurement[i];
              for (var key in obj) {
                labels.push(obj['time']);
                dataset.push(obj['value']);
              }
            }
         
            console.log(labels)
            res.render("graphs/graphs", {labels:labels,dataset: dataset, username: req.session.user[0].username });

      } catch (e) {
        res.render("graphs/graphs", { message: "Error in Fetching devices" });
      }
    } else{
      return res.redirect("/login");
    }
  
  });


module.exports = route;