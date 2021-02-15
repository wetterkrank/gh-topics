import { Component } from "react";

type TopicProps = {
  name: string,
  // active: boolean,
  // clickFn: () => void
}

class Topic extends Component<TopicProps, {}> {

  render() {
    return (
      <li className="topic">
        {this.props.name}
      </li>
    );
  }
}

export default Topic;
