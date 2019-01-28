import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { AUTHOR_PAPER_LIST_SORT_TYPES } from "../common/sortBox";

export interface CollectionShowState
  extends Readonly<{
      isLoadingCollection: boolean;
      failedToLoadingCollection: boolean;
      isLoadingPaperToCollection: boolean;
      isShareDropdownOpen: boolean;
      mainCollectionId: number;
      totalPaperListPage: number;
      currentPaperListPage: number;
      papersTotalCount: number;
      sortType: AUTHOR_PAPER_LIST_SORT_TYPES;
      searchKeyword: string;
      paperIds: number | number[];
    }> {}

export const INITIAL_COLLECTION_SHOW_STATE: CollectionShowState = {
  isLoadingCollection: false,
  failedToLoadingCollection: false,
  isLoadingPaperToCollection: false,
  isShareDropdownOpen: false,
  mainCollectionId: 0,
  totalPaperListPage: 0,
  currentPaperListPage: 1,
  papersTotalCount: 0,
  sortType: "RECENTLY_ADDED",
  searchKeyword: "",
  paperIds: [],
};

export function reducer(
  state: CollectionShowState = INITIAL_COLLECTION_SHOW_STATE,
  action: Actions
): CollectionShowState {
  switch (action.type) {
    case ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: true,
        failedToLoadingCollection: false,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        mainCollectionId: action.payload.collectionId,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        failedToLoadingCollection: true,
      };
    }
    case ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_PAPERS: {
      return {
        ...state,
        isLoadingPaperToCollection: true,
      };
    }
    case ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_PAPERS: {
      return {
        ...state,
        isLoadingPaperToCollection: false,
      };
    }
    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_PAPERS: {
      const pageRes = action.payload.paperResponse.page;
      const paperIds = action.payload.paperResponse.result;

      return pageRes
        ? {
            ...state,
            isLoadingPaperToCollection: false,
            paperIds,
            sortType: action.payload.sort as AUTHOR_PAPER_LIST_SORT_TYPES,
            totalPaperListPage: pageRes.totalPages,
            currentPaperListPage: pageRes.page,
            papersTotalCount: pageRes.totalElements,
            searchKeyword: action.payload.query ? action.payload.query : "",
          }
        : { ...state, isLoadingPaperToCollection: false, paperIds };
    }

    case ACTION_TYPES.COLLECTION_SHOW_OPEN_SHARE_DROPDOWN: {
      return {
        ...state,
        isShareDropdownOpen: true,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_CLOSE_SHARE_DROPDOWN: {
      return {
        ...state,
        isShareDropdownOpen: false,
      };
    }

    default:
      return state;
  }
}
