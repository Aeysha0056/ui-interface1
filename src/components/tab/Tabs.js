import React from "react";
import _ from "lodash";

import TabContent from "./TabContent";
import { TabText } from "../Text";

import "../../styles/MainPage.css";

class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      fetching: false
    };
  }

  componentWillMount() {
    this.getTabsInfo();
  }

  getTabsInfo = () => {
    this.setState({ fetching: true });

    let requestBody = {
      query: `
        {
          tabs { name
            section { name type
              values { name view { values type } }
            }
          }
        }`
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          this.setState({
            fetching: false,
            errorMsg: "Server response not received."
          });
        }
        return res.json();
      })
      .then(resData => {
        let tabs = resData.data.tabs;
        this.arrayHandler(tabs);
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
      });
  };

  /**
   * add a click flag for each value in section object
   *
   * @param  {array} data
   */
  arrayHandler = data => {
    let tabs = [];
    for (var i = 0; i < data.length; i++) {
      let section = data[i].section;
      let values = section.values.map(value => {
        // update views obj
        if (value.view) {
          let view = value.view.values.map(view => {
            return { name: view, clicked: false };
          });
          return { ...value, type: value.view.type, view, clicked: false };
        } else {
          return { ...value, clicked: false };
        }
      });

      data[i].section.values = values;
      tabs.push(data[i]);
      if (data[i].name.toLowerCase() === "type") {
        // make the "Type" tab at the beginning, by reversing the array
        tabs = _.reverse(tabs);
      }
    }

    tabs.push({ name: "State", section: { name: "state", clicked: false } }); // push the last tab
    this.setState({ tabs, fetching: false });
  };

  handleTabChanges = tab => {
    this.setState({ selectedTab: tab });
  };

  render() {
    return (
      <div className="col-12">
        {/** Tab Bar */}
        <div className="row justify-content-center align-content-center mx-2">

          {/** fetching feedback */}
          {this.state.fetching && (
            <span className="light-creamy-text small-font">Loading ...</span>
          )}

          {!this.state.fetching && this.state.tabs.length === 0 && (
            <span className="light-creamy-text small-font">
              {this.state.errorMsg}
            </span>
          )}

          {/** Tab bar */}
          {this.state.tabs.map((tab, index) => (
            <TabText
              key={index}
              text={tab.name}
              isSelected={
                this.state.selectedTab &&
                this.state.selectedTab.name === tab.name
              }
              isLastTab={index === this.state.tabs.length - 1}
              onClick={() => this.handleTabChanges(tab)}
            />
          ))}
        </div>

        {/** divider */}
        <div className="row justify-content-center align-content-center">
          <div className="bottom-border" />
        </div>

        {/** Tab Content */}
        {this.state.selectedTab && (
          <TabContent selectedTab={this.state.selectedTab} />
        )}
      </div>
    );
  }
}

export default TabBar;
