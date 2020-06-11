const route = require('express').Router();
const check = require('../middleware/check.js');

const Sensor = require('../model/Sensor.js');
const Device = require('../model/Device.js');
const Organization = require('../model/Organization.js');
const User = require('../model/User.js');



route.get('/dashboard/device/:id', async (req, res) => {
    if(req.session.user) {
        
        // console.log(req.params.id)
        const device_uuid = req.params.id;
        const username = req.session.user[0].username;
       
        try {
            
            const device = await Device.query().select().where({'device_uuid': device_uuid});
            const sensors = await Sensor.query().select().where({'device_uuid': device_uuid});
            

            res.render("devicepage/device", { deviceData: device, sensorsData: sensors, username: req.session.user[0].username, link:`http://maps.google.com/maps?q=${device[0].location.x},${device[0].location.y}`});

        } catch (error) {
            res.render("devicepage/device", { message: "Error in Fetching data" , username: req.session.user[0].username});
        }
        
        


    }else {
        return res.redirect("/login");
    }

});

module.exports = route;