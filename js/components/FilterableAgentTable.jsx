import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { APIserver } from './../app'

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

const AgentGrid = (props) => {
  let rows = [];
  props.agents.forEach(
    (agent) => {
      if ((agent.host_name.toLowerCase().indexOf(props.filterText.toLowerCase()) === -1) || ((agent.status == 'online') && props.offlineOnly)) {
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

class AgentBox extends React.Component {
  render() {
    let agentLink = '/agents/'+this.props.agent.uid;
    const baseStyle = {
      padding: '0.4rem',
      borderRadius: '0.2rem',
      margin: '0.2rem',
    }
    const styles = {
      online: {
        ...baseStyle,
        color:'#004400',
        backgroundColor:'#88cc88',
      },
      offline: {
        ...baseStyle,
        color:'#626466',
        backgroundColor:'#f5f5f5',
      },
      hostname: {
        fontWeight: '700',
        width:'100%',
        borderRadius:'0.2rem',
      },
    };
    return(
      <Link to={agentLink} style={{textDecoration:'none'}}>
      <div className="col-md-3" style={styles[this.props.agent.status]}>
        <div style={styles.hostname}>{this.props.agent.host_name}</div>
        <SummarizedSystemData uid={this.props.agent.uid} status={this.props.agent.status} pollInterval={2000}/>
      </div>
      </Link>
    )
  }
}

class SummarizedSystemData extends React.Component {
  constructor(props) {
    super(props);
    this.loadDataFromServer = this.loadDataFromServer.bind(this);
    this.state = {
      data: [],
    }
  }
  loadDataFromServer() {
    $.ajax({
      url: APIserver+'/api/events?uid='+this.props.uid+'&policy_name=default_system_data',
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
    return (
      <div>
        <MemoryData status={this.props.status} data={this.state.data}/>
        <CPUData status={this.props.status} data={this.state.data}/>
        <DiskData status={this.props.status} data={this.state.data}/>
      </div>
    )
  }
}

const MemoryData = (props) => {
  if (props.status === 'offline' ||props.data === null || props.data.length === 0) {
    return <div>Memory used <b className="pull-right" title="Not Available">NA</b></div>
  } else {
    let m = props.data[props.data.length-1].Data.system.memory;
    // We are not counting cached and buffer memory in used memory.
    // htop does the same thing.
    // check http://askubuntu.com/a/369589 and http://www.linuxatemyram.com/
    // TODO: Should we move this logic to the API?
    let used = m.used-m.cached-m.buffers;
    let total = m.total;
    let p = used/total * 100;
    return <div>Memory used <b className="pull-right">{p.toFixed(2)} %</b></div>
  }
}

const CPUData = (props) => {
  if (props.status === 'offline' ||props.data === null || props.data.length === 0) {
    return <div>Userspace CPU <b className="pull-right" title="Not Available">NA</b></div>
  } else {
    let c = props.data[props.data.length-1].Data.system.cpu;
    return <div>Userspace CPU <b className="pull-right">{c.userspace.toFixed(2)} %</b></div>
  }
}

const DiskData = (props) => {
  if (props.status === 'offline' ||props.data === null || props.data.length === 0) {
    return <div>Disk usage <b className="pull-right" title="Not Available">NA</b></div>
  } else {
    let c = props.data[props.data.length-1].Data.system.disk;
    let sda1p = c['/dev/sda1'].percentage_used
    return <div>{'/dev/sda1'} <b className="pull-right">{sda1p.slice(0,sda1p.length-1)} %</b></div>
  }
}
