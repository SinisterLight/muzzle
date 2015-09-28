import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from 'react-router'
import '../css/muzzle.css' // Try loading common css in html itself

const App = (props) => {
  return (
      <div>
      <br/>
      <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/inbox">Inbox</Link></li>
      </ul>
      {props.children}
    </div>
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
  document.getElementById('example')
)
