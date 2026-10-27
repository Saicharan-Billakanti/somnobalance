import handler from "vinext/server/fetch-handler";
import { checkSiteAccess } from "../src/lib/siteAccess";

const worker = {
  async fetch(request, env, ctx) {
    const denied = checkSiteAccess(request, env);
    if (denied) return denied;
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
