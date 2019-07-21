import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { EntypoCheck } from "react-entypo-icons";

import { ListTitle, ListText } from "../Text";

class TabContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    let { section } = nextProps.selectedTab;
    this.setState({ section, secondryList: null });
  }

  /**
   * mark the selected item as clicked
   * and update the secondry list based on selected item
   *
   * @param  {Object} item
   * @param  {Number} index
   */
  mainListHandler = (item, index) => {
    let { section, secondryList } = this.state;

    if (section.type === "single") {
      // only mark the selected item as clicked
      section.values.map((value, i) => {
        value.clicked = (i === index);
        return { ...value };
      });
    } else {
      // mark the item as cheacked
      section.values[index].clicked = !section.values[index].clicked;
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
   *  mark the selected item as clicked
   *  in secondryList
   *
   * @param  {Object} item
   * @param  {Number} index
   */
  updateSecondryList = (item, index) => {
    let { secondryList } = this.state;

    if (secondryList.type === "single") {
      // only mark the selected item as clicked
      let view = secondryList.view.map((view, i) => {
        view.clicked = (i === index);
        return { ...view };
      });
      secondryList.view = view;
    } else {
      // mark the item as cheacked
      secondryList.view[index].clicked = !secondryList.view[index].clicked;
    }

    this.setState({ secondryList });
  };

  /**
   * update the selectedItem checkbox state
   *
   * @param  {String} listName    - mainList or secondryList
   * @param  {Object} selectedItem
   * @param  {Number} index
   */
  handleCheckBoxChanges = (listName, selectedItem, index) => {
    let { section, secondryList } = this.state;
    if (listName === "mainList") {
      section.values[index].clicked = !selectedItem.clicked;
      this.setState({ section });
    } else {
      secondryList.view[index].clicked = !selectedItem.clicked;
      this.setState({ secondryList });
    }
  };

  hasState = () => {
    let { section } = this.state;
    section.clicked = !section.clicked;
    this.setState({ section });
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
                handleCheckBoxChanges={() =>
                  this.handleCheckBoxChanges("mainList", item, i)
                }
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
                  type={secondryList.type}
                  index={i}
                  item={item}
                  onClick={() => this.updateSecondryList(item, i)}
                  handleCheckBoxChanges={() =>
                    this.handleCheckBoxChanges("secondryList", item, i)
                  }
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
