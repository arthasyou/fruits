
import cfg from "../public/config.json";
import { WebSocketService } from "phaser-utils";
import { protoService } from 'phaser-utils';
WebSocketService.setUrl(cfg.socket_url);
protoService.initialize("proto/message.proto");

export const socket = WebSocketService.getInstance();