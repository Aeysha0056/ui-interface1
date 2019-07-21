import React from "react";

export default class draw extends React.PureComponent {
  render() {
    let style = {
      position: "absolute",
      top: this.props.y1,
      left: this.props.x1,
      visibility: this.props.show ? "visible" : "hidden",
      height: this.props.h,
      width: this.props.w,
      border: "1px dashed black",
      zIndex: "1000"
    };
    return <div style={style}> </div>;
  }
}
