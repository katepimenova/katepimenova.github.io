import d3 from 'd3';
import {EventEmitter} from 'events';

var ANIMATION_DURATION = 400;
var d3Chart = {};

d3Chart.create = (el, props, state) => {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  svg.append('rect')
    .attr('class', 'd3bg')
    .attr('width', props.width)
    .attr('height', props.height);
  
  svg.append('g')
      .attr('class', 'd3-points');

  var dispatcher = new EventEmitter();
  d3Chart.update(el, state, dispatcher);

  return dispatcher;
};

d3Chart.update = (el, state, dispatcher) => {
  var scales = d3Chart._scales(el, state.domain);
  var prevScales = d3Chart._scales(el, state.prevDomain);
  d3Chart._drawPoints(el, scales, state.data, prevScales, dispatcher);
};

d3Chart._scales = (el, domain) => {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;

  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  var z = d3.scale.linear()
    .range([5, 20])
    .domain([1, 10]);

  return {x: x, y: y, z: z};
};

d3Chart._drawPoints = (el, scales, data, prevScales, dispatcher) => {
  var g = d3.select(el).selectAll('.d3-points');

  var point = g.selectAll('.d3-point')
    .data(data, (d) => d.id);

  point.enter().append('circle')
      .attr('class', 'd3-point')
      .attr('cx', (d) => {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', (d) => scales.x(d.x));

  point.attr('cy', (d) => scales.y(d.y))
      .attr('r', (d) => scales.z(d.z))
      .on('mouseover', (d) => {
        dispatcher.emit('point:mouseover', d);
      })
      .on('mouseout', (d) =>  {
        dispatcher.emit('point:mouseout', d);
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', (d) => scales.x(d.x));

  if (prevScales) {
    point.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', (d) => scales.x(d.x))
        .remove();
  }
  else {
    point.exit()
        .remove();
  }
};

export default d3Chart;