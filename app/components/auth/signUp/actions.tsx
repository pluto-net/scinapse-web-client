import { Dispatch } from "redux";
import * as ReactGA from "react-ga";
import AuthAPI from "../../../api/auth";
import { PostExchangeResult, OAUTH_VENDOR, GetAuthorizeUriResult } from "../../../api/types/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import validateEmail from "../../../helpers/validateEmail";
import { SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP, SignUpState, SignUpOauthInfo, SignUpErrorCheck } from "./reducer";
import { closeDialog } from "../../dialog/actions";
import alertToast from "../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../helpers/envChecker";
import { Member } from "../../../model/member";
import { trackEvent, trackDialogView } from "../../../helpers/handleGA";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export const checkDuplicatedEmail = async (email: string) => {
  const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);
  if (checkDuplicatedEmailResult.duplicated) {
    return "Email address already exists";
  }
  return null;
};

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function changeFirstNameInput(name: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_FIRST_NAME_INPUT,
    payload: {
      name,
    },
  };
}

export function changeLastNameInput(name: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_LASTNAME_INPUT,
    payload: {
      name,
    },
  };
}

export function checkValidNameInput(name: string, type: keyof SignUpErrorCheck) {
  if (name.length === 0) {
    return makeFormErrorMessage(type, `Please enter ${type}`);
  } else {
    return removeFormErrorMessage(type);
  }
}

export function changeAffiliationInput(affiliation: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT,
    payload: {
      affiliation,
    },
  };
}

export function checkValidAffiliationInput(affiliation: string) {
  const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

  if (isAffiliationTooShort) {
    return makeFormErrorMessage("affiliation", "Please enter affiliation");
  } else {
    return removeFormErrorMessage("affiliation");
  }
}

export function makeFormErrorMessage(type: keyof SignUpErrorCheck, errorMessage: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
    payload: {
      type,
      errorMessage,
    },
  };
}

export function removeFormErrorMessage(type: keyof SignUpErrorCheck) {
  return {
    type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    payload: {
      type,
    },
  };
}

export function onFocusInput(type: SIGN_UP_ON_FOCUS_TYPE) {
  return {
    type: ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT,
    payload: {
      type,
    },
  };
}

export function onBlurInput() {
  return {
    type: ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT,
  };
}

export function changeSignUpStep(step: SIGN_UP_STEP) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP,
    payload: {
      step,
    },
  };
}

