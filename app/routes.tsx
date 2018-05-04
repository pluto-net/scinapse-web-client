import * as React from "react";
import { Route, Switch, RouteProps, match } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { Header, FeedbackButton, MobileHeader } from "./components/layouts";
import Home from "./components/home";
import ArticleSearch, { getSearchData, getAggregationData } from "./components/articleSearch";
import AuthComponent from "./components/auth";
import Bookmark from "./components/bookmark";
import PaperShow from "./components/paperShow";
import { fetchPaperShowData } from "./components/paperShow/sideEffect";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import DeviceDetector from "./components/deviceDetector";
import { AppState } from "./reducers";
import { LayoutStateRecord } from "./components/layouts/records";
import { withStyles } from "./helpers/withStylesHelper";
import EnvChecker from "./helpers/envChecker";
const styles = require("./root.scss");

export const HOME_PATH = "/";
export const SEARCH_RESULT_PATH = "/search";
export const USER_AUTH_PATH = "/users";
export const PAPER_SHOW_PATH = "/papers/:paperId";
export const BOOKMARK_PATH = "/bookmark";
export const ERROR_PATH = "/:errorNum";

export interface LoadDataParams {
  dispatch: Dispatch<any>;
  match: match<any>;
  pathname: string;
  queryParams?: any;
}

interface ServerRoutesMap {
  path: string;
  component: React.ComponentClass;
  exact?: boolean;
  loadData: (params: LoadDataParams) => Promise<any> | null;
}

export const routesMap: ServerRoutesMap[] = [
  {
    path: HOME_PATH,
    component: Home,
    loadData: null,
    exact: true,
  },
  {
    path: SEARCH_RESULT_PATH,
    component: ArticleSearch,
    loadData: async (params: LoadDataParams) => {
      await Promise.all([getSearchData(params), getAggregationData(params)]);
    },
    exact: true,
  },
  {
    path: PAPER_SHOW_PATH,
    component: PaperShow,
    loadData: async (params: LoadDataParams) => {
      await Promise.all([fetchPaperShowData(params, null)]);
    },
  },
  {
    path: USER_AUTH_PATH,
    component: AuthComponent,
    loadData: null,
  },
  {
    path: BOOKMARK_PATH,
    component: Bookmark,
    loadData: null,
  },
  {
    path: ERROR_PATH,
    component: ErrorPage,
    loadData: null,
  },
];

interface RootRoutesMappedStates {
  layout: LayoutStateRecord;
  routing: RouteProps;
}

interface RootRoutesProps extends DispatchProp<RootRoutesMappedStates> {
  layout: LayoutStateRecord;
  routing: RouteProps;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    routing: state.routing,
  };
}

@withStyles<typeof RootRoutes>(styles)
class RootRoutes extends React.PureComponent<RootRoutesProps, {}> {
  public render() {
    const { routing } = this.props;

    return (
      <div>
        {this.getBodyPartOfGTM()}
        {this.getDefaultHelmet()}
        {this.getHeader()}
        <div>
          <Switch location={routing.location}>
            {routesMap.map((route, index) => <Route {...route} key={`route_path_${index}`} />)}
          </Switch>
        </div>
        <DeviceDetector />
        <DialogComponent />
        <FeedbackButton />
      </div>
    );
  }

  private getGTMID = () => {
    if (EnvChecker.isDev()) {
      return null;
    } else if (EnvChecker.isStage()) {
      return "GTM-55VLM5G";
    } else {
      // production client
      return "GTM-NMPJ7CC";
    }
  };

  private getBodyPartOfGTM = () => {
    if (EnvChecker.isServer()) {
      return null;
    } else {
      const content = `
      <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${this.getGTMID()}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
      `;
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }
  };

  private getGTMScriptTagString = () => {
    if (EnvChecker.isServer()) {
      return null;
    } else {
      // tslint:disable-next-line:max-line-length
      return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${this.getGTMID()}');`;
    }
  };

  private getPingdomScript = () => {
    if (!EnvChecker.isServer()) {
      if (EnvChecker.isStage()) {
        return <script src="//rum-static.pingdom.net/pa-5aebf36536f64000060000a9.js" async />;
      } else if (EnvChecker.isDev()) {
        return null;
      } else {
        // production
        return <script src="//rum-static.pingdom.net/pa-5aebf2bfa42dbb0007000096.js" async />;
      }
    } else {
      return null;
    }
  };

  private getDefaultHelmet = () => {
    return (
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://assets.pluto.network/scinapse/favicon.ico" />
        <title>Sci-napse | Academic search engine for paper</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta itemProp="name" content="sci-napse | Academic search engine for paper" />
        <script type="text/javascript">{this.getGTMScriptTagString()}</script>
        {this.getPingdomScript()}
        <meta
          name="description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta
          name="twitter:description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta itemProp="image" content="http://assets.pluto.network/og-image.png" />
        <meta name="twitter:card" content="Pluto Network" />
        <meta name="twitter:site" content="@pluto_network" />
        <meta name="twitter:title" content="sci-napse | Academic search engine for paper" />
        <meta name="twitter:creator" content="@pluto_network" />
        <meta name="twitter:image" content="http://assets.pluto.network/og-image.png" />
        <meta property="og:title" content="sci-napse | Academic search engine for paper" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://scinapse.io" />
        <meta property="og:image" content="http://assets.pluto.network/og-image.png" />
        <meta
          property="og:description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta property="og:site_name" content="Scinapse" />
        <meta name="msvalidate.01" content="55ADC81A3C8F5F3DAA9B90F27CA16E2B" />
        <meta name="naver-site-verification" content="7d18d3ed0937f117e25916bedc455a29b049cc21" />
        <meta name="google-site-verification" content="k8AlM7HozNZC2PPvw-A3R3ImCXIvpMp8ZoKHhx_K01M" />
        <meta name="google-site-verification" content="V5Ejg0v9-MhpQSPoZbPzJRDy-SWNnFUu6TdO3MmcaB8" />
        <meta name="google-site-verification" content="YHiVYg7vff8VWXZge2D1aOZsT8rCUxnkjwbQqFT2QEI" />
      </Helmet>
    );
  };

  private getHeader = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return <MobileHeader />;
    } else {
      return <Header />;
    }
  };
}

export const ConnectedRootRoutes = connect(mapStateToProps)(RootRoutes);
