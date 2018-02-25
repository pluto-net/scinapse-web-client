// tslint:disable-next-line:no-implicit-dependencies
import * as express from "express";
import { serverSideRender } from "../app/server";

const server = express();

(global as any).navigator = { userAgent: "all" };

console.log("START SERVER");
server.disable("x-powered-by").get("/*", async (req: express.Request, res: express.Response) => {
  const mockUserAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36";

  const rendered = await serverSideRender({
    requestUrl: req.url,
    scriptPath: "http://localhost:8080/bundle.js",
    userAgent: mockUserAgent,
  });
  res.send(rendered);
});

const port: number = Number(process.env.PORT) || 3000;

server
  .listen(port, () => console.log(`Express server listening at ${port}! Visit https://localhost:${port}`))
  .on("error", err => console.error(err));
