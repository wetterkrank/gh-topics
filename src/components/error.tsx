import { Component } from "react";

import './error.css';

type ErrorProps = {
  text: string,
}

class ErrorMessage extends Component<ErrorProps, {}> {
  render() {
    if (this.props.text === "") return null;

    return (
      <div className="ErrorMessage">
        {this.props.text}
      </div>
    );
  }
}

export default ErrorMessage;