export function signUpWithEmail(currentStep: SIGN_UP_STEP, signUpState: SignUpState, isDialog: boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password, affiliation, firstName, lastName } = signUpState;

    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
        const isInValidEmail: boolean = !validateEmail(email);
        if (isInValidEmail) {
          dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
        } else {
          dispatch(removeFormErrorMessage("email"));
        }

        let isDuplicatedEmail: boolean = false;
        if (!isInValidEmail) {
          try {
            const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
            });

            if (checkDuplicatedEmailResult.duplicated) {
              dispatch(makeFormErrorMessage("email", "Email address already exists"));
              isDuplicatedEmail = true;
            } else {
              dispatch(removeFormErrorMessage("password"));
            }
          } catch (err) {
            alertToast({
              type: "error",
              message: `Failed to sign up with email.`,
            });
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
            });
            throw err;
          }
        }

        const isPasswordTooShort = password.length < 8;
        if (password === "" || password.length <= 0) {
          dispatch(makeFormErrorMessage("password", "Please enter password"));
        } else if (password.length < 8) {
          dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
        } else {
          dispatch(removeFormErrorMessage("password"));
        }

        trackEvent({ category: "sign_up", action: "try_to_sign_up_step_1", label: "with_email" });

        if (isInValidEmail || isDuplicatedEmail || isPasswordTooShort) {
          trackEvent({ category: "sign_up", action: "failed_to_sign_up_step_1", label: "with_email" });
          throw new Error();
        }

        dispatch(changeSignUpStep(SIGN_UP_STEP.WITH_EMAIL));
        break;
      }

      case SIGN_UP_STEP.WITH_EMAIL: {
        const isInValidEmail: boolean = !validateEmail(email);

        if (isInValidEmail) {
          dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
        } else {
          dispatch(removeFormErrorMessage("email"));
        }

        let isDuplicatedEmail: boolean = false;

        if (!isInValidEmail) {
          try {
            const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
            });

            if (checkDuplicatedEmailResult.duplicated) {
              dispatch(makeFormErrorMessage("email", "Email address already exists"));
              isDuplicatedEmail = true;
            } else {
              dispatch(removeFormErrorMessage("password"));
            }
          } catch (err) {
            alertToast({
              type: "error",
              message: `Failed to sign up with email.`,
            });
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
            });
            throw err;
          }
        }

        const isPasswordEmpty = password === "" || password.length <= 0;
        const isPasswordShort = password.length < 8;
        const isPasswordNotValid = isPasswordEmpty || isPasswordShort;

        if (isPasswordEmpty) {
          dispatch(makeFormErrorMessage("password", "Please enter password"));
        } else if (isPasswordShort) {
          dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
        } else {
          dispatch(removeFormErrorMessage("password"));
        }

        const isFirstNameTooShort = firstName === "" || firstName.length <= 0;

        if (isFirstNameTooShort) {
          dispatch(makeFormErrorMessage("firstName", "Please enter the first name"));
        } else {
          dispatch(removeFormErrorMessage("firstName"));
        }

        const isLastNameTooShort = lastName === "" || lastName.length <= 0;
        if (isLastNameTooShort) {
          dispatch(makeFormErrorMessage("lastName", "Please enter the last name"));
        } else {
          dispatch(removeFormErrorMessage("lastName"));
        }

        const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

        if (isAffiliationTooShort) {
          dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
        } else {
          dispatch(removeFormErrorMessage("affiliation"));
        }

        if (
          isInValidEmail ||
          isDuplicatedEmail ||
          isPasswordNotValid ||
          isAffiliationTooShort ||
          isFirstNameTooShort ||
          isLastNameTooShort
        ) {
          throw new Error();
        }

        dispatch({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });

        trackEvent({ category: "sign_up", action: "try_to_sign_up", label: "with_email" });

        try {
          const signUpResult: Member = await AuthAPI.signUpWithEmail({
            email,
            password,
            firstName,
            affiliation,
            lastName,
          });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
          });

          // Auto Sign in after Sign up at API Server. So we don't need to call sign in api again.
          dispatch({
            type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
            payload: {
              user: signUpResult,
              loggedIn: true,
              oauthLoggedIn: false, // Because this method is signUpWithEmail
            },
          });

          dispatch(changeSignUpStep(SIGN_UP_STEP.FINAL_WITH_EMAIL));
          alertToast({
            type: "success",
            message: "Succeeded to Sign Up!!",
          });
          trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: "with_email" });
        } catch (err) {
          trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: "with_email" });
          alertToast({
            type: "error",
            message: `Failed to sign up with email.`,
          });
          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
          throw err;
        }
        break;
      }
      case SIGN_UP_STEP.FINAL_WITH_EMAIL: {
        if (isDialog) {
          dispatch(closeDialog());
          trackDialogView("signUpWithEmailClose");
        }
        break;
      }

      default:
        break;
    }
  };
}

