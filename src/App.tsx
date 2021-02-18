import { Component } from 'react';

import './App.css';
import SearchBar from './components/search_bar';
import TopicsList from './components/topics_list';
import ReposView from './components/repos_view';
import ErrorMessage from './components/error';
import GithubApi, { TopicFreqs, TopicRepos, RepoList, QueryState } from './api/github';


interface AppProps {}
interface AppState {
  repos: RepoList,
  tFreqs: TopicFreqs,
  tRepos: TopicRepos,
  queryState: QueryState,
  selectedTopic: string,
  modalIsOpen: boolean,
  reposToShow: RepoList,
  error: string,
}

class App extends Component<AppProps, AppState> {
  private api: GithubApi;
  private zeroState: AppState = {
    error: "",
    repos: [],
    tFreqs: {},
    tRepos: {},
    queryState: "new",
    selectedTopic: "",
    modalIsOpen: false,
    reposToShow: [],
  }

  constructor(props: AppProps) {
    super(props);
    this.api = new GithubApi(this.processResponse, this.updateStatus);
    this.state = { ...this.zeroState };
  }

  // Gets triggered by Search button
  startSearch = async (query: string): Promise<void> => {
    this.setState(this.zeroState);
    this.setState({ queryState: "started" });
    const reposList: RepoList = await this.api.getUserRepos(query);
    this.api.sendTopicsRequests(query, reposList, 1, 100);
    this.setState({ repos: reposList });
  }

  // Receives app state updates from components
  updateStatus = (update: QueryState, err?: Error): void => {
    if (err) {
      this.setState({ error: err.toString() });
    } else if (update === "done" && Object.keys(this.state.tFreqs).length === 0) {
      this.setState({ error: "No topics found" });
    }
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
      this.setState({ tFreqs: tFreqsNew, tRepos: tReposNew });
    }
  }

  // Opens a modal window with the list of repos for selected topic
  showRepos = (topicName: string): void => {
    const repoNames: string[] = this.state.tRepos[topicName];
    const reposToShow: RepoList = repoNames.map(repo => {
      const x = this.state.repos.find(x => x.name === repo);
      return { key: x!.name, name: x!.name, url: x!.url }
    });
    this.setState({ reposToShow: reposToShow, selectedTopic: topicName, modalIsOpen: true });
  }

  hideRepos = (): void => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { tFreqs, tRepos, queryState, modalIsOpen, reposToShow, selectedTopic, error } = this.state;
    return (
      <div className="App">
        <SearchBar queryState={queryState} searchFn={this.startSearch} statusFn={this.updateStatus} />
        <ErrorMessage text={error} />
        <TopicsList tFreqs={tFreqs} tRepos={tRepos} clickFn={this.showRepos} />
        <ReposView 
          reposToShow={reposToShow}
          selectedTopic={selectedTopic}
          isOpen={modalIsOpen}
          closeFn={this.hideRepos}
        />
      </div>
    );

  }
}

export default App;
