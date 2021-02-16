import { Component } from "react";

import { TopicFreqs, TopicRepos } from '../api/github';
import './topics_list.css';

import Topic from './topic';

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
      <ul className="TopicsList">
        {tNames.map(name => <Topic name={name} key={name} />)}
      </ul>
    );
  }

}

export default TopicsList;
