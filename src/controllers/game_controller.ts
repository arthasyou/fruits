import { eventManager } from 'phaser-utils';
import { socket } from '../socket';

export class GameController {
    constructor(private scene: Phaser.Scene) {
        // console.log("ghgheheir:", scene);
        this.initialize();
    }

    private initialize() {
        // 监听 dataManager 发出的事件，假设 eventName 是一个数字 id
        eventManager.on('1001', (data: any) => {
            this.handleDataUpdate(data);
        });
    }

    public send_cmd() {
        socket.send(1001, {});
    }

    private handleDataUpdate(data: any) {
        // 处理 dataManager 发来的数据
        console.log('Received data from dataManager:', JSON.stringify(data));

        const x = Phaser.Math.Between(64, this.scene.scale.width - 64);
        const y = Phaser.Math.Between(64, this.scene.scale.height - 64);
       
        this.scene.add.sprite(x, y, 'star');

    }
}
