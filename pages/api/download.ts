// pnp v2 dùng `new Request("")` trong mergeHeaders() — Node.js 18+ undici reject URL rỗng.
// Override globals với node-fetch ở module level (chạy 1 lần khi server start, trước mọi request).
// pages/ router chạy Node.js runtime nên không ảnh hưởng Edge/middleware.
import * as NodeFetch from "node-fetch";
(global as any).Request = NodeFetch.Request;
(global as any).Headers = NodeFetch.Headers;
(global as any).Response = NodeFetch.Response;

import { Runtime } from "@pnp/common-commonjs";
import { BearerTokenFetchClient } from "@pnp/nodejs-commonjs";
import { SPRest } from "@pnp/sp-commonjs";
import "@pnp/sp-commonjs/files";
import "@pnp/sp-commonjs/webs";
import type { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";

const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".zip": "application/zip",
};

function createSp(token: string, spUrl: string): SPRest {
  const spRest = new SPRest({}, spUrl, new Runtime(new Map()));
  spRest.setup({
    sp: {
      baseUrl: spUrl,
      fetchClientFactory: () => new BearerTokenFetchClient(token),
    },
  });
  return spRest;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, spUrl, fileUrl } = req.body as {
    token?: string;
    spUrl?: string;
    fileUrl?: string;
  };

  if (!token) return res.status(401).json({ error: "Thiếu token" });
  if (!spUrl) return res.status(400).json({ error: "Thiếu spUrl" });
  if (!fileUrl) return res.status(400).json({ error: "Thiếu fileUrl" });

  try {
    const sp = createSp(token, spUrl);
    const serverRelativeUrl = fileUrl.trim();
    const decodedUrl = decodeURIComponent(serverRelativeUrl);

    const arrayBuffer = await sp.web
      .getFileByServerRelativeUrl(serverRelativeUrl)
      .getBuffer();

    const buffer = Buffer.from(arrayBuffer);
    const fileName = path.posix.basename(decodedUrl);
    const ext = path.posix.extname(fileName).toLowerCase();

    res.setHeader("Content-Type", MIME_MAP[ext] ?? "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    res.setHeader("Content-Length", buffer.length);
    return res.status(200).send(buffer);
  } catch (err) {
    const msg: string = (err as Error)?.message ?? String(err);
    if (msg.includes("401")) return res.status(401).json({ error: "Token không hợp lệ hoặc hết hạn" });
    if (msg.includes("403")) return res.status(403).json({ error: "Không có quyền truy cập file" });
    if (msg.includes("404")) return res.status(404).json({ error: `Không tìm thấy file: ${fileUrl}` });
    return res.status(500).json({ error: msg });
  }
}
