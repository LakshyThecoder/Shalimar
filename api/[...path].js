import serverless from "serverless-http";
import { createApp } from "../server/app.js";

const app = createApp({ serveStatic: false });
const handler = serverless(app, {
  binary: ["multipart/form-data", "image/*", "application/octet-stream"],
});

export default async function vercelHandler(req, res) {
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 30,
};
