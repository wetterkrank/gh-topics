import { Component } from "react";

import { RepoList } from '../api/github';

type ReposViewProps = {
  repos: RepoList | null,
}

class ReposView extends Component<ReposViewProps, {}> {

  list(repos: RepoList) {
    return repos.map(elt => <li className="repo-name" key={elt.key}> {elt.name} </li>)
  }

  render() {
    if (!this.props.repos) return null;

    return (
      <div className="repos-list">
        <ul>
          {this.list(this.props.repos)}
        </ul>
      </div>
    );
  }

}

export default ReposView;
