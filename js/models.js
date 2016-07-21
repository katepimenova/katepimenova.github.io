import _ from 'lodash';
import Backbone from 'backbone';
import LocalStorage from '../lib/backbone.localStorage';

var models = {};

models.Circle = Backbone.Model.extend({
  constructorName: 'Circle',
  validate({x, y, r}, {radiusMax, xMax, yMax}) {
    var errors = {};
    if (r <= 0) errors.r = 'Invalid radius';
    if (x < 0) errors.x = 'Invalid X coordinate';
    if (y < 0) errors.y = 'Invalid Y coordinate';
    if (!errors.x && x > xMax) {
      errors.x = 'The new circle won\'t fit the viewport';
    }
    if (!errors.y && y > yMax) {
      errors.y = 'The new circle won\'t fit the viewport';
    }
    if (!errors.r && (r * 2 > radiusMax)) {
      errors.r = 'Sum of circles diameters cannot be larger than the viewport width (must be <= 100)';
    }
    return _.isEmpty(errors) ? null : errors;
  }
});

models.Circles = Backbone.Collection.extend({
  constructorName: 'Circles',
  model: models.Circle,
  localStorage: new LocalStorage('circles-collection')
});

export default models;