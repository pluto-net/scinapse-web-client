import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
const styles = require("./signIn.scss");
import Icon from "../../../icons";
import { ISignInStateRecord } from "./records";

export interface ISignInContainerProps {
  dispatch: Dispatch<any>;
  signInState: ISignInStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    signInState: state.signIn,
  };
}

class SignIn extends React.PureComponent<ISignInContainerProps, {}> {
  private handleEmailChange = (email: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeEmailInput(email));
  };

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changePasswordInput(password));
  };

  private signIn = () => {
    const { signInState, dispatch } = this.props;
    const email = signInState.email;
    const password = signInState.password;

    dispatch(
      Actions.signIn({
        email,
        password,
      }),
    );
  };

  public render() {
    const { signInState } = this.props;

    return (
      <div className={styles.signInContainer}>
        <div className={styles.formContainer}>
          <div className={styles.authNavBar}>
            <Link className={styles.signInLink} to="sign_in">
              Sign in
            </Link>
            <Link className={styles.signUpLink} to="sign_up">
              Sign up
            </Link>
          </div>
          <div
            className={
              signInState.get("emailErrorContent") === "" ? (
                styles.formBox
              ) : (
                `${styles.formBox} ${styles.hasError}`
              )
            }
          >
            <Icon className={styles.iconWrapper} icon="EMAIL_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleEmailChange(e.currentTarget.value);
              }}
              placeholder="E-mail"
              value={signInState.email}
              className={`form-control ${styles.inputBox}`}
              type="email"
            />
          </div>
          <div className={styles.errorContent}>
            {signInState.get("emailErrorContent")}
          </div>
          <div
            className={
              signInState.get("passwordErrorContent") === "" ? (
                styles.formBox
              ) : (
                `${styles.formBox} ${styles.hasError}`
              )
            }
          >
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handlePasswordChange(e.currentTarget.value);
              }}
              value={signInState.password}
              placeholder="Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div className={styles.errorContent}>
            {signInState.get("passwordErrorContent")}
          </div>
          <div onClick={this.signIn} className={styles.submitBtn}>
            Sign in
          </div>
          <Link className={styles.forgotPassword} to="recovery">
            Forgot password?
          </Link>
          <div className={styles.orSeparatorBox}>
            <div className={styles.dashedSeparator} />
            <div className={styles.orContent}>or</div>
            <div className={styles.dashedSeparator} />
          </div>
          <Link className={styles.createAccountBtn} to="sign_up">
            Create Account
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignIn);
