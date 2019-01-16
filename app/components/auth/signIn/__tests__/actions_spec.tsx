jest.mock("../../../../api/auth");
jest.mock("normalize.css", () => {});
jest.mock("../../../../helpers/makePlutoToastAction");
jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { SIGN_IN_ON_FOCUS_TYPE } from "../reducer";
import { SignInWithEmailParams, OAUTH_VENDOR } from "../../../../api/types/auth";
import { closeDialog } from "../../../dialog/actions";
import { push } from "connected-react-router";
import { RAW } from "../../../../__mocks__";

describe("signIn actions", () => {
  let store: any;
  let tempWindowLocationReplaceFunc: any;

  beforeAll(() => {
    tempWindowLocationReplaceFunc = window.location.replace;
  });

  afterAll(() => {
    window.location.replace = tempWindowLocationReplaceFunc;
  });

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeEmailInput action", () => {
    it("should return SIGN_IN_CHANGE_EMAIL_INPUT action with email payload", () => {
      const mockEmail = "tylor@pluto.network";
      store.dispatch(Actions.changeEmailInput(mockEmail));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT,
        payload: {
          email: mockEmail,
        },
      });
    });
  });

  describe("changePasswordInput action", () => {
    it("should return SIGN_IN_CHANGE_PASSWORD_INPUT action with password payload", () => {
      const mockPassword = "tylorshin";
      store.dispatch(Actions.changePasswordInput(mockPassword));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT,
        payload: {
          password: mockPassword,
        },
      });
    });
  });

  describe("onFocusInput action", () => {
    it("should return SIGN_IN_ON_FOCUS_INPUT action with type payload", () => {
      const mockOnFocusType = SIGN_IN_ON_FOCUS_TYPE.EMAIL;
      store.dispatch(Actions.onFocusInput(mockOnFocusType));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_ON_FOCUS_INPUT,
        payload: {
          type: mockOnFocusType,
        },
      });
    });
  });

  describe("onBlurInput action", () => {
    it("should return SIGN_IN_ON_BLUR_INPUT action", () => {
      store.dispatch(Actions.onBlurInput());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_ON_BLUR_INPUT,
      });
    });
  });

  describe("signInWithEmail action", () => {
    const mockIsDialog = false;
    const mockInValidEmail = "";
    const mockValidEmail = "hi@hanmail.net";
    const mockInValidPassword = "";
    const mockValidPassword = "Pluto@134$$";

    it("should return SIGN_IN_FORM_ERROR action with inValid email", () => {
      const mockSignInParams: SignInWithEmailParams = {
        email: mockInValidEmail,
        password: mockValidPassword,
      };
      store.dispatch(Actions.signInWithEmail(mockSignInParams, mockIsDialog));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      });
    });

    it("should return SIGN_IN_FORM_ERROR action with inValid password", () => {
      const mockSignInParams: SignInWithEmailParams = {
        email: mockValidEmail,
        password: mockInValidPassword,
      };
      store.dispatch(Actions.signInWithEmail(mockSignInParams, mockIsDialog));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      });
    });

    it("should return closeDialog action with valid email & password if isDialog is true", async () => {
      const mockTrueIsDialog = true;
      const mockSignInParams: SignInWithEmailParams = {
        email: mockValidEmail,
        password: mockValidPassword,
      };
      await store.dispatch(Actions.signInWithEmail(mockSignInParams, mockTrueIsDialog));
      const actions = store.getActions();
      expect(actions[1]).toEqual(closeDialog());
    });

    it("should return push action to home page  with valid email & password if isDialog is false", async () => {
      const mockFalseIsDialog = false;
      const mockSignInParams: SignInWithEmailParams = {
        email: mockValidEmail,
        password: mockValidPassword,
      };
      await store.dispatch(Actions.signInWithEmail(mockSignInParams, mockFalseIsDialog));
      const actions = store.getActions();
      expect(actions[1]).toEqual(push("/"));
    });

    it("should return SIGN_IN_SUCCEEDED_TO_SIGN_IN action with valid email & password", async () => {
      const mockSignInParams: SignInWithEmailParams = {
        email: mockValidEmail,
        password: mockValidPassword,
      };
      const mockUser = {
        ...RAW.MEMBER,
        email: mockValidEmail,
      };

      await store.dispatch(Actions.signInWithEmail(mockSignInParams, mockIsDialog));
      const actions = store.getActions();
      expect(JSON.stringify(actions[2])).toEqual(
        JSON.stringify({
          type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
          payload: {
            user: mockUser,
            loggedIn: true,
            oauthLoggedIn: false,
          },
        })
      );
    });
  });

  describe("signInWithSocial action", () => {
    const mockVendor: OAUTH_VENDOR = "GOOGLE";

    it("should call window.location.replace function", async () => {
      window.location.replace = jest.fn(() => {});
      await Actions.signInWithSocial(mockVendor);
      expect(window.location.replace).toHaveBeenCalled();
    });
  });

  describe("getAuthorizeCode action", () => {
    const mockCode = "ffsfdsdsf";
    const mockVendor: OAUTH_VENDOR = "GOOGLE";
    const mockOauthRedirectPath = "/search?query=dfsdfs";

    it("should return SIGN_IN_GET_AUTHORIZE_CODE action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, mockOauthRedirectPath));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_GET_AUTHORIZE_CODE,
      });
    });

    it("should return SIGN_IN_START_TO_SIGN_IN action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, mockOauthRedirectPath));
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN,
      });
    });

    it("should return push action to oauthRedirectPath if it exist", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, mockOauthRedirectPath));
      const actions = store.getActions();
      expect(actions[2]).toEqual(push(mockOauthRedirectPath));
    });

    it("should return push action to home page if it doesn't exist", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, ""));
      const actions = store.getActions();
      expect(actions[2]).toEqual(push("/"));
    });

    it("should return SIGN_IN_SUCCEEDED_TO_SIGN_IN type action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, ""));
      const actions = store.getActions();

      expect(actions[3].type).toEqual(ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN);
    });

    it("should return mockUser payload action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, ""));
      const actions = store.getActions();
      const mockUser = RAW.MEMBER;

      expect(JSON.stringify(actions[3].payload.user)).toEqual(JSON.stringify(mockUser));
    });

    it("should return loggedIn payload action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, ""));
      const actions = store.getActions();
      const mockLoggedIn = true;

      expect(actions[3].payload.loggedIn).toEqual(mockLoggedIn);
    });

    it("should return oauthLoggedIn payload action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor, ""));
      const actions = store.getActions();
      const mockOauthLoggedIn = true;

      expect(actions[3].payload.oauthLoggedIn).toEqual(mockOauthLoggedIn);
    });
  });

  describe("goBack action", () => {
    it("should return SIGN_IN_GO_BACK function", () => {
      store.dispatch(Actions.goBack());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_GO_BACK,
      });
    });
  });
});
