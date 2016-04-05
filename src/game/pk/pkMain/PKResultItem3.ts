class PKResultItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem3Skin";
    }

    private headMC: eui.Image;
    private arrowMC: eui.Image;
    private barMC: eui.Image;
    private iconText: eui.BitmapLabel;
    private hpText: eui.Label;

    public index = 0;
    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChanged() {
        if(this.index == 1)//left
        {
            if(this.data.isWin)
                this.currentState = 'left_win';
            else
                this.currentState = 'left_loss';
        }
        else if(this.index == 2)//left
        {
            if(this.data.isWin)
                this.currentState = 'right_win';
            else
                this.currentState = 'right_loss';
        }

        var word = '';
        for(var i=0;i<this.data.winCount;i++)
        {
            word += 'w';
        }
        if(!this.data.isWin)
        {
            word += 'l';
        }
        this.iconText.text = word;

        if(this.data.after > this.data.before)  //上升
        {
            this.hpText.text = (this.data.after - this.data.before)   + '';
            this.hpText.textColor = 0x000000;
            this.arrowMC.source = ''
        }
        else
        {
            this.hpText.text = (this.data.before - this.data.after)   + ''
            this.hpText.textColor = 0xFE7430;
            this.arrowMC.source = 'arrow4_png';
       }

        this.barMC.width = 78 * this.data.after/this.data.afterMax;

        this.headMC.source = MonsterVO.getObject(this.data.mid).thumb;

    }
}
