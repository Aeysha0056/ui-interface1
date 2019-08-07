import React from "react";
import { EntypoCheck } from "react-entypo-icons";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { ListTitle, ListText } from "./Text";

/**
 * @typedef ListItem
 * @property {"single" | "multi"} type
 * @property {number}             index
 * @property {object}             item
 * @property {string}             item.name
 * @property {boolean}            item.clicked
 * @property {function}           onClick
 * @property {function}           handleCheckBoxChanges
 */

/**
 * @type ListItem
 */
export const Item = ({ type, index, item, onClick, handleCheckBoxChanges }) => (
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

export default Item;
