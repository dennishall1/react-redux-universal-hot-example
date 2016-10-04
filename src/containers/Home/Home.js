import React, { Component } from 'react';
import { Link } from 'react-router';
import config from 'config';
import Helmet from 'react-helmet';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home" />
        <div className={styles.masthead}>
          <Link to="/product/Devil-Egg-Tray">Devil Egg Tray</Link>
        </div>
      </div>
    );
  }
}
