import { proxyTool } from "./_lib/toolsProxy";

export async function handler(event: any) {
  return proxyTool(event, "predict");
}
