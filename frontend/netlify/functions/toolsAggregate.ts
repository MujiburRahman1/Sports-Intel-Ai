import { proxyTool, NetlifyEvent } from "./_lib/toolsProxy";

export async function handler(event: NetlifyEvent) {
  return proxyTool(event, "aggregate");
}


