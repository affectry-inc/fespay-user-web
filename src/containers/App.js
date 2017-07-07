import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'

import Header from '../components/Header'
import MainMenu from '../components/MainMenu'
import Alert from '../components/Alert'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import fespayTheme from '../fespayTheme';
import * as AppActions from '../actions/app'

import classnames from 'classnames';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {mainMenuOpen: false};
  }

  static get childContextTypes() {
    return {muiTheme: PropTypes.object.isRequired};
  }

  getChildContext(){
    return {muiTheme: getMuiTheme(fespayTheme)};
  }

  toggleMainMenu = () => this.setState({mainMenuOpen: !this.state.mainMenuOpen});
  closeMainMenu = () => this.setState({mainMenuOpen: false});

  render() {
    const { actions, alertOpen, alertMessage } = this.props

    return (
      <div>
        <Header
          mainMenuOpen={this.state.mainMenuOpen}
          toggleMainMenu={this.toggleMainMenu}
        />
        <MainMenu
          mainMenuOpen={this.state.mainMenuOpen}
          closeMainMenu={this.closeMainMenu}
        />
        <div className={classnames('app-content', {'expanded': this.state.mainMenuOpen})}>
          {this.props.children}
        </div>
        <Alert
          onCloseAlert={ actions.closeAlert }
          open={ alertOpen }
          message={ alertMessage }
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    alertOpen: state.app.alertOpen,
    alertMessage: state.app.alertMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
