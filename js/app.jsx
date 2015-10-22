import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Link, Route, History } from 'react-router'
import { createHashHistory } from 'history'
import '../css/muzzle.css' // Try loading common css in html itself
import { FilterableAgentTable } from './components/FilterableAgentTable'
import { Auth } from './auth'

export const APIserver = 'http://192.168.1.119:3000'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: Auth.loggedIn(),
    }
    this.updateAuth = this.updateAuth.bind(this);
  }
  updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn,
    })
  }
  componentWillMount() {
    Auth.onChange = this.updateAuth
    Auth.login()
  }
  render() {
    let c;
    // let authToken = Auth.getToken();
    let userEmail = Auth.getEmail();
    if (this.state.loggedIn) {
      c = (
        <div>
          <Navbar email={userEmail}/>
          <div className="container">
            <div>{this.props.children || <Home/>}</div>
          </div>
        </div>
      )
    } else {
      c = <Link to="/login">Sign in</Link>
    }
    return (
      <div>
        {c}
      </div>
    )
  }
}

const Home = (props) => {
  const s = {
    marginLeft: '25%',
    marginRight: '25%',
    position: 'absolute',
    textAlign: 'center',
    top: '40%',
  }
  return (
    <div style={s}>
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
      <Link to="/" className="navbar-brand"><img className="recon-nav-logo" src="static/recon-logo-85x23.png" /></Link>
      <ul className="nav nav-pills">
        <li className="nav-item"><Link to="/agents" activeClassName="active" className="nav-link">Agents</Link></li>
        <li className="nav-item"><Link to="/dashboards" activeClassName="active" className="nav-link">Dashboards</Link></li>
        <li className="nav-item"><Link to="/about" activeClassName="active" className="nav-link">About</Link></li>
      </ul>
      <div className="pull-right dropdown">
	<button className="btn btn-primary-outline dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {props.email}
	</button>
	<div className="dropdown-menu" aria-labelledby="dropdownMenu1">
	  <Link className="dropdown-item" to="/profile">Profile</Link>
	  <Link className="dropdown-item" to="/settings">Settings</Link>
	  <Link className="dropdown-item" to="/logout">Log Out</Link>
	</div>
      </div>
    </nav>
  )
}

const About = (props) => {
  const s = {
    margin: '0 auto',
    padding: '4rem',
    position: 'absolute',
  }
  return (
    <div style={s}>
      <h2>About</h2>
      <p>Recon is the brainchild of the people at <a href="http://codeignition.co">CodeIgnition</a>. Recon is completely opensource and aims to make monitoring simple and intuitive. If you have any issues / suggestions, please open an issue at <a href="https://github.com/codeignition/recon/issues/new">our Github repository.</a></p>
    </div>
  )
}

class Agents extends React.Component {
  render() {
    return <AgentTableWrapper source={APIserver+'/api/agents'} pollInterval={2000}/>
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
    this.intervalID = setInterval(this.loadDataFromServer, this.props.pollInterval);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
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
  const s = {
    marginLeft: '25%',
    marginRight: '25%',
    position: 'absolute',
    textAlign: 'center',
    top: '40%',
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

class Logout extends React.Component {
  componentDidMount() {
    Auth.logout()
  }
  render() {
    let s = {
      margin: '20%',
    }
    return (
      <div className="container" style={s}>
        <center><h3>You are now logged out!</h3><Link to="/login" className="btn btn-primary">Log In</Link></center>
      </div>
    )
  }
}


var Login = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return {
      error: false,
    }
  },

  handleSubmit(event) {
    event.preventDefault();

    let email = ReactDOM.findDOMNode(this.refs.email).value
    let pass =  ReactDOM.findDOMNode(this.refs.pass).value

    Auth.login(email, pass, (loggedIn) => {
      if (!loggedIn) {
        return this.setState({ error: true })
      }

      let { location } = this.props

      if (location.state && location.state.nextPathname) {
        if (location.state.nextPathname === '/') {
          this.history.replaceState(null, '/agents')
        } else {
          this.history.replaceState(null, location.state.nextPathname)
        }
      } else {
        this.history.replaceState(null, '/agents')
      }
    })
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row" style={{marginTop: '5%'}}></div>
        <div className="row">
          <div className="col-md-4">
          </div>
          <div className="col-md-4"  style={{backgroundColor: '#f5f5f5', borderRadius: '0.3rem'}}>
            <br />
            <img className="recon-nav-logo" src="static/recon-logo-85x23.png" />
            <form onSubmit={this.handleSubmit}>
              <fieldset className="form-group" style={{marginBottom: 0}}>
                <label></label>
                <input ref="email" name="email" type="email" placeholder="Email" className="form-control" autoFocus="true"/>
              </fieldset>
              <fieldset className="form-group">
                <label></label>
                <input ref="pass" name="password" type="password" placeholder="Password" className="form-control" />
              </fieldset>
              <button type="submit" className="btn btn-primary">Log In</button>
              {
               this.state.error && (
                 <p>Bad login information</p>
               )
              }
            </form>
            <br />
            <p>
              Don't have an account? <Link to="/register">Register here!</Link>
            </p>
          </div>
          <div className="col-md-4">
          </div>
        </div>
      </div>
    )
  },
});

const Register = (props) => {
  return (
    <p> Registration page </p>
  )
}

function requireAuth(nextState, replaceState) {
  if (!Auth.loggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

const history = createHashHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path="login" component={Login} />
    <Route path="logout" component={Logout} />
    <Route path="register" component={Register} />
    <Route path="about" component={About} />
    <Route path="/" component={App} onEnter={requireAuth}>
      <Route path="agents" component={Agents} />
      <Route path="agents/:uid" component={Agent}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
  document.getElementById('muzzle')
)
