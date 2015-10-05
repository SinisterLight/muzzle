import React from 'react'

export const AgentsStatus = (props) => {
  return (
    <div style={{margin: '1rem'}}>
      <div style={{fontSize:'1.2rem',fontWeight:600,textTransform:'uppercase',padding:'1rem'}}>Agents</div>
      <table className="table">
	<thead>
	  <tr>
	    <th>Host</th>
	    <th>Status</th>
	  </tr>
	</thead>
	<tbody>
	  {
	    props.data.map(
	      (result) => {
	            return <AgentWrapper key={result.uid} data={result}/>
	      }
	    )
	  }
	</tbody>
      </table>
    </div>
  );
};

const AgentWrapper = (props) => {
  var agentLink = 'agent.html?uid='+props.data.uid;
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
  };
  return(
    <tr>
      <td><a href={agentLink}>{props.data.host_name}</a></td>
      <td>{(props.data.status === 'online')?<span style={styles.online}>ONLINE</span>:<span style={styles.offline}>OFFLINE</span>}</td>
    </tr>
  );
};
