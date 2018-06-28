import { ActionCreatorsMapObject } from "redux";
import { AppEntities } from "../reducers/entity";
import { CommonPaginationResponsePart } from "../api/types/common";
import { AvailableCitationType } from "../components/paperShow/records";
import { CheckBookmarkedResponse } from "../api/member";
import { Paper } from "../model/paper";
import { GLOBAL_DIALOG_TYPE } from "../components/dialog/reducer";
import { Collection } from "../model/collection";

export enum ACTION_TYPES {
  GLOBAL_LOCATION_CHANGE = "@@router/LOCATION_CHANGE",
  GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING = "GLOBAL.SUCCEEDED_TO_INITIAL_DATA_FETCHING",
  GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE = "GLOBAL.SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE",
  GLOBAL_CHANGE_DIALOG_TYPE = "GLOBAL_CHANGE_DIALOG_TYPE",
  GLOBAL_ALERT_NOTIFICATION = "GLOBAL_ALERT_NOTIFICATION",
  GLOBAL_CLEAR_NOTIFICATION = "GLOBAL_CLEAR_NOTIFICATION",

  GLOBAL_ADD_ENTITY = "GLOBAL.ADD_ENTITY",
  GLOBAL_FLUSH_ENTITIES = "GLOBAL.FLUSH_ENTITIES",

  GLOBAL_DIALOG_OPEN = "GLOBAL_DIALOG_OPEN",
  GLOBAL_DIALOG_CLOSE = "GLOBAL_DIALOG_CLOSE",
  GLOBAL_DIALOG_START_TO_GET_COLLECTIONS = "GLOBAL_DIALOG.START_TO_GET_COLLECTIONS",
  GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS = "GLOBAL_DIALOG.SUCCEEDED_GET_COLLECTIONS",
  GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS = "GLOBAL_DIALOG.FAILED_TO_GET_COLLECTIONS",
  GLOBAL_DIALOG_START_TO_POST_COLLECTION = "GLOBAL_DIALOG.START_TO_POST_COLLECTION",
  GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION = "GLOBAL_DIALOG.SUCCEEDED_POST_COLLECTION",
  GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION = "GLOBAL_DIALOG.FAILED_TO_POST_COLLECTION",
  GLOBAL_DIALOG_START_TO_ADD_PAPER_TO_COLLECTIONS = "GLOBAL_DIALOG.START_TO_ADD_PAPER_TO_COLLECTIONS",
  GLOBAL_DIALOG_SUCCEEDED_ADD_PAPER_TO_COLLECTIONS = "GLOBAL_DIALOG.SUCCEEDED_ADD_PAPER_TO_COLLECTIONS",
  GLOBAL_DIALOG_FAILED_TO_ADD_PAPER_TO_COLLECTIONS = "GLOBAL_DIALOG.FAILED_TO_ADD_PAPER_TO_COLLECTIONS",

  GLOBAL_START_TO_REMOVE_BOOKMARK = "GLOBAL.START_TO_REMOVE_BOOKMARK",
  GLOBAL_SUCCEEDED_REMOVE_BOOKMARK = "GLOBAL.SUCCEEDED_REMOVE_BOOKMARK",
  GLOBAL_FAILED_TO_REMOVE_BOOKMARK = "GLOBAL.FAILED_TO_REMOVE_BOOKMARK",

  GLOBAL_START_TO_POST_BOOKMARK = "GLOBAL.START_TO_POST_BOOKMARK",
  GLOBAL_SUCCEEDED_POST_BOOKMARK = "GLOBAL.SUCCEEDED_POST_BOOKMARK",
  GLOBAL_FAILED_TO_POST_BOOKMARK = "GLOBAL.FAILED_TO_POST_BOOKMARK",

  GLOBAL_START_TO_GET_BOOKMARK = "GLOBAL.START_TO_GET_BOOKMARK",
  GLOBAL_FAILED_TO_GET_BOOKMARK = "GLOBAL.FAILED_TO_GET_BOOKMARK",
  GLOBAL_SUCCEEDED_TO_GET_BOOKMARK = "GLOBAL.SUCCEEDED_TO_GET_BOOKMARK",

