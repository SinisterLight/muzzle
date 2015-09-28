import React from 'react'
import ReactDOM from 'react-dom'


var Aquarium = (props) => {
  var getFish = (fish) => {
    return fish
  };
  var fish = getFish(props.species);
  return <p>{fish}</p>;
};

ReactDOM.render(
    <Aquarium species="Gold Fish" />,
  document.getElementById('example')
);
