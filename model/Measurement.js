const { Model } = require('objection');

const Sensor = require("./Sensor.js");

class Measurement extends Model {
  static tableName = 'measurements';
    
    static relationMappings = {
      Sensor: {
          relation: Model.HasOneRelation,
          modelClass:Sensor,
          join: {
            from: 'measurements_sensor_id',
            to: 'sensors.sensor_id'
          }
      }
  
  }
};
module.exports = Measurement;