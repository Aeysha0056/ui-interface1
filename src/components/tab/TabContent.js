import React from "react";
import { inject, observer } from "mobx-react";
import { EntypoCheck } from "react-entypo-icons";
import _ from "lodash";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { ListTitle, ListText } from "../Text";

@inject("store")
@inject("drawing")
@observer
class TabContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };
  }

  componentWillReceiveProps(nextProps) {
    let { section } = nextProps.selectedTab;
    this.sectionDataHandler(section);
  }

  /**
   * display the section content based on the selected crop
   *
   * @param  {Object} section
   */
  sectionDataHandler = section => {
    let { store, selectedTab } = this.state;

    // no selected crop
    if (!store.selected) {
      this.setState({ section, secondryList: null });
      return;
    }

    let selectedCropComp = store.components[store.selected];
    let data = selectedCropComp.data
      ? selectedCropComp.data[section.name]
      : null;

    if (section.name === "state") {
      section.clicked = data ? data : false;
      this.setState({ section });
      return;
    }

    let values = section.values;
    for (var i = 0; i < values.length; i++) {
      // no prev data
      if (!data) {
        values[i].clicked = false;
        continue;
      }

      // main list update
      if (section.type === "single") {
        values[i].clicked = values[i].name === data.name;
      } else {
        let index = data.findIndex(item => item.name === values[i].name);
        values[i].clicked = index !== -1;
      }

      // secondryList update
      // if (!values[i].view) continue;
      // for (var j = 0; j < values[i].view.length; j++) {
      //   let item;
      //
      //   if (section.type === "single") {
      //     item = data;
      //   } else {
      //     item = data.find(item => item.name === values[i].name);
      //   }
      //
      //   if (!item || !item.view) {
      //     values[i].view[j].clicked = false;
      //   } else {
      //     values[i].view[j].clicked = item.view === values[i].view[j].name;
      //   }
      // }
    }

    section.values = values;
    this.setState({ section, secondryList: null });
  };

  /**
   * mark the selected item as clicked
   * and update the secondry list based on selected item
   *
   * @param  {Object} item
   * @param  {Number} index
   */
  mainListHandler = (item, index) => {
    let { section, secondryList, store } = this.state;
    let selectedCropId = store.selected;
    let selectedCropComp = store.components[selectedCropId];
    let name = section.name;

    if (!selectedCropId) {
      alert("Please select a crop!");
      return;
    }

    if (selectedCropComp.crop.type === "") {
      alert("Please first select if a crop dynamic or fixed?");
      return;
    }

    if (section.type === "single") {
      // only mark the selected item as clicked
      section.values.map((value, i) => {
        value.clicked = i === index;
        if (i !== index && value.view) {
          // clear prev clicked
          value.view.map(v => (v.clicked = false));
        }
        return { ...value };
      });

      this.state.store.update(selectedCropId, "data", {
        [name]: { name: item.name }
      });
    } else {
      // mark the item as clicked
      section.values[index].clicked = !section.values[index].clicked;

      if (section.values[index].clicked) {
        // insert item
        if (selectedCropComp.data && selectedCropComp.data[name]) {
          let selectedCropPrevData = selectedCropComp.data[name];
          let selectedCropData = _.concat(selectedCropPrevData, {
            name: item.name
          });

          this.state.store.update(selectedCropId, "data", {
            [name]: selectedCropData
          });
        } else {
          this.state.store.update(selectedCropId, "data", {
            [name]: [{ name: item.name }]
          });
        }
      } else {
        // remove item from main list
        let data = selectedCropComp.data[name];
        _.remove(data, n => n.name === item.name);
        this.state.store.update(selectedCropId, "data", {
          [name]: data
        });

        // clear the secondryList
        _.forEach(item.view, i => {
          i.clicked = false;
        });
      }
    }

    // update the secondry list
    if (item.view) {
      secondryList = item;
    } else {
      secondryList = [];
    }

    this.setState({ secondryList, section });
    this.sendData()
  };

  /**
   *  mark the selected item as clicked in secondryList
   *
   * @param  {Object} item
   * @param  {Number} index
   */
  updateSecondryList = (item, index) => {
    let { secondryList, store, section } = this.state;
    let selectedCropId = store.selected;
    let selectedCropComp = store.components[selectedCropId];
    let name = section.name;

    if (secondryList.type === "single") {
      // mark the selected item as clicked
      let view = secondryList.view.map((view, i) => {
        view.clicked = i === index;
        return { ...view };
      });
      secondryList.view = view;

      if (section.type === "single") {
        this.state.store.update(selectedCropId, "data", {
          [section.name]: {
            name: secondryList.name,
            view: secondryList.view[index].name
          }
        });
      } else {
        let arr = selectedCropComp.data[name].map(e => {
          if (e.name === secondryList.name) {
            e.view = item.name;
            return e;
          }
          return e;
        });

        this.state.store.update(selectedCropId, "data", {
          [section.name]: arr
        });
      }
    } else {
      // mark the item as cheacked
      secondryList.view[index].clicked = !secondryList.view[index].clicked;

      if (secondryList.view[index].clicked) {
        if (selectedCropComp.data && selectedCropComp.data[name]) {
          // update the store data of selected crop based on the type

          if (section.type === "single") {
            let views = selectedCropComp.data[name].view
              ? _.concat(
                  selectedCropComp.data[name].view,
                  secondryList.view[index].name
                )
              : [secondryList.view[index].name];

            this.state.store.update(selectedCropId, "data", {
              [section.name]: {
                name: secondryList.name,
                view: views
              }
            });
          } else {
            let arr = selectedCropComp.data[name].map(e => {
              if (e.name === secondryList.name) {
                let views = e.view ? _.concat(e.view, item.name) : [item.name];
                e.view = views;
                return e;
              }
              return e;
            });

            this.state.store.update(selectedCropId, "data", {
              [section.name]: arr
            });
          }
        }
      } else {
        // remove item from view list

        if (section.type === "single") {
          let data = selectedCropComp.data[name];
          _.remove(data.view, n => n === item.name);
          this.state.store.update(selectedCropId, "data", {
            [section.name]: data
          });

        } else {
          let arr = selectedCropComp.data[name].map(e => {
            if (e.name === secondryList.name) {
              _.remove(e.view, n => n === item.name);
              return e;
            }
            return e;
          });

          this.state.store.update(selectedCropId, "data", {
            [section.name]: arr
          });
        }
      }
    }

    this.setState({ secondryList });
    this.sendData()
  };

  hasState = () => {
    let { section, store } = this.state;
    section.clicked = !section.clicked;
    this.setState({ section });

    let selectedCropId = store.selected;
    this.state.store.update(selectedCropId, "data", {
      state: section.clicked
    });
    this.sendData()
  };

  /**
   * send store data to db
   */
  sendData = () => {
    let { store } = this.state;
    let components = this.state.store.components;
    delete components.selected;

    fetch("http://localhost:5000/import/" + store.imageId, {
      method: "PUT",
      body: JSON.stringify({ store: components }),
      headers: {
        "Content-Type": "application/json"
      }
    }).catch(err => {
      alert(
        "could't send updated data, please make sure you import an image \n or check your internet connection"
      );
    });
  };

  render() {
    let { section, secondryList } = this.state;
    // no data
    if (!section) return null;

    // state section
    if (section.name === "state")
      return (
        <StateSection
          isClicked={section.clicked}
          onClick={() => this.hasState()}
        />
      );

    return (
      <div className="col-11 pt-3">
        {/** main list */}
        <div className="top-section mb-3">
          <ListTitle text={section.name} />
          <List dense className="list pr-4">
            {section.values.map((item, i) => (
              <Item
                key={i}
                type={section.type}
                index={i}
                item={item}
                onClick={() => this.mainListHandler(item, i)}
                handleCheckBoxChanges={() => this.mainListHandler(item, i)}
              />
            ))}
          </List>
        </div>

        {/** Secondry list */}
        {secondryList && secondryList.view && secondryList.view.length !== 0 && (
          <div className="bottom-section">
            <div className="row ml-1 justify-content-center align-content-center">
              <div className="top-border" />
            </div>
            <ListTitle text={secondryList.name} />
            <List dense className="list list-height pr-4 mb-5n">
              {secondryList.view.map((item, i) => (
                <Item
                  key={i}
                  index={i}
                  item={item}
                  type={secondryList.type}
                  onClick={() => this.updateSecondryList(item, i)}
                  handleCheckBoxChanges={() => this.updateSecondryList(item, i)}
                />
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}
export default TabContent;

const Item = ({ type, index, item, onClick, handleCheckBoxChanges }) => (
  <ListItem button className="list-item my-1" onClick={onClick}>
    <ListText text={item.name} isSelected={item.clicked} />
    {type === "multi" && (
      <ListItemSecondaryAction>
        <div className="checkbox justify-content-center align-content-center">
          <label>
            <input
              type="checkbox"
              value={item.clicked}
              checked={item.clicked}
              onChange={handleCheckBoxChanges}
            />
            <span className="cr">
              <EntypoCheck className="cr-icon" />
            </span>
          </label>
        </div>
      </ListItemSecondaryAction>
    )}
  </ListItem>
);

const StateSection = ({ isClicked, onClick }) => (
  <div
    className="row justify-content-center align-content-center mt-3"
    onClick={onClick}
  >
    <div className="checkbox">
      <label>
        <input type="checkbox" checked={isClicked} onChange={onClick} />
        <span className="cr">
          <EntypoCheck className="cr-icon" />
        </span>
      </label>
    </div>
    <span className="state-text">True or False</span>
  </div>
);