  SET_DEVICE_TO_DESKTOP = "SET_DEVICE_TO_DESKTOP",
  SET_DEVICE_TO_MOBILE = "SET_DEVICE_TO_MOBILE",

  SIGN_IN_CHANGE_EMAIL_INPUT = "SIGN_IN.CHANGE_EMAIL_INPUT",
  SIGN_IN_CHANGE_PASSWORD_INPUT = "SIGN_IN.CHANGE_PASSWORD_INPUT",
  SIGN_IN_ON_FOCUS_INPUT = "SIGN_IN.ON_FOCUS_INPUT",
  SIGN_IN_ON_BLUR_INPUT = "SIGN_IN.ON_BLUR_INPUT",
  SIGN_IN_FORM_ERROR = "SIGN_IN.FORM_ERROR",

  SIGN_IN_START_TO_SIGN_IN = "SIGN_IN.START_TO_SIGN_IN",
  SIGN_IN_FAILED_TO_SIGN_IN = "SIGN_IN.FAILED_TO_SIGN_IN",
  SIGN_IN_SUCCEEDED_TO_SIGN_IN = "SIGN_IN.SUCCEEDED_TO_SIGN_IN",

  SIGN_IN_GET_AUTHORIZE_CODE = "SIGN_IN.GET_AUTHORIZE_CODE",
  SIGN_IN_GO_BACK = "SIGN_IN.GO_BACK",

  SIGN_UP_CHANGE_EMAIL_INPUT = "SIGN_UP.CHANGE_EMAIL_INPUT",
  SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL = "SIGN_UP.SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL",
  SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL = "SIGN_UP.FAILED_TO_CHECK_DUPLICATED_EMAIL",

  SIGN_UP_CHANGE_PASSWORD_INPUT = "SIGN_UP.CHANGE_PASSWORD_INPUT",
  SIGN_UP_CHANGE_NAME_INPUT = "SIGN_UP.CHANGE_NAME_INPUT",
  SIGN_UP_CHANGE_AFFILIATION_INPUT = "SIGN_UP.CHANGE_AFFILIATION_INPUT",

  SIGN_UP_FORM_ERROR = "SIGN_UP.FORM_ERROR",
  SIGN_UP_REMOVE_FORM_ERROR = "SIGN_UP.REMOVE_FORM_ERROR",

  SIGN_UP_ON_FOCUS_INPUT = "SIGN_UP.ON_FOCUS_INPUT",
  SIGN_UP_ON_BLUR_INPUT = "SIGN_UP.ON_BLUR_INPUT",

  SIGN_UP_START_TO_CREATE_ACCOUNT = "SIGN_UP.START_TO_CREATE_ACCOUNT",
  SIGN_UP_FAILED_TO_CREATE_ACCOUNT = "SIGN_UP.FAILED_TO_CREATE_ACCOUNT",
  SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT = "SIGN_UP.SUCCEEDED_TO_CREATE_ACCOUNT",

  SIGN_UP_CHANGE_SIGN_UP_STEP = "SIGN_UP.CHANGE_SIGN_UP_STEP",
  SIGN_UP_GET_AUTHORIZE_CODE = "SIGN_UP.GET_AUTHORIZE_CODE",
  SIGN_UP_START_TO_EXCHANGE = "SIGN_UP.START_TO_EXCHANGE",
  SIGN_UP_FAILED_TO_EXCHANGE = "SIGN_UP.FAILED_TO_EXCHANGE",
  SIGN_UP_SUCCEEDED_TO_EXCHANGE = "SIGN_UP.SUCCEEDED_TO_EXCHANGE",
  SIGN_UP_GO_BACK = "SIGN_UP.GO_BACK",
  SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL = "SIGN_IN.SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL",

  EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN = "EMAIL_VERIFICATION.START_TO_VERIFY_TOKEN",
  EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN = "EMAIL_VERIFICATION.FAILED_TO_VERIFY_TOKEN",
  EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN = "EMAIL_VERIFICATION.SUCCEEDED_TO_VERIFY_TOKEN",
  EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL = "EMAIL_VERIFICATION.START_TO_RESEND_VERIFICATION_EMAIL",

  EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL = "EMAIL_VERIFICATION.FAILED_TO_RESEND_VERIFICATION_EMAIL",
  // tslint:disable-next-line:max-line-length
  EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL = "EMAIL_VERIFICATION.SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL",

