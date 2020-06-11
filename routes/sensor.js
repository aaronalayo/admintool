const route = require('express').Router();


const Sensor = require('../model/Sensor.js');
const Device = require('../model/Device.js');

route.get('/device/sensor/:id', async (req, res) => {
    if(req.session.user) {

        const sensorId = req.params.id;
        console.log(sensorId);
        try {
            
            
            const sensor = await Sensor.query().select().where({'sensorId': sensorId});
            

            res.render("sensorpage/sensor", { sensor: sensor[0].sensorId,sensorDetail: sensor, username: req.session.user[0].username});

        } catch (error) {
            res.render("devicepage/device", { message: "Error in Fetching data" , username: req.session.user[0].username});
        }

    }else {
        return res.redirect("/login");
    }

});



















module.exports = route;