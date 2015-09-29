import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from 'react-router'
import '../css/muzzle.css' // Try loading common css in html itself

const App = (props) => {
  return (
    <div>
      <Navbar />
      <br/>
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
          <Link to="/about" activeClassName="active" className="nav-link">About</Link>
      </li>
      <li className="nav-item">
	<Link to="/inbox" activeClassName="active" className="nav-link">Inbox</Link>
      </li>
      </ul>
    </nav>
  )
}

const About = (props) => {
  return <p>About</p>
}

const Inbox = (props) => {
  return <p>Inbox</p>
}

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    { path: 'about', component: About },
    { path: 'inbox', component: Inbox },
  ],
}

ReactDOM.render(
  <Router routes={routes} />,
  document.getElementById('muzzle')
)
