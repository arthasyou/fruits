import cfg from "../public/config.json";
import { WebSocketService } from "phaser-utils/src/services/websocket";
import { protoService } from "phaser-utils/src/services/proto_service";

WebSocketService.setUrl(cfg.socket_url);
protoService.initialize("proto/message.proto");

export const socket = WebSocketService.getInstance();
