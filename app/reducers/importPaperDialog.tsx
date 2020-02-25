import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMPORT_SOURCE_TAB, CURRENT_IMPORT_PROGRESS_STEP } from '../containers/profile/types';

interface ImportPaperDialogState {
  isOpen: boolean;
  activeImportSourceTab: IMPORT_SOURCE_TAB;
  inProgressStep: CURRENT_IMPORT_PROGRESS_STEP;
  totalImportedCount: number;
  successCount: number;
  pendingCount: number;
  profileSlug?: string;
}

export const IMPORT_PAPER_DIALOG_INITIAL_STATE: ImportPaperDialogState = {
  isOpen: false,
  profileSlug: undefined,
  activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX,
  inProgressStep: CURRENT_IMPORT_PROGRESS_STEP.PROGRESS,
  totalImportedCount: 0,
  successCount: 0,
  pendingCount: 0,
};

const importPaperDialogSlice = createSlice({
  name: 'importPaperDialog',
  initialState: IMPORT_PAPER_DIALOG_INITIAL_STATE,
  reducers: {
    openImportPaperDialog(
      state,
      action: PayloadAction<{ activeImportSourceTab: IMPORT_SOURCE_TAB; profileSlug?: string }>
    ) {
      return {
        ...state,
        isOpen: true,
        profileSlug: action.payload.profileSlug,
        activeImportSourceTab: action.payload.activeImportSourceTab,
        totalImportedCount: 0,
        successCount: 0,
        pendingCount: 0,
      };
    },
    closeImportPaperDialog(state) {
      return {
        ...state,
        isOpen: false,
        inProgressStep: CURRENT_IMPORT_PROGRESS_STEP.PROGRESS,
        activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX,
        totalImportedCount: 0,
        successCount: 0,
        pendingCount: 0,
      };
    },
    changeImportSourceTab(state, action: PayloadAction<{ activeImportSourceTab: IMPORT_SOURCE_TAB }>) {
      return {
        ...state,
        activeImportSourceTab: action.payload.activeImportSourceTab,
      };
    },
    changeProgressStep(state, action: PayloadAction<{ inProgressStep: CURRENT_IMPORT_PROGRESS_STEP }>) {
      return {
        ...state,
        inProgressStep: action.payload.inProgressStep,
      };
    },
    fetchPaperImportResult(
      state,
      action: PayloadAction<{ totalImportedCount: number; successCount: number; pendingCount: number }>
    ) {
      return {
        ...state,
        totalImportedCount: action.payload.totalImportedCount,
        successCount: action.payload.successCount,
        pendingCount: action.payload.pendingCount,
      };
    },
  },
});

export const {
  openImportPaperDialog,
  closeImportPaperDialog,
  changeImportSourceTab,
  changeProgressStep,
  fetchPaperImportResult,
} = importPaperDialogSlice.actions;

export default importPaperDialogSlice.reducer;
