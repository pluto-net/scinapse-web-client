import * as React from "react";
const styles = require("./icons.scss");

interface IIconProps extends React.SVGAttributes<SVGElement> {
  icon: string;
}

const ICONS: { [key: string]: any } = {
  FACEBOOK      : require('./facebook.svg').default,
  FOOTER_LOGO   : require('./footer-logo.svg').default,
  GITHUB        : require('./github.svg').default,
  HEADER_LOGO   : require('./header-logo.svg').default,
  MEDIUM        : require('./medium.svg').default,
  TELEGRAM      : require('./telegram.svg').default,
  TWITTER_COPY  : require('./twitter-copy.svg').default,
};

class Icon extends React.PureComponent<IIconProps, {}> {
  public render() {
    let className = styles.icon;
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }
    const svg = ICONS[this.props.icon];
    if (!svg || typeof svg === "string") {
      return (
        <i className={className}>
          {svg}
        </i>
      );
    } else {
      const icon = `
      <svg viewBox="${svg.viewBox}">
        <use xlink:href="#${svg.id}" />
      </svg>`;

      return <i className={className} dangerouslySetInnerHTML={{ __html: icon }} />;
    }
  }
}

export default Icon;