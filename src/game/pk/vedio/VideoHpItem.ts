class VideoHpItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoHpItemSkin";
    }

    private hpText: eui.Label;
    private backBar: eui.Image;
    private frontBar: eui.Image;



    private barWidth = 150;
    public mcWidth = 160;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {

        var max = this.data.max;
        var last = this.data.last;
        var current = this.data.current;
        if(!this.data.isNegative)
        {
            if(this.data.value < 0)
                console.log(this.data)
            this.hpText.text = '+' + this.data.value
            this.hpText.textColor = 0x00ff00;
            this.backBar.source = 'bar1_png'
            this.backBar.width = current/max*this.barWidth;
            this.frontBar.source = 'bar3_png'
            this.frontBar.width = last/max*this.barWidth;
        }
        else
        {
            this.hpText.text = '' + (this.data.value || '-0')
            this.hpText.textColor = 0xff0000;
            this.backBar.source = 'bar4_png'
            this.backBar.width = last/max*this.barWidth;
            this.frontBar.source = 'bar3_png'
            this.frontBar.width = current/max*this.barWidth;
        }
    }
}