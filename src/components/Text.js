import React from "react";

/**
 * @typedef Text
 * @property {string} text
 * @property {boolean} isSelected
 * @property {boolean} [isLast]
 * @property {function} [onClick]
 */

/**
 * @type Text
 */
export const OptionText = ({ text, isSelected, onClick }) => (
  <div onClick={onClick} className="col-2 light-creamy-text divider">
    <div className={`${isSelected ? "bold-brown-text" : ""}`}>{text}</div>
  </div>
);

/**
 * @type Text
 */
export const TabText = ({ text, isSelected, isLast, onClick }) => (
  <div
    onClick={onClick}
    className={`col light-creamy-text small-font ${
      isLast ? "" : "tab-divider"
    } mb-3`}
  >
    <div className={`${isSelected ? "bold-brown-text" : ""}`}>{text}</div>
  </div>
);

/**
 * @type Text
 */
export const ListTitle = ({ text }) => (
  <div className="col bold-bronze-text small-font pl-4">
    {text}
  </div>
);

/**
 * @type Text
 */
export const ListText = ({ text, isSelected }) => (
  <div
    className={`col white-text small-font  ${
      isSelected ? "bold-creamy-text" : ""
    }`}
  >
    <div>{text}</div>
  </div>
);
