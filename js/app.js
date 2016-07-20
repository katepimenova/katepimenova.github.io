import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import CirclesPage from './circles';
import models from './models';
import '../styles/styles.less';

class App {
  constructor() {
    this.circles = new models.Circles();
  }

  initialize() {
    this.circles.fetch()
      .then((data) => {
        var RootComponent = React.createClass({
          render() {
            return <CirclesPage circlesCollection={data} />;
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
