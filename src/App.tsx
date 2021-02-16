import { Component } from 'react';

import './App.css';
import SearchBar from './components/search_bar';
import ViewPanel from './components/view_panel';
import GithubApi, { TopicFreqs, TopicRepos, RepoList, QueryState } from './api/github';


interface AppProps { }
interface AppState {
  repos: RepoList | null,
  tFreqs: TopicFreqs | null,
  tRepos: TopicRepos | null
  activeTopic: string | null,
  error: null,
  queryState: QueryState
}

class App extends Component<AppProps, AppState> {
  private api: GithubApi;
  private static zeroState: AppState = {
    repos: null,
    tFreqs: null,
    tRepos: null,
    activeTopic: null,
    error: null,
    queryState: "new"
  }

  constructor(props: AppProps) {
    super(props);
    this.api = new GithubApi(this.processResponse, this.updateStatus);
    this.state = { ...App.zeroState };
  }

  // Gets triggered by Search button
  startSearch = async (query: string): Promise<void> => {
    this.setState(App.zeroState);
    this.setState({ queryState: "started" });
    const reposList: RepoList = await this.api.getUserRepos(query);
    this.api.sendTopicsRequests(query, reposList, 1, 200);
    this.setState({ repos: reposList });
  }

  // Receives app state updates from components
  updateStatus = (update: QueryState): void => {
    this.setState({ queryState: update });
  }

  // Callback that processes each individual repo response
  // TODO: Save results in Local Storage when complete
  processResponse = (repoName: string, repoTopics: string[]): void => {
    if (repoTopics.length > 0) {
      const tFreqsNew = { ...this.state.tFreqs };
      const tReposNew = { ...this.state.tRepos };
      repoTopics.forEach(topic => {
        tFreqsNew[topic] ? tFreqsNew[topic] += 1 : tFreqsNew[topic] = 1;
        tReposNew[topic] ? tReposNew[topic].push(repoName) : tReposNew[topic] = [repoName];
      });
      this.setState({ tFreqs: tFreqsNew });
      this.setState({ tRepos: tReposNew });
    }
  }

  render() {
    const { repos, tFreqs, tRepos, activeTopic, queryState } = this.state;
    return (
      <div className="App">
        <SearchBar queryState={queryState} searchFn={this.startSearch} statusFn={this.updateStatus} />
        <ViewPanel repos={repos} tFreqs={tFreqs} tRepos={tRepos} activeTopic={activeTopic} />
      </div>
    );

  }
}

export default App;
