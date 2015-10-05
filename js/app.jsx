import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from 'react-router'
import '../css/muzzle.css' // Try loading common css in html itself
import { AgentsStatus } from './agents.jsx'

const App = (props) => {
  return (
    <div>
      <Navbar />
      <div className="container">
	<div>
	  {props.children}
	</div>
      </div>
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
        <Link to="/about" activeClassName="active" className="nav-link">About</Link>
      </li>
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

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    { path: 'agents', component: Agents },
    { path: 'about', component: About },
  ],
}

ReactDOM.render(
  <Router routes={routes} />,
  document.getElementById('muzzle')
)