export function signUpWithSocial(currentStep: SIGN_UP_STEP, vendor: OAUTH_VENDOR, signUpState?: SignUpState) {
  return async (dispatch: Dispatch<any>) => {
    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
        if (!vendor) {
          throw new Error();
        }
        try {
          const origin = EnvChecker.getOrigin();
          const redirectUri = `${origin}/users/sign_up?vendor=${vendor}`;
          const authorizeUriData: GetAuthorizeUriResult = await AuthAPI.getAuthorizeUri({
            vendor,
            redirectUri,
          });

          trackEvent({ category: "sign_up", action: "try_to_sign_up_step_1", label: `with_${vendor}` });

          if (!EnvChecker.isOnServer()) {
            ReactGA.set({ referrer: origin });
            window.location.replace(authorizeUriData.uri);
          }
        } catch (err) {
          alertToast({
            type: "error",
            message: `Failed to sign up with social account.`,
          });

          trackEvent({ category: "sign_up", action: "failed_to_sign_up_step_1", label: `with_${vendor}` });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
          throw err;
        }
        break;
      }

      case SIGN_UP_STEP.WITH_SOCIAL: {
        if (signUpState) {
          const { email, affiliation, firstName, oauth, lastName } = signUpState;

          const isInValidEmail: boolean = !validateEmail(email);

          if (isInValidEmail) {
            dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
          } else {
            dispatch(removeFormErrorMessage("email"));
          }

          let isDuplicatedEmail: boolean = false;

          if (!isInValidEmail) {
            try {
              const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

              dispatch({
                type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
              });

              if (checkDuplicatedEmailResult.duplicated) {
                dispatch(makeFormErrorMessage("email", "Email address already exists"));
                isDuplicatedEmail = true;
              } else {
                dispatch(removeFormErrorMessage("email"));
              }
            } catch (err) {
              alertToast({
                type: "error",
                message: `Failed to sign up with social account.`,
              });
              dispatch({
                type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
              });
              throw err;
            }
          }

          const isFirstNameTooShort = firstName === "" || firstName.length <= 0;
          if (isFirstNameTooShort) {
            dispatch(makeFormErrorMessage("firstName", "Please enter the first name"));
          } else {
            dispatch(removeFormErrorMessage("firstName"));
          }

          const isLastNameTooShort = lastName === "" || lastName.length <= 0;
          if (isLastNameTooShort) {
            dispatch(makeFormErrorMessage("lastName", "Please enter the last name"));
          } else {
            dispatch(removeFormErrorMessage("lastName"));
          }

          const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

          if (isAffiliationTooShort) {
            dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
          } else {
            dispatch(removeFormErrorMessage("affiliation"));
          }

          if (
            isInValidEmail ||
            isDuplicatedEmail ||
            isFirstNameTooShort ||
            isAffiliationTooShort ||
            isLastNameTooShort
          ) {
            throw new Error();
          }

          dispatch({
            type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
          });

          trackEvent({ category: "sign_up", action: "try_to_sign_up", label: `with_${vendor}` });

          try {
            const signUpResult: Member = await AuthAPI.signUpWithSocial({
              email,
              firstName,
              affiliation,
              lastName,
              oauth: {
                oauthId: oauth!.oauthId,
                uuid: oauth!.uuid,
                vendor: oauth!.vendor!,
              },
            });

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
            });

            trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: `with_${vendor}` });

            // Auto Sign in after Sign up at API Server. So we don't need to call sign in api again.
            dispatch({
              type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
              payload: {
                user: signUpResult,
                loggedIn: true,
                oauthLoggedIn: true, // Because this method is signUpWithSocial
              },
            });
          } catch (err) {
            alertToast({
              type: "error",
              message: `Failed to sign up!`,
            });
            trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: `with_${vendor}` });
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
            });
            throw err;
          }
        }
        break;
      }

      default:
        break;
    }
  };
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR, alreadySignUpCB: () => void) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE,
    });

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE,
    });

    try {
      const origin = EnvChecker.getOrigin();
      const redirectUri = `${origin}/users/sign_up?vendor=${vendor}`;

      const postExchangeData: PostExchangeResult = await AuthAPI.postExchange({
        code,
        vendor,
        redirectUri,
      });

      if (postExchangeData.connected) {
        alertToast({
          type: "error",
          message: "You already did sign up with this account.",
        });
        dispatch({
          type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
        });
        alreadySignUpCB();
        return;
      }

      const oAuth: SignUpOauthInfo = {
        code,
        oauthId: postExchangeData.oauthId,
        uuid: postExchangeData.uuid,
        vendor,
      };

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE,
        payload: {
          vendor,
          email: postExchangeData.userData.email || "",
          firstName: postExchangeData.userData.name || "",
          lastName: "",
          oauth: oAuth,
        },
      });
    } catch (_err) {
      alertToast({
        type: "error",
        message: `Failed to sign up with social account.`,
      });
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
      });
      dispatch(goBack());
    }
  };
}

export function goBack() {
  return {
    type: ACTION_TYPES.SIGN_UP_GO_BACK,
  };
}
