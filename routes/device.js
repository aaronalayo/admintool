const route = require('express').Router();


const Sensor = require('../model/Sensor.js');
const Device = require('../model/Device.js');

//Gets the device details by id
route.get('/dashboard/device/:id', async (req, res) => {
    if(req.session.user) {

        const device_uuid = req.params.id;
 
        try {
            
            const device = await Device.query().select().where({'device_uuid': device_uuid});
            const sensors = await Sensor.query().select().where({'device_uuid': device_uuid}).orderBy('sensor_id', 'asc');
            

            res.render("devicepage/device", { deviceData: device, deviseId: device[0].device_uuid, sensorsData: sensors, username: req.session.user[0].username, 
                link:`http://maps.google.com/maps?q=${device[0].location.x},${device[0].location.y}`, linkSensor:"/dashboard/device/"+`${device_uuid}`+"/sensor/"});

        } catch (error) {
            res.render("devicepage/device", { message: "Error in Fetching data" , username: req.session.user[0].username});
        }

    }else {
        return res.redirect("/login");
    }

});

module.exports = route;