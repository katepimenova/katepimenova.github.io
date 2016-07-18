import Backbone from 'backbone';
import LocalStorage from './backbone.localStorage';

var models = {};

models.Round = Backbone.Model.extend({
  constructorName: 'Round',
  defaults: {
    id: null,
    x: null,
    y: null,
    z: null
  }
});

models.Rounds = Backbone.Collection.extend({
  constructorName: 'Rounds',
  model: models.Round,
  localStorage: new LocalStorage('rounds-collection')
});

export default models;