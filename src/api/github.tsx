import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";


type TopicFreqs = { [key: string]: number };
type TopicRepos = { [key: string]: string[] };
type RepoList = { key: string, name: string, url: string }[];
type QueryState = "new" | "started" | "done" | "error";


class GithubApi {
  private gh: Octokit;
  private resultFn: (repoName: string, topics: string[]) => void;
  private statusFn: (status: QueryState, err?: any) => void;
  private test_data: TopicFreqs;

  constructor(resultFn: (repoName: string, topics: string[]) => void, 
              statusFn: (status: QueryState) => void, 
              test_data = {}) {
    this.gh = new Octokit();
    this.test_data = test_data;
    this.resultFn = resultFn;
    this.statusFn = statusFn;
  }

  async getUserRepos(username: string): Promise<RepoList> {
    // TODO: Pagination
    let repoList: RepoList = [];
    try {
      const repos = await this.gh.repos.listForUser({ username: username });
      repoList = repos.data.map(repo => ({ key: repo.name, name: repo.name, url: repo.url }));
    } catch(err) {
      if(err instanceof RequestError) {
        console.log(`OORGH: ${err}`);
        this.statusFn("error", err);
      } else {
        throw(err);
      }
    }
    return repoList;
  }
    
  async sendTopicsRequests(username: string, userRepos: RepoList, chunkSize: number, ms: number): Promise<void> {
    // userRepos = userRepos.slice(0,3); // Use only first 3 repos
    // if (Object.keys(this.test_data).length !== 0) return this.test_data;
    const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

    const promises: Promise<void>[] = [];
    let counter = 0;
    for (const repo of userRepos) {
      counter++;
      promises.push(
        this.gh.repos.getAllTopics({ owner: username, repo: repo.name })
        .then(response => { this.resultFn(repo.name, response.data.names); })
        .catch(err => {
          console.log(`AARGH: ${err}`);
          this.statusFn("error", err);
        })
      );
      if (counter % chunkSize === 0) {
        await delay(ms);
        counter = 0;
      }
    }
    await Promise.all(promises).then(() => { this.statusFn("done"); });
  };
}


export type { TopicFreqs, TopicRepos, RepoList, QueryState };
export default GithubApi;
