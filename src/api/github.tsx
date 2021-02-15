import { Octokit } from "@octokit/rest";
// import { OctokitResponse } from "@octokit/types";

type TopicFreqs = { [key: string]: number };
type TopicRepos = { [key: string]: string[] };
type RepoList = { key: string, name: string, url: string }[];


class GithubApi {
  private gh: Octokit;
  private resultFn: (repoName: string, topics: string[]) => void;
  private test_data: TopicFreqs;

  constructor(resultFn: (repoName: string, topics: string[]) => void, test_data = {}) {
    this.gh = new Octokit();
    this.test_data = test_data;
    this.resultFn = resultFn;
  }

  async getUserRepos(username: string): Promise<RepoList> {
    // TODO: Pagination
    const repos = await this.gh.repos.listForUser({ username: username });
    const repoList: RepoList = repos.data.map(repo => ({ key: repo.name, name: repo.name, url: repo.url }));
    return repoList;
  }
    
  async sendTopicsRequests(username: string, userRepos: RepoList, chunkSize: number, ms: number): Promise<void> {
    // if (Object.keys(this.test_data).length !== 0) return this.test_data;
    const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

    // userRepos = userRepos.slice(0,3);
    let counter = 0;
    for (const repo of userRepos) {
      counter++;
      if (counter % chunkSize === 0) {
        await delay(ms);
        counter = 0;
      }
      this.gh.repos.getAllTopics({ owner: username, repo: repo.name })
      .then(response => { this.resultFn(repo.name, response.data.names) });
    }
  };

  // const flatTopicsList: string[] = results.reduce((all: string[], one: string[]) => all.concat(one));
  // const countedTopics: RepoList = flatTopicsList.reduce((freqs, value) => {
  //   freqs[value] ? freqs[value]++ : freqs[value] = 1;
  //   return freqs;
  // }, {} as RepoList);
  // return countedTopics;
}

export type { TopicFreqs, TopicRepos, RepoList };
export default GithubApi;
