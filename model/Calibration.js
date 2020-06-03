const { Model } = require('objection');

class Calibration extends Model {
  static tableName = 'calibrations';
    
}

module.exports = Calibration;