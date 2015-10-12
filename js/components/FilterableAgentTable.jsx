import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

export class FilterableAgentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      offlineOnly: false,
    }
  }
  handleUserInput(filterText, offlineOnly) {
    this.setState({
      filterText: filterText,
      offlineOnly: offlineOnly,
    })
  }
  render() {
    return (
      <div className="container">
        <br />
        <h5>AGENTS</h5>
        <AgentSearchBar
                filterText={this.state.filterText}
                offlineOnly={this.state.offlineOnly}
                onUserInput={this.handleUserInput.bind(this)}
        />
        <br />
        <AgentGrid
                agents={this.props.agents}
                filterText={this.state.filterText}
                offlineOnly={this.state.offlineOnly}
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
    console.log(ReactDOM.findDOMNode(this.refs.filterTextInput).value); // delete this
    this.props.onUserInput(
      ReactDOM.findDOMNode(this.refs.filterTextInput).value,
      ReactDOM.findDOMNode(this.refs.offlineOnlyInput).checked
    )
  }
  render() {
    return (
      <form className="form-inline">

        <div className="form-group" style={{marginRight: '1rem'}}>
          <input
                  style={{fontWeight: 500}}
                  type="text"
                  className="form-control"
                  ref="filterTextInput"
                  placeholder="Filter by host name"
                  onChange={this.handleChange}
          />
        </div>
        <div className="checkbox">
          <label>
            <input
                    type="checkbox"
                    checked={this.props.offlineOnly}
                    ref="offlineOnlyInput"
                    onChange={this.handleChange}
            />
            {' '}
            Only show offline agents
          </label>
        </div>
      </form>
    )
  }
}

class AgentGrid extends React.Component {
  render() {
    var rows = [];
    this.props.agents.forEach(
      (agent) => {
        if ((agent.host_name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) || ((agent.status == 'online') && this.props.offlineOnly)) {
          return
        }
        rows.push(<AgentBox agent={agent} key={agent.uid} />)
      }
    );
    return (
      <div>
      {rows}
      </div>
    )
  }
}

class AgentBox extends React.Component {
  render() {
    var agentLink = '/agents/'+this.props.agent.uid;
    var styles = {
      online: {
        padding: '0.4rem',
        color:'#004400',
        backgroundColor:'#88cc88',
        borderRadius: '0.2rem',
        margin: '0.2rem',
      },
      offline: {
        padding: '0.4rem',
        color:'#550000',
        backgroundColor:'#ffaaaa',
        borderRadius: '0.2rem',
        margin: '0.2rem',
      },
      hostname: {
        offline: {
          fontWeight: '700',
          width:'100%',
          borderRadius:'0.2rem',
        },
        online: {
          fontWeight: '700',
          width:'100%',
          borderRadius:'0.2rem',
        },
      },
    };
    return(
      <Link to={agentLink}>
      <div className="col-md-3" style={styles[this.props.agent.status]}>
        <div style={styles.hostname[this.props.agent.status]}>{this.props.agent.host_name}</div>
        <div>{this.props.agent.status}</div><MemoryPercentage uid={this.props.agent.uid} status={this.props.agent.status} pollInterval={2000}/>
      </div>
      </Link>
    )
  }
}

class MemoryPercentage extends React.Component {
  constructor(props) {
    super(props);
    this.loadDataFromServer = this.loadDataFromServer.bind(this);
    this.state = {
      data: [],
    }
  }

  loadDataFromServer() {
    $.ajax({
      url: 'http://192.168.1.119:3000/api/events?uid='+this.props.uid+'&policy_name=default_system_data',
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
    if (this.props.status === 'offline' ||this.state.data === null || this.state.data.length === 0) {
      return  <p>Memory: unknown</p>
    } else {
      var m = this.state.data[this.state.data.length-1];
      var activeMemory = m.Data.memory.active.substring(0,m.Data.memory.active.length-3);
      var totalMemory = m.Data.memory.total.substring(0,m.Data.memory.total.length-3);
      var activeMemPercentage = activeMemory/totalMemory * 100;
      return  <p>Memory: {activeMemPercentage.toFixed(2)} %</p>
    }
  }
}
