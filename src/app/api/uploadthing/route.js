// route.js
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// สร้าง handler สำหรับ API
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
