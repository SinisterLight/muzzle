import React from 'react'
import { APIserver } from './../app'

export class Agent extends React.Component {
  constructor(props) {
    super(props);
    this.loadDataFromServer = this.loadDataFromServer.bind(this);
    this.state = {
      data: [],
    }
  }
  loadDataFromServer() {
    let url = APIserver+'/agents/'+this.props.params.uid;
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this),
    })
  }
  componentDidMount() {
    this.loadDataFromServer();
    this.intervalID = setInterval(this.loadDataFromServer, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  render() {
    return (
      <div>
        <br />
        <AgentDetails data={this.state.data} />
        <AgentCharts uid={this.props.params.uid} pollInterval={5000}/>
      </div>
    )
  }
}

const AgentDetails = (props) => {
  return (
    <div>
      <h4 style={{fontWeight: 700, display: 'inline'}}>{props.data.host_name}</h4>
      {'  '}
      <AgentStatus status={props.data.status} />
    </div>
  )
}

const AgentStatus = (props) => {
  const baseStyle = {
    padding: '0.4rem',
    borderRadius: '0.2rem',
    margin: '0.2rem',
    textTransform: 'uppercase',
    fontWeight: 600,
  }
  const styles = {
    online: {
      ...baseStyle,
      color:'#fff',
      backgroundColor:'#88cc88',
    },
    offline: {
      ...baseStyle,
      color:'#626466',
      backgroundColor:'#f5f5f5',
    },
  }
  return (
    <span style={styles[props.status]}>{props.status}</span>
  )
}

class AgentCharts extends React.Component {
  constructor(props) {
    super(props);
    this.loadDataFromServer = this.loadDataFromServer.bind(this);
    this.state = {
      data: [],
    }
  }
  loadDataFromServer() {
    $.ajax({
      url: APIserver+'/events?uid='+this.props.uid+'&policy_name=default_system_data',
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
        <CPUChart data={this.state.data}/>
        <RAMChart data={this.state.data}/>
        <DiskCharts data={this.state.data}/>
      </div>
    )
  }
}

class CPUChart extends React.Component {
  constructor(props) {
    super(props);
    this._renderChart = this._renderChart.bind(this);
  }
  _renderChart(d) {
    let x = ['x'];
    let cpu = ['cpu'];
    for (let i = 0; i < d.length; i++) {
      x[i+1] = new Date(d[i].Time);
      cpu[i+1] = d[i].Data.system.cpu.userspace;
    }
    this.chart = c3.generate({
      size: {
        // in pixels
        height: 150,
      },
      data: {
        x: 'x',
        columns: [x, cpu],
        types:{
          cpu: 'area-spline',
        },
      },
      point: {
        show: false,
      },
      axis: {
        y: {
          padding: {
            top: 0,
            bottom: 0,
          },
          tick: {
            count: 5,
          },
          max: 100,
          min: 0,
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%I:%M:%S', // format string is also available for timeseries data
          },
        },
      },
      legend: {
        show: false,
      },
      bindto: '#cpu-chart',
    });
  }
  componentDidMount() {
    this._renderChart(this.props.data);
  }
  componentWillReceiveProps(newProps) {
    this._renderChart(newProps.data);
    // this.chart.load(newProps.data); // TODO: need to pass modified data to c3
  }
  render() {
    const baseStyle = {
      margin: '0.6rem 0',
    }
    return (
      <div style={baseStyle}>
        <h5>CPU</h5>
        <div id="cpu-chart"></div>
      </div>
    )
  }
}

class RAMChart extends React.Component {
  constructor(props) {
    super(props);
  }
  _renderChart(d) {
    let x = ['x'];
    let ram = ['ram'];
    for (let i = 0; i < d.length; i++) {
      x[i+1] = new Date(d[i].Time);
      let m = d[i].Data.system.memory;
      let used = m.used-m.cached-m.buffers;
      let total = m.total;
      let p = used/total * 100;
      ram[i+1] = p.toFixed(2);
    }
    this.chart = c3.generate({
      size: {
        // in pixels
        height: 150,
      },
      data: {
        x: 'x',
        columns:[x, ram],
        types:{
          ram: 'area-spline',
        },
      },
      point: {
        show: false,
      },
      axis: {
        y: {
          padding: {
            top: 0,
            bottom: 0,
          },
          tick: {
            count: 5,
          },
          max: 100,
          min: 0,
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%I:%M:%S', // format string is also available for timeseries data
          },
        },
      },
      legend: {
        show: false,
      },
      color: {
        pattern: ['#ff7f0e'],
      },
      bindto: '#ram-chart',
    });
  }
  componentDidMount() {
    this._renderChart(this.props.data);
  }
  componentWillReceiveProps(newProps) {
    this._renderChart(newProps.data);
    // this.chart.load(newProps.data); // TODO: need to pass modified data to c3
  }
  render() {
    const baseStyle = {
      margin: '0.6rem 0',
    }
    return (
      <div style={baseStyle}>
        <h5>RAM</h5>
        <div id="ram-chart"></div>
      </div>
    )
  }
}

class DiskCharts extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const baseStyle = {
      margin: '0.6rem 0',
    }
    return (
      <div style={baseStyle}>
        <h5>Disks</h5>
      </div>
    )
  }
}
