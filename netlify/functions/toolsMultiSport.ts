import { NetlifyEvent } from "../_lib/types";
import { proxyTool } from "../_lib/proxyTool";

export async function handler(event: NetlifyEvent) {
  return proxyTool(event, "multi-sport");
}
