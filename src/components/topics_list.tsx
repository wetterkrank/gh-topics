import { Component } from "react";

import Topic from './topic';
import { TopicFreqs, TopicRepos } from '../api/github';

type TopicsListProps = {
  tFreqs: TopicFreqs | null,
  tRepos: TopicRepos | null,
  activeTopic: string | null
  // clickFn: () => void
}

class TopicsList extends Component<TopicsListProps, {}> {

  topics(names: string[]) {
    return names.map(name => <Topic name={name} />);
  }

  render() {
    if (!this.props.tFreqs) return null;
    
    const tNames = Object.keys(this.props.tFreqs);
    return (
      <ul className="topics-list">
        {tNames.map(name => <Topic name={name} />)}
      </ul>
    );
  }

}

export default TopicsList;
