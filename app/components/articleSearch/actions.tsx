import { Dispatch } from "redux";
import axios from "axios";
import { push } from "react-router-redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SEARCH_SORTING } from "./records";
import { IGetPapersParams, IGetPapersResult, IPostPaperCommentParams, IGetCitedPapersParams } from "../../api/article";
import ArticleAPI from "../../api/article";
import { IPaperCommentRecord } from "../../model/paperComment";

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput,
    },
  };
}

export function handleSearchPush(searchInput: string) {
  return push(`/search?query=${searchInput}&page=1`);
}

export function changeSorting(sorting: SEARCH_SORTING) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
    payload: {
      sorting,
    },
  };
}

export function getPapers(params: IGetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const paperData: IGetPapersResult = await ArticleAPI.getPapers({
        page: params.page,
        query: params.query,
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: paperData.papers,
          nextPage: params.page + 1,
          isEnd: paperData.last,
          totalElements: paperData.totalElements,
          totalPages: paperData.totalPages,
          numberOfElements: paperData.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

export function getCitedPapers(params: IGetCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const paperData: IGetPapersResult = await ArticleAPI.getCitedPapers({
        page: params.page,
        paperId: params.paperId,
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: paperData.papers,
          nextPage: params.page + 1,
          isEnd: paperData.last,
          totalElements: paperData.totalElements,
          totalPages: paperData.totalPages,
          numberOfElements: paperData.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

export function getReferencesPapers(params: IGetCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const paperData: IGetPapersResult = await ArticleAPI.getReferencesPapers({
        page: params.page,
        paperId: params.paperId,
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: paperData.papers,
          nextPage: params.page + 1,
          isEnd: paperData.last,
          totalElements: paperData.totalElements,
          totalPages: paperData.totalPages,
          numberOfElements: paperData.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

export function changeCommentInput(index: number, comment: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT,
    payload: {
      index,
      comment,
    },
  };
}

export function toggleAbstract(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT,
    payload: {
      index,
    },
  };
}

export function toggleComments(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS,
    payload: {
      index,
    },
  };
}

export function handleCommentPost(params: IPostPaperCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    const { comment, paperId } = params;

    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_COMMENT_POST,
    });

    try {
      const recordifiedComment: IPaperCommentRecord = await ArticleAPI.postPaperComment({
        paperId,
        comment,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_COMMENT_POST,
        payload: {
          comment: recordifiedComment,
          paperId,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_COMMENT_POST,
      });
      console.error(err);
    }
  };
}
