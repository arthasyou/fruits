import cfg from "../public/config.json";
import { WebSocketService } from "phaser-utils/src/services/websocket";
import { protoService } from "phaser-utils/src/services/proto_service";

function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const mode = getQueryParam("session_id");

const socketUrl: string = mode
  ? `${cfg.socket_url}?session_id=${mode}`
  : cfg.socket_url;

WebSocketService.setUrl(socketUrl);
protoService.initialize("proto/message.proto", "pba");

export const socket = WebSocketService.getInstance();
