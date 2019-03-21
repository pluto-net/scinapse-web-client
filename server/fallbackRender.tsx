import { Helmet } from "react-helmet";
import { initialState } from "../app/reducers";
import { generateFullHTML } from "../app/helpers/htmlWrapper";

export default function fallbackJSOnlyRender(scriptPath: string, version: string) {
  const helmet = Helmet.renderStatic();
  const fullHTML: string = generateFullHTML({
    reactDom: "",
    scriptPath,
    helmet,
    initialState: JSON.stringify(initialState),
    css: "",
    version,
  });

  return fullHTML;
}