  AUTH_SUCCEEDED_TO_SIGN_OUT = "AUTH.SUCCEEDED_TO_SIGN_OUT",
  AUTH_FAILED_TO_SIGN_OUT = "AUTH.FAILED_TO_SIGN_OUT",

  AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN = "AUTH.SUCCEEDED_TO_CHECK_LOGGED_IN",
  AUTH_FAILED_TO_CHECK_LOGGED_IN = "AUTH.FAILED_TO_CHECK_LOGGED_IN",

  HEADER_OPEN_KEYWORD_COMPLETION = "HEADER.OPEN_KEYWORD_COMPLETION",
  HEADER_ClOSE_KEYWORD_COMPLETION = "HEADER.CLOSE_KEYWORD_COMPLETION",

  HEADER_START_TO_GET_KEYWORD_COMPLETION = "HEADER.START_TO_GET_KEYWORD_COMPLETION",
  HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION = "HEADER.SUCCEEDED_TO_GET_KEYWORD_COMPLETION",
  HEADER_FAILED_TO_GET_KEYWORD_COMPLETION = "HEADER.FAILED_TO_GET_KEYWORD_COMPLETION",
  HEADER_CLEAR_KEYWORD_COMPLETION = "HEADER.CLEAR_KEYWORD_COMPLETION",

  HOME_OPEN_KEYWORD_COMPLETION = "HOME.OPEN_KEYWORD_COMPLETION",
  HOME_ClOSE_KEYWORD_COMPLETION = "HOME.CLOSE_KEYWORD_COMPLETION",

  HOME_START_TO_GET_KEYWORD_COMPLETION = "HOME.START_TO_GET_KEYWORD_COMPLETION",
  HOME_SUCCEEDED_TO_GET_KEYWORD_COMPLETION = "HOME.SUCCEEDED_TO_GET_KEYWORD_COMPLETION",
  HOME_FAILED_TO_GET_KEYWORD_COMPLETION = "HOME.FAILED_TO_GET_KEYWORD_COMPLETION",
  HOME_CLEAR_KEYWORD_COMPLETION = "HOME.CLEAR_KEYWORD_COMPLETION",

  PAPER_SHOW_TOGGLE_AUTHOR_BOX = "PAPER_SHOW.TOGGLE_AUTHOR_BOX",

  PAPER_SHOW_START_TO_GET_CITATION_TEXT = "PAPER_SHOW.START_TO_GET_CITATION_TEXT",
  PAPER_SHOW_SUCCEEDED_GET_CITATION_TEXT = "PAPER_SHOW.SUCCEEDED_GET_CITATION_TEXT",
  PAPER_SHOW_FAILED_TO_GET_CITATION_TEXT = "PAPER_SHOW.FAILED_TO_GET_CITATION_TEXT",

  PAPER_SHOW_TOGGLE_CITATION_DIALOG = "PAPER_SHOW.TOGGLE_CITATION_DIALOG",
  PAPER_SHOW_CLICK_CITATION_TAB = "PAPER_SHOW.CLICK_CITATION_TAB",

  PAPER_SHOW_START_TO_DELETE_COMMENT = "PAPER_SHOW.START_TO_DELETE_COMMENT",
  PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT = "PAPER_SHOW.SUCCEEDED_TO_DELETE_COMMENT",
  PAPER_SHOW_FAILED_TO_DELETE_COMMENT = "PAPER_SHOW.PAPER_SHOW_FAILED_TO_DELETE_COMMENT",

  PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS = "PAPER_SHOW.START_TO_GET_REFERENCE_PAPERS",
  PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS = "PAPER_SHOW.SUCCEEDED_TO_GET_REFERENCE_PAPERS",
  PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS = "PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS",

  PAPER_SHOW_START_TO_GET_CITED_PAPERS = "PAPER_SHOW.START_TO_GET_CITED_PAPERS",
  PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS = "PAPER_SHOW.SUCCEEDED_TO_GET_CITED_PAPERS",
  PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS = "PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS",

