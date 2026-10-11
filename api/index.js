import serverless from "serverless-http";
import { createApp } from "../server/app.js";

const app = createApp({ serveStatic: false });
const handler = serverless(app, {
  binary: ["multipart/form-data", "image/*", "application/octet-stream"],
});

export default async function vercelHandler(req, res) {
  // Preserve /api/... path when rewritten to this function
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 30,
};
