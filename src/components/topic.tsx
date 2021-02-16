import { Component } from "react";

import './topic.css';

type TopicProps = {
  name: string,
  // active: boolean,
  // clickFn: () => void
}

class Topic extends Component<TopicProps, {}> {
  toScale(x: number, max: number, scale: number): number {
    let res: number = x / max * scale;
    res = Math.ceil(res);
    return res;
  }

  render() {
    return (
      <li className="Topic">
        {this.props.name}
      </li>
    );
  }
}

export default Topic;
