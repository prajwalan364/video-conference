import React from 'react';
import { useHistory } from 'react-router-dom';
import { v4 } from 'uuid';

const Home = () => {
  const history = useHistory();

  const routeChange = () => {
    let path = `${v4()}`;
    history.push(path);
  };

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <div>
      <h1>Start A Meeting</h1>
      <input
        placeholder="Enter Url"
        type="text"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <input type="text" placeholder="enter your name" />
      <button>Go</button>
      <button onClick={routeChange}>Start</button>
    </div>
  );
};

export default Home;
