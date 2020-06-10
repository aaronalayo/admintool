const { Model } = require('objection');

const Calibration = require("./Calibration.js");
const Device = require('./Device.js');

class Sensor extends Model {
  static tableName = 'sensors';

  static relationMappings = {
    calibration: {
        relation: Model.BelongsToOneRelation,
        modelClass: Calibration,
        join: {
          from: 'sensors.calibration_uuid',
          to: 'calibrations.calibration_uuid'
        }
    },
    devices: {
      relation: Model.HasManyRelation,
      modelClass: Device,
      join: {
        from: 'sensors.device_uuid',
        to: 'devices.devices_uuid'
      }
  }
}
};


module.exports = Sensor;