  PAPER_SHOW_START_TO_GET_PAPER = "PAPER_SHOW.START_TO_GET_PAPER",
  PAPER_SHOW_SUCCEEDED_TO_GET_PAPER = "PAPER_SHOW.SUCCEEDED_TO_GET_PAPER",
  PAPER_SHOW_FAILED_TO_GET_PAPER = "PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_PAPER",
  PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS = "PAPER_SHOW.SUCCEEDED_TO_GET_COMMENTS",
  PAPER_SHOW_START_TO_GET_COMMENTS = "PAPER_SHOW.START_TO_GET_COMMENTS",
  PAPER_SHOW_FAILED_TO_GET_COMMENTS = "PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_COMMENTS",
  PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT = "PAPER_SHOW.SUCCEEDED_TO_POST_COMMENT",
  PAPER_SHOW_START_TO_POST_COMMENT = "PAPER_SHOW.START_TO_POST_COMMENT",
  PAPER_SHOW_FAILED_TO_POST_COMMENT = "PAPER_SHOW.PAPER_SHOW_FAILED_TO_POST_COMMENT",

  PAPER_SHOW_START_TO_CHECK_BOOKMARKED_STATUS = "PAPER_SHOW.START_TO_CHECK_BOOKMARKED_STATUS",
  PAPER_SHOW_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS = "PAPER_SHOW.SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS",
  PAPER_SHOW_FAILED_TO_CHECK_BOOKMARKED_STATUS = "PAPER_SHOW.FAILED_TO_CHECK_BOOKMARKED_STATUS",

  PAPER_SHOW_START_TO_GET_RELATED_PAPERS = "PAPER_SHOW.START_TO_GET_RELATED_PAPERS",
  PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS = "PAPER_SHOW.SUCCEEDED_TO_GET_RELATED_PAPERS",
  PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS = "PAPER_SHOW.FAILED_TO_GET_RELATED_PAPERS",

  PAPER_SHOW_START_TO_GET_OTHER_PAPERS = "PAPER_SHOW.START_TO_GET_OTHER_PAPERS",
  PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS = "PAPER_SHOW.SUCCEEDED_TO_GET_OTHER_PAPERS",
  PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS = "PAPER_SHOW.FAILED_TO_GET_OTHER_PAPERS",

  ARTICLE_SEARCH_TOGGLE_FILTER_BOX = "ARTICLE_SEARCH.TOGGLE_FILTER_BOX",
  ARTICLE_SEARCH_CHANGE_SEARCH_INPUT = "ARTICLE_SEARCH.CHANGE_SEARCH_INPUT",
  ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT = "ARTICLE_SEARCH.CHANGE_FILTER_RANGE_INPUT",
  ARTICLE_SEARCH_START_TO_GET_PAPERS = "ARTICLE_SEARCH.START_TO_GET_PAPERS",
  ARTICLE_SEARCH_FAILED_TO_GET_PAPERS = "ARTICLE_SEARCH.FAILED_TO_GET_PAPERS",
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS = "ARTICLE_SEARCH.SUCCEEDED_TO_GET_PAPERS",
  ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX = "ARTICLE_SEARCH.TOGGLE_EXPANDING_FILTER_BOX",

  ARTICLE_SEARCH_START_TO_GET_SUGGESTION_KEYWORD = "ARTICLE_SEARCH.START_TO_GET_SUGGESTION_KEYWORD",
  ARTICLE_SEARCH_FAILED_TO_GET_SUGGESTION_KEYWORD = "ARTICLE_SEARCH.FAILED_TO_GET_SUGGESTION_KEYWORD",
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD = "ARTICLE_SEARCH.SUCCEEDED_TO_GET_SUGGESTION_KEYWORD",

