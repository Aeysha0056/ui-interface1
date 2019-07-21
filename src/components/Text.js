import React from "react";

export const OptionText = ({ text, isSelected, onClick }) => (
  <div onClick={onClick} className="col-2 light-creamy-text divider">
    <div className={`${isSelected ? "bold-brown-text" : ""}`}>{text}</div>
  </div>
);

export const TabText = ({ text, isSelected, isLastTab, onClick }) => (
  <div
    onClick={onClick}
    className={`col light-creamy-text small-font ${
      isLastTab ? "" : "tab-divider"
    } mb-3`}
  >
    <div className={`${isSelected ? "bold-brown-text" : ""}`}>{text}</div>
  </div>
);

export const ListTitle = ({ text }) => (
  <div className="col bold-bronze-text small-font pl-4">
    {text}
  </div>
);

export const ListText = ({ text, isSelected }) => (
  <div
    className={`col white-text small-font  ${
      isSelected ? "bold-creamy-text" : ""
    }`}
  >
    <div>{text}</div>
  </div>
);
