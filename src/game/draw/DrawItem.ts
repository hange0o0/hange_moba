class DrawItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DrawItemSkin";
    }


    private resultGroup: eui.Group;
    private headMC: eui.Image;
    private coinText: eui.Label;
    private bg: eui.Image;



    public index;
    public mid;
    public childrenCreated() {
        this.addBtnEvent(this,this.onClick)
        this.anchorOffsetX = 137/2
        this.anchorOffsetY = 179/2
    }

    private onClick(){
        if(this.mid)
        {
            MonsterList.getInstance().show([{id:this.mid}]);
            return
        }
        var self = this
       PayManager.getInstance().diamondDraw(function(id){
           self.showDraw(id)
       })
    }

    public reInit() {
        egret.Tween.removeTweens(this);

        this.x = (this.index%3)*160 + this.anchorOffsetX
        this.y = Math.floor(this.index/3)*200 + this.anchorOffsetY
        this.scaleX = 1;
        this.scaleY = 1;
        this.resultGroup.visible = false
        this.bg.visible = true
        this.mid = 0;
    }

    public showOtherDraw(id){
        var vo = MonsterVO.getObject(id);
        this.coinText.text = '×' + vo.cost
        this.headMC.source = vo.url;

        var tw = egret.Tween.get(this);
        tw.to({scaleX:0},150).call(function(){
            this.resultGroup.visible = true
            this.bg.visible = false
        },this).to({scaleX:1},150)
    }

    private showDraw(id){
        this.mid = id;
        var vo = MonsterVO.getObject(id);
        this.coinText.text = '×' + vo.cost
        this.headMC.source = vo.url;

        DrawUI.getInstance().showDrawMV();
        var tw = egret.Tween.get(this);
        var p = this.localToGlobal(this.anchorOffsetX,this.anchorOffsetY);
        this.x = p.x;
        this.y = p.y;
        GameManager.container.addChild(this);
        tw.to({x:GameManager.container.width/2,y:GameManager.container.height/2-100,scaleY:1.45},300).to({scaleY:1.4},100)
        var tw = egret.Tween.get(this);
        tw.to({scaleX:0},150).call(function(){
            this.resultGroup.visible = true
            this.bg.visible = false
        },this).to({scaleX:1.45},150).to({scaleX:1.4},100).call(function(){
            DrawResultUI.getInstance().show(this);
        })
    }


}