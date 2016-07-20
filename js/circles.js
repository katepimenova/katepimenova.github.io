import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from './d3chart';
import models from './models';

var CirclesPage = React.createClass({
  getInitialState() {
    return {
      data: this.props.circlesCollection || [],
      domain: {x: [0, 100], y: [0, 100]}
    };
  },
  setAppState(state) {
    return this.setState(state);
  },
  render() {
    return (
      <div className='circles-page'>
        <h2>Circles</h2>
        <div className='circles-chart'>
          <Chart
            appState={this.state}
            setAppState={this.setAppState}
          />
        </div>
        <CirclesControl
          appState={this.state}
          setAppState={this.setAppState}
        />
      </div>
    );
  }
});

var Chart = React.createClass({
  getDefaultProps() {
    return {
      width: '100%',
      height: '600px'
    };
  },
  dispatcher: null,
  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    var dispatcher = d3Chart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.props.appState);
    this.dispatcher = dispatcher;
  },
  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.props.appState, this.dispatcher);
  },
  render() {
    return <div className='chart' />;
  }
});

var CirclesControl = React.createClass({
  getInitialState() {
    return {
      x: 5,
      y: 5,
      z: 5,
      error: false
    };
  },
  render() {
    var circles = this.props.appState.data;
    return (
      <div>
        <h4>You can add up to 5 circles. Use x/y coordinates of circle center and its radius to add the shape.</h4>
        {_.map(circles, (circle, key) => {
          return this.viewCircleParameters(circles, circle, key);
        })}
        {circles.length < 5 &&
          <div>{this.addCircleControl(circles)}</div>
        }
        {!!this.state.error &&
          <div className='error'>
            {this.state.error}
          </div>
        }
      </div>
    );
  },
  viewCircleParameters(circles, circle, key) {
    return <div className='circles-controls' key={circle.id}>
      <span>
        {key + 1}.
      </span>
      <div>
        <label>x: </label>
        {circle.x};
      </div>
      <div>
        <label>y: </label>
        {circle.y};
      </div>
      <div>
        <label>radius: </label>
        {circle.z};
      </div>
      <div>
        <button onClick={_.partial(this.handleRemove, circle.id)}>Remove</button>
      </div>
    </div>;
  },
  addCircleControl() {
    return <div className='circles-controls'>
      <span>
        &nbsp;
      </span>
      <div>
        <label>x: </label>
        <input type='number' name='x' ref='x' min='0' max='100' onChange={this.handleChange} value={this.state.x} />
      </div>
      <div>
        <label> y: </label>
        <input type='number' name='y' ref='y' min='0' max='100' onChange={this.handleChange} value={this.state.y} />
      </div>
      <div>
        <label> radius: </label>
        <input type='number' name='z' ref='z' min='0' max='100' onChange={this.handleChange} value={this.state.z} />
      </div>
      <div>
        <button onClick={this.handleAdd} disabled={!!this.state.error}>Add Circle</button>
      </div>
    </div>;
  },
  handleAdd() {
    if (this.validateRadius()) {
      var circlesState = _.clone(this.props.appState);
      var circle = new models.Circle();
      var circleData = {
        id: !_.isEmpty(circlesState.data) ? _.last(circlesState.data).id + 1 : 1,
        x: this.refs.x.value,
        y: this.refs.y.value,
        z: this.refs.z.value
      };
      circle.set(circleData);
      app.circles.add(circle);
      circle.save();

      circlesState.data.push(circleData);
      this.props.setAppState(circlesState);
    }
  },
  handleRemove(circleId) {
    this.setState({error: false});
    var circle = app.circles.get(circleId);
    circle.destroy();

    var circlesState = _.clone(this.props.appState);
    _.remove(circlesState.data, (circle) => circle.id === circleId);
    this.props.setAppState(circlesState);
  },
  handleChange(e) {
    this.setState({error: false});
    if (e.target.name === 'z') {
      this.validateRadius(e.target.value);
    }
    if (e.target.name === 'x' || e.target.name === 'y') {
      this.validateCoordinates(e.target.name, e.target.value);
    }
    this.setState({[e.target.name]: e.target.value});
  },
  validateRadius(radius) {
    if (!radius) radius = this.state.z;
    // validate that the sum of circles diameters cannot be larger than the viewport width
    var appState = this.props.appState;
    var sum = _.reduce(appState.data, (result, circle) => result + parseInt(circle.z), 0);
    if ((sum + parseInt(radius))*2 > appState.domain.x[1]) {
      this.setState({error: 'Error: Sum of circles diameters cannot be larger than the viewport width (must be <= 100)'});
      return false;
    } else if (parseInt(radius) <= 0) {
      this.setState({error: 'Error: Invalid radius size (must be > 0)'});
      return false;
    }
    return true;
  },
  validateCoordinates(coordName, coordValue) {
    var appState = this.props.appState;
    if (parseInt(coordValue) > appState.domain[coordName][1] || parseInt(coordValue) < appState.domain[coordName][0]) {
      this.setState({error: 'Error: The new circle won\'t fit the viewport'});
      return false;
    }
    return true;
  }
});

export default CirclesPage;