  ARTICLE_SEARCH_SET_ACTIVE_CITATION_DIALOG_PAPER_ID = "ARTICLE_SEARCH.SET_ACTIVE_CITATION_DIALOG_PAPER_ID",
  ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG = "ARTICLE_SEARCH.TOGGLE_CITATION_DIALOG",
  ARTICLE_SEARCH_CLICK_CITATION_TAB = "ARTICLE_SEARCH.CLICK_CITATION_TAB",
  ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT = "ARTICLE_SEARCH.START_TO_GET_CITATION_TEXT",
  ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT = "ARTICLE_SEARCH.SUCCEEDED_GET_CITATION_TEXT",
  ARTICLE_SEARCH_FAILED_TO_GET_CITATION_TEXT = "ARTICLE_SEARCH.FAILED_TO_GET_CITATION_TEXT",

  ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA = "ARTICLE_SEARCH.START_TO_GET_AGGREGATION_DATA",
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA = "ARTICLE_SEARCH.SUCCEEDED_TO_GET_AGGREGATION_DATA",
  ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA = "ARTICLE_SEARCH.FAILED_TO_GET_AGGREGATION_DATA",

  ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS = "ARTICLE_SEARCH.START_TO_GET_CITED_PAPERS",
  ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS = "ARTICLE_SEARCH.FAILED_TO_GET_CITED_PAPERS",
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS = "ARTICLE_SEARCH.SUCCEEDED_TO_GET_CITED_PAPERS",

  ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS = "ARTICLE_SEARCH.START_TO_GET_REFERENCE_PAPERS",
  ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS = "ARTICLE_SEARCH.FAILED_TO_GET_REFERENCE_PAPERS",
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS = "ARTICLE_SEARCH.SUCCEEDED_TO_GET_REFERENCE_PAPERS",

  BOOKMARK_PAGE_CLEAR_BOOkMARK_PAGE_STATE = "BOOKMARK_PAGE.CLEAR_BOOkMARK_PAGE_STATE",
  BOOKMARK_PAGE_SET_ACTIVE_CITATION_DIALOG_PAPER_ID = "BOOKMARK_PAGE.SET_ACTIVE_CITATION_DIALOG_PAPER_ID",
  BOOKMARK_PAGE_TOGGLE_CITATION_DIALOG = "BOOKMARK_PAGE.TOGGLE_CITATION_DIALOG",
  BOOKMARK_PAGE_TOGGLE_ABSTRACT = "BOOKMARK_PAGE.TOGGLE_ABSTRACT",
  BOOKMARK_PAGE_CLICK_CITATION_TAB = "BOOKMARK_PAGE.CLICK_CITATION_TAB",
  BOOKMARK_PAGE_START_TO_GET_CITATION_TEXT = "BOOKMARK_PAGE.START_TO_GET_CITATION_TEXT",
  BOOKMARK_PAGE_SUCCEEDED_GET_CITATION_TEXT = "BOOKMARK_PAGE.SUCCEEDED_GET_CITATION_TEXT",
  BOOKMARK_PAGE_FAILED_TO_GET_CITATION_TEXT = "BOOKMARK_PAGE.FAILED_TO_GET_CITATION_TEXT",

  AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR = "AUTHOR_SHOW.SUCCEEDED_GET_AUTHOR",
  AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS = "AUTHOR_SHOW.SUCCEEDED_GET_CO_AUTHORS",
  AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS = "AUTHOR_SHOW.SUCCEEDED_TO_GET_PAPERS",

  COLLECTION_SHOW_START_TO_GET_COLLECTION = "COLLECTION_SHOW.START_TO_GET_COLLECTION",
  COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION = "COLLECTION_SHOW.SUCCEEDED_GET_COLLECTION",
  COLLECTION_SHOW_FAILED_TO_GET_COLLECTION = "COLLECTION_SHOW.FAILED_TO_GET_COLLECTION"
}

export function createAction<T extends { type: ACTION_TYPES }>(d: T): T {
  return d;
}

interface GetMultiPapers extends CommonPaginationResponsePart {
  paperIds: number[];
}

interface GetMultiComments extends CommonPaginationResponsePart {
  commentIds: number[];
}

