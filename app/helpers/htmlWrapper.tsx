import { HelmetData } from "react-helmet";

export function staticHTMLWrapper(
  reactDom: string,
  scriptPath: string,
  helmet: HelmetData,
  initialState: string,
  css: string,
) {
  return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
      ${helmet.title.toString()}
      ${helmet.script.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
        <style type="text/css">${css}</style>
      </head>
      <body>
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMPJ7CC"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">${reactDom}</div>
        <script src="${scriptPath}"></script>
      </body>
    </html>
  `;
}
