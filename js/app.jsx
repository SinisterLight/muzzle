import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link, Route } from 'react-router'
import { FilterableAgentTable } from './components/FilterableAgentTable'
import { Agent } from './components/Agent'

import '../css/muzzle.css'

export const APIserver = 'http://localhost:3456/api'

const App = (props) => {
  return (
    <div>
      <br />
      <center><Link to="/"><img className="recon-nav-logo" src="static/recon-logo-85x23.png" /></Link></center>
      <div className="container">
        <div>{props.children || <Agents />}</div>
      </div>
    </div>
  )
}

class Agents extends React.Component {
  render() {
    return <AgentTableWrapper source={APIserver+'/agents'} pollInterval={2000}/>
  }
}

class AgentTableWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.loadDataFromServer = this.loadDataFromServer.bind(this);
    this.state = {
      data: [],
    }
  }
  loadDataFromServer() {
    $.ajax({
      url: this.props.source,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.source, status, err.toString());
      }.bind(this),
    })
  }
  componentDidMount() {
    this.loadDataFromServer();
    this.intervalID = setInterval(this.loadDataFromServer, this.props.pollInterval);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  render() {
    return <FilterableAgentTable agents={this.state.data}/>
  }
}

const NoMatch = (props) => {
  const s = {
    marginLeft: '25%',
    marginRight: '25%',
    position: 'absolute',
    textAlign: 'center',
    top: '30%',
  }
  return (
    <div style={s}>
      <h2>Sorry, this page isn't available.</h2>
      <p>
        The link you followed may be broken, or the page may have been removed.
      </p>
      <p><Link to="/" className="btn btn-primary">Go back to Home.</Link></p>
    </div>
  )
}

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <Route path="agents" component={Agents} />
      <Route path="agents/:uid" component={Agent}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
  document.getElementById('muzzle')
)
