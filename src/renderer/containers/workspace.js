import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { setColumnSize } from '../../shared/actions/settings';
import {
  getCurrentArchive,
  getSetting,
  getArchivesCount,
  getUIState,
  getArchive
} from '../../shared/selectors';
import {
  loadOrUnlockArchive,
  addArchiveFromSource
} from '../../shared/actions/archives';

export default connect(
  state => ({
    columnSizes: getSetting(state, 'columnSizes'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    archivesLoading: getSetting(state, 'archivesLoading'),
    currentArchive: getCurrentArchive(state),
    archivesCount: getArchivesCount(state),
    savingArchive: getUIState(state, 'savingArchive'),
    isArchiveSearchVisible: getUIState(state, 'isArchiveSearchVisible')
  }),
  {
    setColumnSize,
    onUnlockArchive: loadOrUnlockArchive,
    onAddNewVault: addArchiveFromSource,
    isVaultUnlocked: vaultId => (_, getState) =>
      getArchive(getState(), vaultId).status === 'unlocked'
  }
)(Workspace, 'Workspace');
