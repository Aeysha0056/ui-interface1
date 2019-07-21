import React from "react";

import "./App.css";

import MainPage from "./MainPage";
import "bootstrap/dist/css/bootstrap.css";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<MainPage/>);
  }
}

export default App;
