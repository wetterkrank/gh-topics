import { Component } from "react";

import './topic.css';

type TopicProps = {
  name: string,
  fSize: number,
  clickFn: (topicName: string) => void,
  // active: boolean,
}

class Topic extends Component<TopicProps, {}> {

  clickHandle = (event: React.MouseEvent) => {
    const topicName = event.currentTarget.innerHTML;
    this.props.clickFn(topicName);
  }

  render() {
    const { name, fSize } = this.props;
    return (
      <li className={`TopicsList__Topic TopicsList__Topic--f${fSize}`} onClick={this.clickHandle} >
        {name}
      </li>
    );
  }
}

export default Topic;
