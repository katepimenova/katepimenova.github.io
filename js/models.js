import Backbone from 'backbone';
import LocalStorage from '../lib/backbone.localStorage';

var models = {};

models.Circle = Backbone.Model.extend({
  constructorName: 'Circle',
  defaults: {
    id: null,
    x: null, // x coordinates
    y: null, // y coordinates
    z: null // radius coordinates
  }
});

models.Circles = Backbone.Collection.extend({
  constructorName: 'Circles',
  model: models.Circle,
  localStorage: new LocalStorage('circles-collection')
});

export default models;