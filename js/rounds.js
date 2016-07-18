import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import d3Chart from './d3chart';
import models from './models';

var RoundsPage = React.createClass({
  getInitialState() {
    return {
      data: this.props.roundsCollection || [],
      domain: {x: [0, 100], y: [0, 100]}
    };
  },
  setAppState(state) {
    return this.setState(state);
  },
  render() {
    return (
      <div className='rounds-page'>
        <h2>Rounds</h2>
        <div className='rounds-chart'>
          <Chart
            appState={this.state}
            setAppState={this.setAppState}
          />
        </div>
        <RoundControl
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
      height: '300px'
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

var RoundControl = React.createClass({
  getInitialState() {
    return {
      x: 10,
      y: 10,
      z: 10,
      error: false
    };
  },
  render() {
    var rounds = this.props.appState.data;
    return (
      <div>
        <h4>You can add up to 5 rounds in the chart. Use x/y/diameter inputs to define rounds parameters.</h4>
        {_.map(rounds, (round) => {
          return this.viewRoundParameters(rounds, round);
        })}
        {rounds.length < 5 &&
          <div>{this.addRoundControl(rounds)}</div>
        }
        {!!this.state.error &&
          <div className='error'>
            {this.state.error}
          </div>
        }
      </div>
    );
  },
  viewRoundParameters(rounds, round) {
    return <div className='rounds-controls' key={round.id}>
      <div>
        <label>x: </label>
        {round.x};
      </div>
      <div>
        <label>y: </label>
        {round.y};
      </div>
      <div>
        <label>diameter: </label>
        {round.z};
      </div>
      <div>
        <button onClick={_.partial(this.handleRemove, round.id)}>Remove</button>
      </div>
    </div>;
  },
  addRoundControl() {
    return <div className='rounds-controls'>
      <div>
        <label>x: </label>
        <input type='number' name='x' ref='x' min='0' max='100' onChange={this.handleChange} value={this.state.x} />
      </div>
      <div>
        <label> y: </label>
        <input type='number' name='y' ref='y' min='0' max='100' onChange={this.handleChange} value={this.state.y} />
      </div>
      <div>
        <label> diameter: </label>
        <input type='number' name='z' ref='z' min='0' max='100' onChange={this.handleChange} value={this.state.z} />
      </div>
      <div>
        <button onClick={this.handleAdd} disabled={!!this.state.error}>Add</button>
      </div>
    </div>;
  },
  handleAdd() {
    var roundsState = _.clone(this.props.appState);
    var round = new models.Round();
    var roundData = {
      id: !_.isEmpty(roundsState.data) ? _.last(roundsState.data).id + 1 : 1,
      x: this.refs.x.value,
      y: this.refs.y.value,
      z: this.refs.z.value
    };
    round.set(roundData);
    app.rounds.add(round);
    round.save();

    roundsState.data.push(roundData);
    this.props.setAppState(roundsState);
  },
  handleRemove(roundId) {
    var round = app.rounds.get(roundId);
    round.destroy();

    var roundsState = _.clone(this.props.appState);
    _.remove(roundsState.data, (round) => round.id === roundId);
    this.props.setAppState(roundsState);
  },
  handleChange(e) {
    this.setState({error: false});
    var appState = this.props.appState;
    if (e.target.name === 'z') {
      // validate that the sum of circles diameters cannot be larger than the viewport width
      var sum = _.reduce(appState.data, (result, round) => result + parseInt(round.z), 0);
      if ((sum + parseInt(e.target.value)) > appState.domain.x[1]) {
        this.setState({error: 'Error: Sum of circles diameters cannot be larger than the viewport width'});
      }
    }
    if (e.target.name === 'x' || e.target.name === 'y') {
      // validate corrdinates
      if (parseInt(e.target.value) > appState.domain[e.target.name][1] || parseInt(e.target.value) < appState.domain[e.target.name][0]) {
        this.setState({error: 'Error: This coordinates are outside the viewport'});
      }
    }
    this.setState({[e.target.name]: e.target.value});
  }
});

export default RoundsPage;