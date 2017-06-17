class PKMainHp extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKMainHpSkin";
    }


    private hpGroup: eui.Group;
    private backBar: eui.Rect;
    private frontBar: eui.Rect;







    public childrenCreated() {
        this.anchorOffsetX = 54
    }

    public dataChanged() {
        egret.Tween.removeTweens(this.backBar)
        egret.Tween.removeTweens(this.frontBar)
        egret.Tween.removeTweens(this)
        var data = this.data;
        var decColor = 0xFF0000
        var addColor = 0x00FF00
        var rate1 = data.last/data.max
        var rate2 = data.current/data.max

        this.visible = true;
        this.alpha = 0;
        var tw = egret.Tween.get(this);
        tw.to({y:this.y + 10,alpha:1},100).wait(500).to({alpha:0},100).call(function(){
            MyTool.removeMC(this);
            this.visible = false
        },this)

        var w = 100;
        if(rate1 < rate2)
        {
            //this.hpText.text = '+' + data.value
            //this.hpText.textColor = 0x00ff00;
            this.backBar.fillColor = addColor;
            this.backBar.width = rate1*w;
            this.frontBar.width = rate1*w;
            var tw = egret.Tween.get(this.backBar)
            tw.wait(100).to({width:rate2*w},300);

        }
        else
        {
            //this.hpText.text = '' + (data.value || '-0')
            //this.hpText.textColor = 0xff0000;
            this.backBar.fillColor = decColor;
            this.backBar.width = rate1*w;
            this.frontBar.width = rate1*w;
            var tw = egret.Tween.get(this.frontBar)
            tw.wait(100).to({width:rate2*w},300).wait(100)
        }
        //
        //var tw = egret.Tween.get(this);
        //this.hpText.text = data.last
        //tw.wait(200).to({hpTextValue:data.current},300);
    }

    //public get hpTextValue(){
    //    return parseInt(this.hpText.text)
    //}
    //public set hpTextValue(v){
    //    this.hpText.text = Math.floor(v) + ''
    //}


}