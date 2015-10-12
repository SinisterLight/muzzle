import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link, Route } from 'react-router'
import '../css/muzzle.css' // Try loading common css in html itself
import { FilterableAgentTable } from './components/FilterableAgentTable'

const App = (props) => {
  return (
    <div>
      <Navbar />
      <div className="container">
	<div>
	  {props.children || <Home/>}
	</div>
      </div>
    </div>
  )
}

const Home = (props) => {
  var styles = {
    errorBox: {
      marginLeft: '25%',
      marginRight: '25%',
      position: 'absolute',
      textAlign: 'center',
      top: '40%',
    },
  }
  return (
    <div style={styles.errorBox}>
      <h2>Welcome to Recon</h2>
      <p>
	Defaut dashboard?
      </p>
    </div>
  )
}

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-default navbar-static-top">
      <Link to="/" className="navbar-brand">
      <img className="recon-nav-logo" src="static/recon-logo-85x23.png" />
      </Link>
      <ul className="nav nav-pills">
        <li className="nav-item">
	  <Link to="/agents" activeClassName="active" className="nav-link">Agents</Link>
      </li>
      <li className="nav-item">
        <Link to="/dashboards" activeClassName="active" className="nav-link">Dashboards</Link>
      </li>
      <li className="nav-item">
        <Link to="/about" activeClassName="active" className="nav-link">About</Link>
      </li>
      <div className="pull-right dropdown">
	<button className="btn btn-primary-outline dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	  Hari haran
	</button>
	<div className="dropdown-menu" aria-labelledby="dropdownMenu1">
	  <Link className="dropdown-item" to="/profile">Profile</Link>
	  <Link className="dropdown-item" to="/settings">Settings</Link>
	  <Link className="dropdown-item" to="/logout">Log Out</Link>
	</div>
      </div>
      </ul>
    </nav>
  )
}

const About = (props) => {
  var styles = {
    errorBox: {
      marginLeft: '25%',
      marginRight: '25%',
      position: 'absolute',
      textAlign: 'center',
      top: '40%',
    },
  }
  return (
    <div style={styles.errorBox}>
      <h2>About</h2>
      <p>Recon is the brainchild of the people at <a href="http://codeignition.co">CodeIgnition</a>. Recon is completely opensource and aims to make monitoring simple and intuitive. If you have any issues / suggestions, please open an issue at <a href="https://github.com/codeignition/recon/issues/new">our Github repository.</a></p>
    </div>
  )
}

class Agents extends React.Component {
  render() {
    return <AgentTableWrapper source="http://192.168.1.119:3000/api/agents" pollInterval={2000}/>
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
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    })
  }
  componentDidMount() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
  }
  render() {
    return <FilterableAgentTable agents={this.state.data}/>
  }
}

const Agent = (props) => {
  return (
    <p>Agent {props.params.uid}</p>
  )
}

const NoMatch = (props) => {
  var styles = {
    errorBox: {
      marginLeft: '25%',
      marginRight: '25%',
      position: 'absolute',
      textAlign: 'center',
      top: '40%',
    },
  }
  return (
    <div style={styles.errorBox}>
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
      <Route path="agents/:uid" component={Agent} />
      <Route path="about" component={About} />
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
  document.getElementById('muzzle')
)
