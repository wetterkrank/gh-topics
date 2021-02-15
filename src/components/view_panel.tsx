import { Component } from "react";

import { TopicFreqs, TopicRepos, RepoList } from '../api/github';
import TopicsList from "./topics_list";
import ReposView from "./repos_view";

type ViewPanelProps = {
  repos: RepoList | null,
  tFreqs: TopicFreqs | null,
  tRepos: TopicRepos | null,
  activeTopic: string | null
  // clickFn: () => void
}

class ViewPanel extends Component<ViewPanelProps, {}> {

  render() {
    const {repos, tFreqs, tRepos, activeTopic} = this.props;
    return (
      <div className="view-panel">
        <TopicsList tFreqs={tFreqs} tRepos={tRepos} activeTopic={activeTopic} />
        {activeTopic ? <ReposView repos={repos} activeTopic={activeTopic} /> : null}
      </div>
    )
  }
}

export default ViewPanel;
