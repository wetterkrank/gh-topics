import { Component } from 'react';
import Modal from 'react-modal';
import type { RepoList } from '../api/github';
import './repos_view.css';

type ReposViewProps = {
  reposToShow: RepoList,
  selectedTopic: string,
  isOpen: boolean,
  closeFn: () => void,
}

class ReposView extends Component<ReposViewProps, {}> {
  constructor(props: ReposViewProps) {
    super(props);
    Modal.setAppElement('#root');
  }

  list(repos: RepoList) {
    return repos.map(elt => <li className="repo-name" key={elt.key}> {elt.name} </li>)
  }

  render() {
    const modalStyle: Modal.Styles = {
      content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        maxWidth: '100%',
        minHeight: '150px',
        maxHeight: '50%'
      }
    };
    
    const { isOpen, closeFn, reposToShow, selectedTopic } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeFn}
        style={modalStyle}
        contentLabel="Repositories marked with this topic"
      >
        <h4 className="ReposView__header">Repos tagged '{selectedTopic}'</h4>
        <ul className="ReposView__list">
          {reposToShow.map(r => <li className="repo-name" key={r.key}> <a href={r.url} rel="noreferrer" target="_blank">{r.name}</a> </li>)}
        </ul>
        <button onClick={closeFn} className="pure-button pure-button-primary ReposView__closeBtn">Close</button>
      </Modal>
    );
  }
}

export default ReposView;
