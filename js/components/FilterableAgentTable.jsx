import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

export class FilterableAgentTable extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
	filterText: '',
      }
  }
  handleUserInput(filterText) {
    this.setState({
      filterText: filterText,
    })
  }
  render() {
    return (
      <div>
	<br />
	<h5>AGENTS</h5>
	<AgentSearchBar
		filterText={this.state.filterText}
		onUserInput={this.handleUserInput.bind(this)}
	/>
	<br />
	<AgentTable 
		agents={this.props.agents}
		filterText={this.state.filterText}
	/>
      </div>
    )
  }
}

class AgentSearchBar extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    console.log(ReactDOM.findDOMNode(this.refs.filterTextInput).value)
    this.props.onUserInput(ReactDOM.findDOMNode(this.refs.filterTextInput).value)
  }
  render() {
    return (
      <form className="form-inline">
	<div className="form-group">
	  <input 
		  style={{fontWeight: 500}}
		  type="text" 
		  className="form-control" 
		  ref="filterTextInput" 
		  placeholder="Filter by host name" 
		  onChange={this.handleChange}
	  />
	</div>
      </form>
    )
  }
}

class AgentTable extends React.Component {
  render() {
    var rows = []
    this.props.agents.forEach(
      (agent) => {
	if (agent.host_name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
	  return
	}
	rows.push(<AgentRow agent={agent} key={agent.uid} />)
      }
    )
      return (
	<table className="table">
	  <thead>
	    <tr>
	      <th>Host</th>
	      <th>Status</th>
	    </tr>
	  </thead>
	  <tbody>{rows}</tbody>
	</table>
      )
  }
}

class AgentRow extends React.Component {
  render() {
    var agentLink = '/agents/'+this.props.agent.uid
    var styles = {
      online: {
	padding: '0.4rem',
	color:'#fff',
	backgroundColor:'#6cc644',
	borderRadius: '0.2rem',
      },
      offline: {
	padding: '0.4rem',
	color:'#fff',
	backgroundColor:'#d32f2f',
	borderRadius: '0.2rem',
      },
    }
    return(
      <tr>
	<td><Link to={agentLink}>{this.props.agent.host_name}</Link></td>
	<td>{(this.props.agent.status === 'online')?<span style={styles.online}>ONLINE</span>:<span style={styles.offline}>OFFLINE</span>}</td>
      </tr>
    )
  }
}
