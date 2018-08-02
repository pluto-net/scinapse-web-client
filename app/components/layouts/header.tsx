import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { throttle, Cancelable, debounce } from "lodash";
import Popover from "@material-ui/core/Popover";
import { push } from "connected-react-router";
import MenuItem from "@material-ui/core/MenuItem";
import KeywordCompletion from "./components/keywordCompletion";
import { AppState } from "../../reducers";
import Icon from "../../icons";
import { signOut } from "../auth/actions";
import * as Actions from "./actions";
import { openSignIn, openSignUp } from "../dialog/actions";
import { trackAction, trackDialogView, trackAndOpenLink } from "../../helpers/handleGA";
import { changeSearchInput, handleSearchPush } from "../articleSearch/actions";
import InputBox from "../common/inputBox/inputBox";
import { HeaderProps } from "./types/header";
import { withStyles } from "../../helpers/withStylesHelper";
import EnvChecker from "../../helpers/envChecker";
import { HOME_PATH } from "../../routes";
const styles = require("./header.scss");

const HEADER_BACKGROUND_START_HEIGHT = 10;

function mapStateToProps(state: AppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    articleSearchState: state.articleSearch,
  };
}

export interface HeaderSearchParams {
  query?: string;
  page?: string;
  references?: string;
  cited?: string;
}

interface HeaderStates {
  isTop: boolean;
  isUserDropdownOpen: boolean;
  userDropdownAnchorElement: HTMLElement | null;
}

@withStyles<typeof Header>(styles)
class Header extends React.PureComponent<HeaderProps, HeaderStates> {
  private handleScroll: (() => void) & Cancelable;
  private userDropdownAnchorRef: HTMLElement | null;

