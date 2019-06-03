import { denormalize } from 'normalizr';
import { AppState } from '../reducers';
import { paperSchema } from '../model/paper';
import { createDeepEqualSelector } from './deepEqualSelector';

export function getPaperEntities(state: AppState) {
  return state.entities.papers;
}

export const getMemoizedReferencePaperIds = (state: AppState) => {
  return state.paperShow.referencePaperIds;
};

export const getMemoizedCitedPaperIds = (state: AppState) => {
  return state.paperShow.citedPaperIds;
};

export const makeGetMemoizedPapers = (getPaperIds: (state: AppState) => number[]) => {
  return createDeepEqualSelector([getPaperIds, getPaperEntities], (paperIds, paperEntities) => {
    return denormalize(paperIds, [paperSchema], { papers: paperEntities });
  });
};
