class MyInfoItem extends game.BaseItem {

    private chooseMC: eui.Image;
    private bg: eui.Image;
    private redMC: eui.Image;
    private lockMC: eui.Button;
    private titleText: eui.Label;

    public constructor() {
        super();
        this.skinName = "MyInfoItemSkin";
    }


    public childrenCreated() {
        this.addBtnEvent(this,this.onClick);
    }

    private onClick(){
        this.data.fun && this.data.fun();
    }

    public dataChanged() {
        this.titleText.text = this.data.title
        this.titleText.text = this.data.des
        this.bg.source = this.data.icon
        if(this.data.fun)
        {
            this.lockMC.visible = true;
            this.lockMC.label = this.data.btn || '提升' ;
        }
        else
        {
            this.lockMC.visible = false;
        }

        if('myValue' in  this.data)
        {
             if(this.data.myValue > this.data.otherValue)
             {
                 this.titleText.text = '+' + (this.data.myValue - this.data.otherValue)
                 this.titleText.textColor = 0xFFFF00
             }
             else if(this.data.myValue < this.data.otherValue)
             {
                 this.titleText.text = '' + (this.data.myValue - this.data.otherValue)
                 this.titleText.textColor = 0xFF0000
             }
            else
             {
                 this.titleText.text = '--';
                 this.titleText.textColor = 0xCCB48E
             }
        }

        this.onTimer();
    }

    public onTimer(){
        if(this.data.onTimer)
            this.titleText.text = this.data.onTimer();
    }


}