export const ActionCreators = {
  changeGlobalModal(payload: { type: GLOBAL_DIALOG_TYPE }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
      payload
    });
  },

  openGlobalModal(payload: {
    type: GLOBAL_DIALOG_TYPE;
    collectionDialogTargetId?: number;
  }) {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_OPEN, payload });
  },

  closeGlobalModal() {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE });
  },

  getCoAuthors(payload: { coAuthorIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS,
      payload
    });
  },

  getAuthor(payload: { authorId: number }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR,
      payload
    });
  },

  getAuthorPapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS,
      payload
    });
  },

  startToGetPaper() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER });
  },

  failedToGetPaper() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER });
  },

  getPaper(payload: { paperId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
      payload
    });
  },

  getRelatedPapers(payload: { paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
      payload
    });
  },

  getOtherPapersFromAuthor(payload: { paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS,
      payload
    });
  },

  getReferencePapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
      payload
    });
  },

  getCitedPapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS,
      payload
    });
  },

  startToGetComments() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS
    });
  },

  failedToGetComments() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS
    });
  },

  getComments(payload: GetMultiComments) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS,
      payload
    });
  },

  postComment(payload: { commentId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT,
      payload
    });
  },

  startToPostComment() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT
    });
  },

  failedToPostComment(payload: { paperId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT,
      payload
    });
  },

  startToDeleteComment() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT
    });
  },

  toggleCitationDialog() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_TOGGLE_CITATION_DIALOG
    });
  },

  toggleAuthorBox() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHOR_BOX });
  },

  handleClickCitationTab(payload: { tab: AvailableCitationType }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_CLICK_CITATION_TAB,
      payload
    });
  },

  succeededToDeleteComment(payload: { commentId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT,
      payload
    });
  },

  failedToDeleteComment() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT
    });
  },

  startToGetCitationText() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITATION_TEXT
    });
  },

  succeededToGetCitationText(payload: { citationText: string }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_CITATION_TEXT,
      payload
    });
  },

  failedToGetCitationText() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITATION_TEXT
    });
  },

  startToGetReferencePapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS
    });
  },

  failedToGetReferencePapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS
    });
  },

  startToGetCitedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS
    });
  },

  failedToGetCitedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS
    });
  },

  startToGetRelatedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS
    });
  },

  failedToGetRelatedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS
    });
  },

  startToGetAuthorOtherPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_OTHER_PAPERS
    });
  },

  failedToGetAuthorOtherPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS
    });
  },

  startToCheckBookmarkStatus() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_CHECK_BOOKMARKED_STATUS
    });
  },

  succeededToCheckBookmarkStatus(payload: {
    checkedStatus: CheckBookmarkedResponse;
  }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS,
      payload
    });
  },

  failedToCheckBookmarkStatus() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_CHECK_BOOKMARKED_STATUS
    });
  },

  startToPostBookmark(payload: { paper: Paper }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK,
      payload
    });
  },

  failedToRemoveBookmark(payload: { paper: Paper }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_BOOKMARK,
      payload
    });
  },

  failedToPostBookmark(payload: { paper: Paper }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK,
      payload
    });
  },

  startToRemoveBookmark(payload: { paper: Paper }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_START_TO_REMOVE_BOOKMARK,
      payload
    });
  },

  startToGetCollectionInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_COLLECTION
    });
  },

  succeededToGetCollectionInCollectionShow(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION,
      payload
    });
  },

  failedToGetCollectionInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION
    });
  },

  startToGetCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_COLLECTIONS
    });
  },

  succeededToGetCollectionsInGlobalDialog(payload: {
    collectionIds: number[];
  }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS,
      payload
    });
  },

  failedToGetCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS
    });
  },

  startToPostCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION
    });
  },

  succeededToPostCollectionInGlobalDialog(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION,
      payload
    });
  },

  failedToPostCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION
    });
  },

  startToAddPaperToCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_ADD_PAPER_TO_COLLECTIONS
    });
  },

  succeededToAddPaperToCollectionsInGlobalDialog(payload: {
    collections: Collection[];
  }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_ADD_PAPER_TO_COLLECTIONS,
      payload
    });
  },

  failedToAddPaperToCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_ADD_PAPER_TO_COLLECTIONS
    });
  },

  addEntity(payload: {
    entities: { [K in keyof AppEntities]?: AppEntities[K] };
    result: number | number[];
  }) {
    return createAction({ type: ACTION_TYPES.GLOBAL_ADD_ENTITY, payload });
  },

  flushEntities() {
    return createAction({ type: ACTION_TYPES.GLOBAL_FLUSH_ENTITIES });
  },

  globalLocationChange() {
    return createAction({ type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE });
  }
};

export type ActionUnion<T extends ActionCreatorsMapObject> = ReturnType<
  T[keyof T]
>;
export type Actions = ActionUnion<typeof ActionCreators>;
