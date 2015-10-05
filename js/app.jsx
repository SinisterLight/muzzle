import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link, Route } from 'react-router'
import '../css/muzzle.css' // Try loading common css in html itself
import { AgentsStatus } from './agents'

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
  return <p>About</p>
}

const Agents = (props) => {
  var testData = [{'uid':'528ba2ef43ae','host_name':'vision','registered_at':'2015-09-04T17:07:00.914+05:30','updated_at':'2015-09-16T13:00:03.712+05:30','status':'online'},
    {'uid':'526ba2ef43ae','host_name':'ironlegion_message_queue','registered_at':'2015-09-04T17:07:00.914+05:30','updated_at':'2015-09-15T17:05:47.789+05:30','status':'online'},
    {'uid':'524ba2ef43ae','host_name':'jarvis_loadbalancer_nginx','registered_at':'2015-09-04T17:07:00.914+05:30','updated_at':'2015-09-15T17:05:47.789+05:30','status':'offline'}];
  return <AgentsStatus data={testData}/>
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
