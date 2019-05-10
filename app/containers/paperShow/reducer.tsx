import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { PAPER_SHOW_INITIAL_STATE, PaperShowState } from "./records";

export function reducer(state: PaperShowState = PAPER_SHOW_INITIAL_STATE, action: Actions): PaperShowState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER: {
      return { ...state, ...{ hasErrorOnFetchingPaper: null, isLoadingPaper: false, paperId: action.payload.paperId } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER: {
      return { ...state, ...{ hasErrorOnFetchingPaper: null, isLoadingPaper: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER: {
      return { ...state, ...{ hasErrorOnFetchingPaper: action.payload.statusCode, isLoadingPaper: false, paperId: 0 } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS: {
      return { ...state, ...{ isLoadingReferencePapers: true, isFailedToGetReferencePapers: false } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingReferencePapers: false,
          isFailedToGetReferencePapers: false,
          referencePaperTotalPage: action.payload.totalPages,
          referencePaperCurrentPage: action.payload.number,
          referencePaperIds: action.payload.paperIds,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS: {
      return { ...state, ...{ isLoadingReferencePapers: false, isFailedToGetReferencePapers: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS: {
      return { ...state, ...{ isLoadingCitedPapers: true, isFailedToGetCitedPapers: false } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingCitedPapers: false,
          isFailedToGetCitedPapers: false,
          citedPaperTotalPage: action.payload.totalPages,
          citedPaperCurrentPage: action.payload.number,
          citedPaperIds: action.payload.paperIds,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS: {
      return { ...state, ...{ isLoadingCitedPapers: false, isFailedToGetCitedPapers: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_LOADING_FETCH_PDF: {
      return { ...state, isFetchingPdf: true };
    }

    case ACTION_TYPES.PAPER_SHOW_END_TO_LOADING_FETCH_PDF: {
      return { ...state, isFetchingPdf: false };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_BEST_PDF:
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_BEST_PDF: {
      return { ...state, isOACheckingPDF: false };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_BEST_PDF: {
      return { ...state, isOACheckingPDF: true };
    }

    default:
      return state;
  }
}
