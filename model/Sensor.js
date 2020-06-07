const { Model } = require('objection');

const Calibration = require("./Calibration.js");

class Sensor extends Model {
  static tableName = 'sensors';

  static relationMappings = {
    calibrations: {
        relation: Model.BelongsToOneRelation,
        modelClass: Calibration,
        join: {
          from: 'sensors.calibration_uuid',
          to: 'calibrations.calibration_uuid'
        }
    }
}
};


module.exports = Sensor;