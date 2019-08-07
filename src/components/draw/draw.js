import React from "react";

/**
 * @class
 */
class draw extends React.PureComponent {
  /**
   * @method
   */
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

export default draw
