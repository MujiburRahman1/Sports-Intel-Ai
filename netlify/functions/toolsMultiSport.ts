import { NetlifyEvent } from "../_lib/types";
import { proxyTool } from "../_lib/toolsProxy";

export async function handler(event: NetlifyEvent) {
  return proxyTool(event, "multi-sport");
}
