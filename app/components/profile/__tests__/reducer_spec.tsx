jest.unmock("../reducer");
jest.unmock("../records");

import { List } from "immutable";
import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IProfileStateRecord, PROFILE_INITIAL_STATE } from "../records";
import { ICurrentUserRecord, recordifyCurrentUser } from "../../../model/currentUser";
import { RECORD } from "../../../__mocks__";

function reduceState(action: any, state: IProfileStateRecord = PROFILE_INITIAL_STATE) {
  return reducer(state, action);
}

describe("MyPage reducer", () => {
  let mockAction: any;
  let state: IProfileStateRecord;
  let mockState: IProfileStateRecord;

  describe("when receive PROFILE_START_TO_GET_USER_PROFILE", () => {
    it("should set isLoading to true", () => {
      mockAction = {
        type: ACTION_TYPES.PROFILE_START_TO_GET_USER_PROFILE,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeTruthy();
    });
  });

  describe("when receive PROFILE_SUCCEEDED_TO_GET_USER_PROFILE", () => {
    it("should set isLoading to false & set userProfile following userProfile payload", () => {
      const mockUserProfile: ICurrentUserRecord = recordifyCurrentUser({
        isLoggedIn: true,
        email: "test.com",
        name: "test",
        id: 123,
        reputation: null,
        profileImage: null,
        institution: null,
        major: null,
        wallet: null,
      });

      mockAction = {
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_GET_USER_PROFILE,
        payload: {
          userProfile: mockUserProfile,
        },
      };

      state = reduceState(mockAction);

      expect(state.userProfile).toEqual(mockUserProfile);
    });
  });

  describe("when receive PROFILE_FAILED_TO_GET_USER_PROFILE", () => {
    it("should set isLoading to false & hasError to true", () => {
      mockAction = {
        type: ACTION_TYPES.PROFILE_FAILED_TO_GET_USER_PROFILE,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeFalsy();
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER", () => {
    it("should set userProfile to following currentUser payload", () => {
      const mockCurrentUser: ICurrentUserRecord = recordifyCurrentUser({
        isLoggedIn: true,
        email: "test.com",
        name: "test",
        id: 123,
        reputation: null,
        profileImage: null,
        institution: null,
        major: null,
        wallet: null,
      });

      mockAction = {
        type: ACTION_TYPES.PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER,
        payload: {
          currentUser: mockCurrentUser,
        },
      };

      state = reduceState(mockAction);

      expect(state.userProfile).toEqual(mockCurrentUser);
    });
  });

  describe("when receive PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER", () => {
    it("should set profileImage, institution, major input to following profileImage, institution, major input payload", () => {
      const mockProfileImage = "test.com";
      const mockInstitution = "postech";
      const mockMajor = "CITE";

      mockAction = {
        type: ACTION_TYPES.PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER,
        payload: {
          profileImage: mockProfileImage,
          institution: mockInstitution,
          major: mockMajor,
        },
      };

      state = reduceState(mockAction);

      expect(state.profileImageInput).toEqual(mockProfileImage);
      expect(state.institutionInput).toEqual(mockInstitution);
      expect(state.majorInput).toEqual(mockMajor);
    });
  });

  describe("when receive MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT", () => {
    it("should set category following profileImage payload", () => {
      const mockProfileImage = "test.img";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT,
        payload: {
          profileImage: mockProfileImage,
        },
      };

      state = reduceState(mockAction);

      expect(state.profileImageInput).toEqual(mockProfileImage);
    });
  });

  describe("when receive MY_PAGE_CHANGE_INSTITUTION_INPUT", () => {
    it("should set category following institution payload", () => {
      const mockInstitution = "postech";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT,
        payload: {
          institution: mockInstitution,
        },
      };

      state = reduceState(mockAction);

      expect(state.institutionInput).toEqual(mockInstitution);
    });
  });

  describe("when receive MY_PAGE_CHANGE_MAJOR_INPUT", () => {
    it("should set category following major payload", () => {
      const mockMajor = "Postech";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
        payload: {
          major: mockMajor,
        },
      };

      state = reduceState(mockAction);

      expect(state.majorInput).toEqual(mockMajor);
    });
  });

  describe("when receive PROFILE_START_TO_FETCH_USER_ARTICLES", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingArticleError", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_ARTICLES,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingArticleLoading to true", () => {
      expect(state.fetchingArticleLoading).toBeTruthy();
    });

    it("should set fetchingArticleError to false", () => {
      expect(state.fetchingArticleError).toBeFalsy();
    });
  });

  describe("when receive PROFILE_FAILED_FETCH_USER_ARTICLES", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingArticleLoading", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_ARTICLES,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingArticleLoading to false", () => {
      expect(state.fetchingArticleLoading).toBeFalsy();
    });

    it("should set fetchingArticleError to true", () => {
      expect(state.fetchingArticleError).toBeTruthy();
    });
  });

  describe("when receive PROFILE_SUCCEEDED_FETCH_USER_ARTICLES", () => {
    const mockArticles = List([RECORD.ARTICLE]);

    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingArticleLoading", true).set("fetchingArticleError", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES,
        payload: {
          isEnd: true,
          nextPage: 1,
          articles: mockArticles,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingArticleLoading to false", () => {
      expect(state.fetchingArticleLoading).toBeFalsy();
    });

    it("should set fetchingArticleError to true", () => {
      expect(state.fetchingArticleError).toBeFalsy();
    });

    it("should set isEnd to payload's value", () => {
      expect(state.isEnd).toBeTruthy();
    });

    it("should set page to payload's value", () => {
      expect(state.page).toEqual(1);
    });

    it("should set articlesToShow to payload's value", () => {
      expect(state.articlesToShow).toEqual(mockArticles);
    });
  });
});
