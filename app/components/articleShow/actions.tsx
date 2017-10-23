import { Dispatch } from "redux";
import axios, { CancelTokenSource } from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_EVALUATION_STEP } from "./records";
import ArticleAPI from "../../api/article";
import { IArticleRecord } from "../../model/article";
import alertToast from "../../helpers/makePlutoToastAction";
import handleErrorPage from "../../helpers/handleErrorPage";

export function getArticle(articleId: number, cancelTokenSource: CancelTokenSource) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_ARTICLE,
    });

    try {
      const article: IArticleRecord = await ArticleAPI.getArticle(articleId, cancelTokenSource);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE,
        payload: {
          article,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch({
          type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_ARTICLE,
        });

        alertToast({
          type: "error",
          message: err,
          options: {
            timeOut: 0,
            closeButton: true,
          },
        });
        handleErrorPage(err.status);
      }
    }
  };
}

export function changeArticleEvaluationTab() {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_TAB,
  };
}

export function changeEvaluationStep(step: ARTICLE_EVALUATION_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_STEP,
    payload: {
      step,
    },
  };
}

export function changeEvaluationScore(step: ARTICLE_EVALUATION_STEP, score: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_SCORE,
    payload: {
      step,
      score,
    },
  };
}

export function changeEvaluationComment(step: ARTICLE_EVALUATION_STEP, comment: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_COMMENT,
    payload: {
      step,
      comment,
    },
  };
}

export interface ISubmitEvaluationParams {
  articleId: number;
  originalityScore: number;
  originalityComment: string;
  significanceScore: number;
  significanceComment: string;
  validityScore: number;
  validityComment: string;
  organizationScore: number;
  organizationComment: string;
}

export function submitEvaluation(params: ISubmitEvaluationParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION,
    });

    try {
      const newEvaluation = await ArticleAPI.postEvaluation(params);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
        payload: {
          articleId: params.articleId,
          evaluation: newEvaluation,
        },
      });
      dispatch(changeEvaluationStep(ARTICLE_EVALUATION_STEP.FINAL));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION,
      });

      alertToast({
        type: "error",
        message: err.message || err,
      });
    }
  };
}

export function togglePeerEvaluationComponent(peerEvaluationId: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
    payload: {
      peerEvaluationId,
    },
  };
}

export interface IHandlePeerEvaluationCommentSubmitParams {
  comment: string;
  evaluationId: number;
}

export function handlePeerEvaluationCommentSubmit(params: IHandlePeerEvaluationCommentSubmitParams) {
  return async (dispatch: Dispatch<any>) => {
    const { comment, evaluationId } = params;

    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT,
    });

    try {
      // TODO: Add comment API
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
        payload: {
          comment,
          evaluationId,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
      });
      console.error(err);
    }
  };
}

export function votePeerEvaluation(articleId: number, evaluationId: number) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_EVALUATION,
      payload: {
        articleId,
        evaluationId,
      },
    });

    try {
      await ArticleAPI.voteEvaluation(articleId, evaluationId);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_EVALUATION,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_EVALUATION,
        payload: {
          articleId,
          evaluationId,
        },
      });
      alertToast({
        type: "error",
        message: "Vote Error",
      });
    }
  };
}