  constructor(props: HeaderProps) {
    super(props);

    this.handleScroll = throttle(this.handleScrollEvent, 300);

    this.state = {
      isTop: true,
      isUserDropdownOpen: false,
      userDropdownAnchorElement: this.userDropdownAnchorRef,
    };
  }

  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isOnServer()) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  public render() {
    const navClassName = this.getNavbarClassName();

    return (
      <nav className={`${navClassName} mui-fixed`}>
        <div className={styles.headerContainer}>
          <Link to="/" onClick={() => trackAction("/", "headerLogo")} className={styles.headerLogo}>
            <Icon icon="SCINAPSE_LOGO" />
          </Link>
          <div className={styles.leftBox}>
            <a
              onClick={() => {
                trackAndOpenLink("about-in-header");
              }}
              href="https://pluto.network"
              target="_blank"
              className={styles.link}
            >
              About
            </a>
            <a
              onClick={() => {
                trackAndOpenLink("updates-in-header");
              }}
              href="https://medium.com/pluto-network/update/home"
              target="_blank"
              className={styles.link}
            >
              Updates
            </a>
          </div>
          {this.getSearchFormContainer()}
          {this.getHeaderButtons()}
        </div>
      </nav>
    );
  }

  private getNavbarClassName = () => {
    const { location } = this.props;

    if (location.pathname !== HOME_PATH) {
      if (this.state.isTop) {
        return styles.navbar;
      } else {
        return `${styles.navbar} ${styles.scrolledNavbar}`;
      }
    } else {
      if (this.state.isTop) {
        return `${styles.navbar} ${styles.searchHomeNavbar}`;
      } else {
        return `${styles.navbar} ${styles.scrolledNavbar} ${styles.searchHomeNavbar}`;
      }
    }
  };

  private handleScrollEvent = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (scrollTop < HEADER_BACKGROUND_START_HEIGHT) {
      this.setState({
        isTop: true,
      });
    } else {
      this.setState({
        isTop: false,
      });
    }
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(changeSearchInput(searchInput));

    if (searchInput.length > 1) {
      this.delayedGetKeywordCompletion(searchInput);
    } else if (searchInput.length <= 1) {
      dispatch(Actions.clearKeywordCompletion());
    }
  };

  private getKeywordCompletion = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.getKeywordCompletion(searchInput));
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 400);

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(handleSearchPush(articleSearchState.searchInput));
  };

  private getSearchFormContainer = () => {
    const { location, articleSearchState, layoutState } = this.props;

    const isShowSearchFormContainer = location.pathname !== HOME_PATH;

    return (
      <form
        style={!isShowSearchFormContainer ? { visibility: "hidden" } : {}}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          this.handleSearchPush();
        }}
        className={styles.searchFormContainer}
      >
        <div onBlur={this.handleSearchInputBlur}>
          <InputBox
            onChangeFunc={this.changeSearchInput}
            onFocusFunc={this.handleSearchInputFocus}
            defaultValue={articleSearchState.searchInput}
            placeHolder="Search papers by title, author, doi or keyword"
            type="headerSearch"
            className={styles.inputBox}
            onClickFunc={this.handleSearchPush}
            onKeyDown={this.handleKeydown}
          />
          <KeywordCompletion
            handleClickCompletionKeyword={this.handleClickCompletionKeyword}
            query={articleSearchState.searchInput}
            isOpen={layoutState.isKeywordCompletionOpen}
            keywordList={layoutState.completionKeywordList}
            isLoadingKeyword={layoutState.isLoadingKeywordCompletion}
          />
        </div>
      </form>
    );
  };

  private handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 40) {
      e.preventDefault();

      const target: any =
        e.currentTarget.parentNode &&
        e.currentTarget.parentNode.nextSibling &&
        e.currentTarget.parentNode.nextSibling.firstChild;

      if (target) {
        target.focus();
      }
    }
  };

  private handleClickCompletionKeyword = (path: string) => {
    const { dispatch } = this.props;

    dispatch(push(path));
  };

  private handleSearchInputFocus = () => {
    const { dispatch, articleSearchState } = this.props;

    if (!!articleSearchState.searchInput && articleSearchState.searchInput.length > 1) {
      dispatch(Actions.getKeywordCompletion(articleSearchState.searchInput));
    }

    dispatch(Actions.openKeywordCompletion());
  };

  private handleSearchInputBlur = (e: React.FocusEvent) => {
    const { dispatch } = this.props;

    const nextTarget: any = e.relatedTarget;
    console.log(nextTarget && nextTarget.className);
    if (nextTarget && nextTarget.className && nextTarget.className.includes("keywordCompletionItem")) {
      return;
    }

    dispatch(Actions.closeKeywordCompletion());
  };

  private handleClickSignOut = () => {
    const { dispatch } = this.props;

    dispatch(signOut());
    this.handleRequestCloseUserDropdown();
  };

  private handleOpenSignIn = () => {
    const { dispatch } = this.props;

    dispatch(openSignIn());
  };

  private handleOpenSignUp = () => {
    const { dispatch } = this.props;

    dispatch(openSignUp());
  };

  private handleToggleUserDropdown = () => {
    this.setState({
      userDropdownAnchorElement: this.userDropdownAnchorRef,
      isUserDropdownOpen: !this.state.isUserDropdownOpen,
    });
  };

  private handleRequestCloseUserDropdown = () => {
    this.setState({
      isUserDropdownOpen: false,
    });
  };

  private getUserDropdown = () => {
    const { currentUserState } = this.props;

    const firstCharacterOfUsername = currentUserState.name.slice(0, 1).toUpperCase();

    return (
      <div>
        <div
          className={styles.userDropdownChar}
          ref={el => (this.userDropdownAnchorRef = el)}
          onClick={this.handleToggleUserDropdown}
        >
          {firstCharacterOfUsername}
        </div>
        <Popover
          open={this.state.isUserDropdownOpen}
          anchorEl={this.state.userDropdownAnchorElement!}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          onClose={this.handleRequestCloseUserDropdown}
        >
          <MenuItem classes={{ root: styles.signOutButton }} onClick={this.handleClickSignOut}>
            Sign Out
          </MenuItem>
        </Popover>
      </div>
    );
  };

  private getLoggedInRightBox = () => {
    const { currentUserState } = this.props;

    return (
      <div className={styles.rightBox}>
        <Link to={`/users/${currentUserState.id}/collections`} className={styles.collectionButton}>
          <Icon className={styles.collectionIcon} icon="COLLECTION" />
          <span>Collection</span>
        </Link>
        {this.getUserDropdown()}
      </div>
    );
  };

  private getHeaderButtons = () => {
    const { currentUserState } = this.props;
    const { isLoggedIn } = currentUserState;

    if (!isLoggedIn) {
      return (
        <div className={styles.rightBox}>
          <div
            onClick={() => {
              this.handleOpenSignIn();
              trackDialogView("headerSignInOpen");
            }}
            className={styles.signInButton}
          >
            Sign in
          </div>
          <div
            onClick={() => {
              this.handleOpenSignUp();
              trackDialogView("headerSignUpOpen");
            }}
            className={styles.signUpButton}
          >
            Get Started
          </div>
        </div>
      );
    } else {
      return this.getLoggedInRightBox();
    }
  };
}

export default withRouter(connect(mapStateToProps)(Header));
