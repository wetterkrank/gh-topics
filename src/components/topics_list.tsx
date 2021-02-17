import { Component } from "react";

import { TopicFreqs, TopicRepos } from '../api/github';
import './topics_list.css';

import Topic from './topic';

type TopicsListProps = {
  tFreqs: TopicFreqs,
  tRepos: TopicRepos,
  clickFn: (topicName: string) => void,
}

class TopicsList extends Component<TopicsListProps, {}> {

  toScale5(x: number, max: number): number {
    let res: number = x / max * 5;
    res = Math.ceil(res);
    return res;
  }

  render() {
    const tFreqs = this.props.tFreqs;
    const tNames = Object.keys(tFreqs);
    if (tNames.length === 0) return null;

    const maxFreq: number = Math.max(...Object.values(tFreqs));

    return (
      <ul className="TopicsList">
        {tNames.map(
          name => <Topic key={name} name={name} fSize={this.toScale5(tFreqs[name], maxFreq)} clickFn={this.props.clickFn} />
        )}
      </ul>
    );
  }
}

export default TopicsList;
