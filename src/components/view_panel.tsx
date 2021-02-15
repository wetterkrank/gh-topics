import { Component } from "react";

import { TopicsList, RepoList } from '../api/github';
import TopicsView from "./topics_view";
import ReposView from "./repos_view";

type ViewPanelProps = {
  repos: RepoList | null,
  topics: TopicsList | null,
  activeTopic: string | null
  // clickFn: () => void
}

class ViewPanel extends Component<ViewPanelProps, {}> {

  render() {
    return (
      // <TopicsView />
      <ReposView repos={this.props.repos}/>
    )
  }

}

export default ViewPanel;
