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
      if (!values[i].view) continue;

      for (var j = 0; j < values[i].view.length; j++) {
        let a = data.find(item => item.name === values[i].name);

        if (!a || !a.view) {
          values[i].view[j].clicked = false;

        } else {
          values[i].view[j].clicked = a.view === values[i].view[j].name;
        }
      }
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

    if (section.type === "single") {
      // only mark the selected item as clicked
      section.values.map((value, i) => {
        value.clicked = i === index;
        return { ...value };
      });

      this.state.store.update(selectedCropId, "data", {
        [name]: { name: item.name }
      });

    } else {
      // mark the item as cheacked
      section.values[index].clicked = !section.values[index].clicked;

      if (section.values[index].clicked) {

        // insert item
        if (selectedCropComp.data && selectedCropComp.data[name]) {
          this.state.store.update(selectedCropId, "data", {
            [name]: [...selectedCropComp.data[name], { name: item.name }]
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

    // mark the selected item as clicked
    let view = secondryList.view.map((view, i) => {
      view.clicked = i === index;
      return { ...view };
    });
    secondryList.view = view;

    // find selected crop data
    let a = selectedCropComp.data[section.name];
    if (section.type === "single") {
      this.state.store.update(selectedCropId, "data", {
        [section.name]: {
          name: secondryList.name,
          view: secondryList.view[index].name
        }
      });

    } else {
      let i = a.findIndex(item => item.name === secondryList.name);
      a[i] = { name: secondryList.name, view: secondryList.view[index].name };
      this.state.store.update(selectedCropId, "data", {
        [section.name]: a
      });
    }

    this.setState({ secondryList });
  };

  hasState = () => {
    let { section, store } = this.state;
    section.clicked = !section.clicked;
    this.setState({ section });

    let selectedCropId = store.selected;
    this.state.store.update(selectedCropId, "data", {
      state: section.clicked
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
          <ListTitle
            text={section.name.toLowerCase() === "types" ? "" : section.name}
          />
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
                  type="single"
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
