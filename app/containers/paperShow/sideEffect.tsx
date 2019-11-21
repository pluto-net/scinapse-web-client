import { Dispatch } from 'redux';
import { LoadDataParams } from '../../routes';
import {
  getPaper,
  getCitedPapers,
  getReferencePapers,
  fetchLastFullTextRequestedDate,
  getMyCollections,
} from '../../actions/paperShow';
import { CurrentUser } from '../../model/currentUser';
import { PaperShowMatchParams, PaperShowPageQueryParams } from './types';
import { ActionCreators } from '../../actions/actionTypes';
import { getRelatedPapers } from '../../actions/relatedPapers';
import { PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';

export function fetchCitedPaperData(paperId: string, page: number = 1, query: string, sort: PAPER_LIST_SORT_TYPES) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getCitedPapers({
        paperId,
        page,
        query,
        sort,
      })
    );
  };
}

export function fetchRefPaperData(paperId: string, page: number = 1, query: string, sort: PAPER_LIST_SORT_TYPES) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getReferencePapers({
        paperId,
        page,
        query,
        sort,
      })
    );
  };
}

export async function fetchRefCitedPaperDataAtServer(params: LoadDataParams<PaperShowMatchParams>) {
  const { dispatch, match, queryParams } = params;

  const paperId = match.params.paperId;
  const queryParamsObject: PaperShowPageQueryParams = queryParams ? queryParams : { 'cited-page': 1, 'ref-page': 1 };

  await Promise.all([
    dispatch(
      fetchCitedPaperData(
        paperId,
        queryParamsObject['cited-page'],
        queryParamsObject['cited-query'] || '',
        queryParamsObject['cited-sort'] || 'NEWEST_FIRST'
      )
    ),
    dispatch(
      fetchRefPaperData(
        paperId,
        queryParamsObject['ref-page'],
        queryParamsObject['ref-query'] || '',
        queryParamsObject['ref-sort'] || 'NEWEST_FIRST'
      )
    ),
  ]);
}

export async function fetchPaperShowData(params: LoadDataParams<PaperShowMatchParams>, currentUser?: CurrentUser) {
  const { dispatch, match } = params;
  const paperId = match.params.paperId;

  if (!paperId) {
    return dispatch(ActionCreators.failedToGetPaper({ statusCode: 400 }));
  }

  const promiseArray = [];
  promiseArray.push(dispatch(getPaper({ paperId, cancelToken: params.cancelToken })));
  promiseArray.push(dispatch(getRelatedPapers(paperId, params.cancelToken)));
  promiseArray.push(dispatch(fetchLastFullTextRequestedDate(paperId)));

  if (currentUser && currentUser.isLoggedIn) {
    promiseArray.push(dispatch(getMyCollections(paperId, params.cancelToken)));
  }

  await Promise.all(promiseArray);
}
