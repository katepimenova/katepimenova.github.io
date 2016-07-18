import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import RoundsPage from './rounds';
import models from './models';
import '../styles/styles.less';

class App {
  constructor() {
    this.rounds = new models.Rounds();
  }

  initialize() {
    this.rounds.fetch()
      .then((data) => {
        var RootComponent = React.createClass({
          render() {
            return (
              <div id='content-wrapper'>
                <RoundsPage roundsCollection={data} />
              </div>
            );
          }
        });
        ReactDOM.render(
          <RootComponent />,
          $('#main-container')[0]
        );
      });
  }
}

window.app = new App();

$(() => app.initialize());

export default app;
