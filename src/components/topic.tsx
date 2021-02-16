import { Component } from "react";

import './topic.css';

type TopicProps = {
  name: string,
  // active: boolean,
  // clickFn: () => void
}

class Topic extends Component<TopicProps, {}> {

  render() {
    return (
      <li className="Topic">
        {this.props.name}
      </li>
    );
  }
}

export default Topic;
