import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.scale;

        // Background image (wall) - scaled to game size
        const bg = this.add.image(width/2, height/2, 'wall').setDisplaySize(width, height).setDepth(0);

        // Dim overlay to improve contrast
        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.35).setDepth(1);

        // Card dimensions (centered panel)
        const cardW = Math.min(420, width - 40);
        const cardH = Math.min(220, height - 40);
        const cardX = (width - cardW) / 2;
        const cardY = (height - cardH) / 2;

        // Panel (rounded card)
        const panel = this.add.graphics({ x: cardX, y: cardY, depth: 2 });
        panel.fillStyle(0x0f1724, 0.9);
        panel.fillRoundedRect(0, 0, cardW, cardH, 12);
        panel.lineStyle(2, 0xffffff, 0.06);
        panel.strokeRoundedRect(0, 0, cardW, cardH, 12);

        // Title and subtitle
        const title = this.add.text(width/2, cardY + 28, 'ROBOT DEFENSE', {
            fontFamily: 'Arial Black', fontSize: Math.round(cardW * 0.07) + 'px', color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5).setDepth(3);

        const subtitle = this.add.text(width/2, cardY + 60, 'Defend Against the Factory Robots', {
            fontFamily: 'Arial', fontSize: Math.round(cardW * 0.03) + 'px', color: '#FFD84A',
            stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setDepth(3);

        // Helper for modern buttons
        const createButton = (x, y, w, h, color, label, cb) => {
            const btn = this.add.rectangle(x, y, w, h, color).setDepth(3).setInteractive();
            btn.setStrokeStyle(2, 0x000000, 0.2);
            const txt = this.add.text(x, y, label, {
                fontFamily: 'Arial Black', fontSize: Math.round(w * 0.12) + 'px', color: '#ffffff'
            }).setOrigin(0.5).setDepth(4);

            btn.on('pointerover', () => {
                this.tweens.add({ targets: [btn, txt], scaleX: 1.06, scaleY: 1.06, duration: 120 });
            });
            btn.on('pointerout', () => {
                this.tweens.add({ targets: [btn, txt], scaleX: 1.0, scaleY: 1.0, duration: 120 });
            });
            btn.on('pointerdown', () => {
                this.tweens.add({ targets: [btn, txt], scaleX: 0.98, scaleY: 0.98, duration: 80, yoyo: true });
                cb();
            });
            return { btn, txt };
        };

        // Buttons layout
        const btnW = Math.round(cardW * 0.28);
        const btnH = Math.round(cardH * 0.2);
        const buttonSpacing = 14;
        const leftX = width/2 - (btnW/2) - (buttonSpacing / 2);
        const rightX = width/2 + (btnW/2) + (buttonSpacing / 2);
        const midY = cardY + Math.round(cardH * 0.58);

        // START and SETTINGS
        createButton(leftX, midY, btnW, btnH, 0x20c997, 'START', () => this.scene.start('Game'));
        createButton(rightX, midY, btnW, btnH, 0x3461ff, 'SETTINGS', () => { console.log('Open settings'); });

        // Small instructions line
        this.add.text(width/2, cardY + cardH - 22, 'ARROW KEYS • MOVE   •   SPACE • SHOOT', {
            fontFamily: 'Arial', fontSize: '12px', color: '#ffffff', align: 'center'
        }).setOrigin(0.5).setDepth(3);

        // Simple entrance animation for panel + texts
        [panel, title, subtitle].forEach((obj, i) => {
            obj.alpha = 0;
            this.tweens.add({ targets: obj, alpha: 1, delay: i * 80, duration: 300 });
        });
    }
}
