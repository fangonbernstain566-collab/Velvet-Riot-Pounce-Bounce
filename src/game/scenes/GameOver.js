import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height).setAlpha(0.5);

        this.add.text(width / 2, height / 2, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: '24px', color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
