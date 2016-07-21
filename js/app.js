import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import CirclesPage from './circles';
import '../styles/styles.less';

class App {
  initialize() {
    var RootComponent = React.createClass({
      render() {
        return <CirclesPage />;
      }
    });
    ReactDOM.render(
      <RootComponent />,
      $('#main-container')[0]
    );
  }
}

window.app = new App();

$(() => app.initialize());

export default app;
