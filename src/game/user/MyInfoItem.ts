class MyInfoItem extends game.BaseItem {

    private icon: eui.Image;
    private titleText: eui.Label;
    private desText: eui.Label;
    private addText: eui.Label;
    private btn: eui.Group;
    private btnText: eui.Label;


    public constructor() {
        super();
        this.skinName = "MyInfoItemSkin";
    }


    public childrenCreated() {
        this.addBtnEvent(this.btn,this.onClick);
    }

    private onClick(){
        this.data.fun && this.data.fun();
    }

    public dataChanged() {
        this.titleText.text = this.data.title
        MyTool.setColorText(this.desText,this.data.des + '')
        this.icon.source = this.data.icon
        if(this.data.fun)
        {
            this.btn.visible = true;
            this.btnText.text = this.data.btn || '提升' ;
        }
        else
        {
            this.btn.visible = false;
        }

        if('myValue' in  this.data)
        {
             if(this.data.myValue > this.data.otherValue)
             {
                 if(this.data.isRate)
                     this.addText.text = '+' + MyTool.toFixed((this.data.myValue - this.data.otherValue)*100,1)  + '%'
                 else
                     this.addText.text = '+' + (this.data.myValue - this.data.otherValue)
                 this.addText.textColor = 0xFFFF00
             }
             else if(this.data.myValue < this.data.otherValue)
             {
                 if(this.data.isRate)
                     this.addText.text = '-' + MyTool.toFixed(Math.abs(this.data.myValue - this.data.otherValue)*100,1)  + '%'
                 else
                     this.addText.text = '' + (this.data.myValue - this.data.otherValue)
                 this.addText.textColor = 0xFF0000
             }
            else
             {
                 this.addText.text = '--';
                 this.addText.textColor = 0xCCB48E
             }
        }
        else
            this.addText.text = ''

        this.onTimer();
    }

    public onTimer(){
        if(this.data.onTimer)
            this.desText.text = this.data.onTimer();
    }


}