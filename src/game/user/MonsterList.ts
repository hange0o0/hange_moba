class MonsterList extends game.BaseUI {
    private static instance:MonsterList;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterList();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollGroupCon: eui.Group;
    private scrollGroup: eui.Group;
    private info: MonsterInfoBase;
    private info2: MonsterInfoBase;
    private bottomGroup: eui.Group;
    private leftBtn: eui.Group;
    private la: eui.Image;
    private lt: eui.Label;
    private rightBtn: eui.Group;
    private ra: eui.Image;
    private rt: eui.Label;
    private pageText: eui.Label;
    private pageGroup: eui.Group;
    private p0: eui.Image;
    private p1: eui.Image;
    private p2: eui.Image;
    private p3: eui.Image;
    private p4: eui.Image;
    private p5: eui.Image;
    private p6: eui.Image;
    private p7: eui.Image;
    private p8: eui.Image;
    private p9: eui.Image;
    private levelUpGroup: eui.Group;
    private levelUpCon: eui.Group;
    private coinText: eui.Label;
    private levelUpBtn: eui.Button;
    private levelUpText: eui.Label;
    private cardText: eui.Label;






    public index;
    public dataArray;
    public startPos
    public rota

    public isLevelUp = false

    public constructor() {
        super();
        this.skinName = "MonsterListUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡牌详情')
        this.topUI.addEventListener('hide',this.hide,this);


        this.addBtnEvent(this.leftBtn, this.onLeft);
        this.addBtnEvent(this.rightBtn, this.onRight);
        this.addBtnEvent(this.levelUpBtn, this.onLevelUp);

        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,true)
        this.scroller.bounces = false;

        MyTool.removeMC(this.info2)
        this.info.addEventListener(egret.Event.RESIZE,this.onResizeInfo,this)
    }

    private onResizeInfo(){
        if(this.scroller.viewport.scrollV + this.scroller.height > this.scroller.viewport.contentHeight)
            this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
    }

    private onLevelUp(){
        if(this.levelUpBtn.skinName != 'Btn_r2Skin')
            return;
        var self = this;
        var oo =  this.dataArray[this.index];
        TecManager.getInstance().levelUp(3,oo.id,function(){
            self.renewLevelUp();
        });
    }

    private onBegin(e:egret.TouchEvent){
        if(this.scroller.viewport.contentHeight > this.scroller.viewport.height)//有垂直滚动
        {
            return;
        }

        this.rota = 0;
        this.scrollGroup.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
        this.startPos = {x:e.stageX,tx:this.scrollGroup.x};
    }

    private onMove(e:egret.TouchEvent){
        if(e.stageX > this.startPos.x && this.index == 0) //前一页
            return
        if(e.stageX < this.startPos.x && this.index >= this.dataArray.length - 1) //后一页
            return
        if(!this.startPos.drag)
        {
            if(Math.abs(e.stageX - this.startPos.x) > 10)
            {
                this.startPos.drag = true;
            }
        }
        if(this.startPos.drag)
        {
            this.scrollGroup.x = this.startPos.tx + e.stageX-this.startPos.x;
            var rota = this.scrollGroup.x<0?1:-1
            if(rota != this.rota)
            {
                this.rota = rota;
                this.renewInfo2()
            }
        }
    }

    private onEnd(e:egret.TouchEvent){
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
        if(Math.abs(this.scrollGroup.x - this.startPos.tx) > 150)//可翻页
        {
            if(this.scrollGroup.x > this.startPos.tx)//右移
            {
                this.onLeft();
            }
            else
            {
                this.onRight();
            }
        }
        else
        {
            this.rota = 0
            this.scrollToCurrentPage();
        }
    }

    //滚动后防止按钮事件被触发
    private onTouchTap(e:egret.TouchEvent){
        if(this.startPos && this.startPos.drag)
        {
            e.stopPropagation();
        }
    }

    private scrollToCurrentPage(){
        egret.Tween.removeTweens(this.scrollGroup)
        var tw:egret.Tween = egret.Tween.get(this.scrollGroup);
        var targetX = -this.rota * 640;
        tw.to({x: targetX}, Math.min(200, 200 * Math.abs(targetX - this.scrollGroup.x) / 500)).call(this.renew,this);
    }

    private renewInfo2(){
        this.info2.x = 640*this.rota;
        var oo =  this.dataArray[this.index + this.rota];
        if(oo)
        {
            this.scrollGroup.addChild(this.info2);
            this.info2.renew(oo.id,oo.specialData)
        }
        else
            MyTool.removeMC(this.info2)
    }


    private onLeft(){
        if(this.index > 0)
        {
            this.rota = -1;
            this.renewInfo2();
            this.index --;
            this.scrollToCurrentPage()
        }
        else if(this.rota)
        {
            this.rota = 0;
            this.scrollToCurrentPage()
        }
    }

    private onRight(){
        if(this.index < this.dataArray.length-1)
        {
            this.rota = 1;
            this.renewInfo2();
            this.index ++;
            this.scrollToCurrentPage()
        }
        else if(this.rota)
        {
            this.rota = 0;
            this.scrollToCurrentPage()
        }
    }


    public show(list?,index?){
        this.dataArray = list;
        this.index = index || 0;
        this.isLevelUp = false;
        super.show();
    }

    public showLevelUp(vo){
        this.dataArray = [{id:vo.id,specialData:{isLevelUp:true}}]
        this.index = 0;
        this.isLevelUp = true;
        super.show();
    }

    public onShow(){
        if(this.dataArray.length <2 && !this.isLevelUp)
        {
            this.bottomGroup.visible = false;
            this.scroller.bottom = 0;
        }
        else
        {
            this.bottomGroup.visible = true;
            this.scroller.bottom = 80;
        }


        this.renew();
        this.once(egret.Event.RENDER,function(){
            this.info.setMinHeight(this.scroller.height);
            this.info2.setMinHeight(this.scroller.height);
        },this);
    }

    public renew(){
        this.rota = 0;
        MyTool.removeMC(this.info2)
        this.scrollGroup.x = 0;
        var oo =  this.dataArray[this.index];
        this.info.renew(oo.id,oo.specialData)
        //this.once(egret.Event.ENTER_FRAME,function(){
        //    if(this.scroller.viewport.scrollV + this.scroller.height > this.scroller.viewport.contentHeight)
        //        this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
        //},this)


        if(this.isLevelUp)
            this.renewLevelUp();
        else
            this.renewPage();
    }

    public renewLevelUp(){
        var oo =  this.dataArray[this.index];
        var TEC = TecManager.getInstance();
        this.levelUpGroup.visible = true;
        this.pageGroup.visible = false;
        var cost = TEC.needCoin(UM.getMonsterLevel(oo.id) + 1)

        var arr = TecManager.getInstance().collectRate(oo.id);
        var collectNeed = arr[1];
        var collectNum = arr[0];
        if(collectNeed == 0)
        {
            this.levelUpCon.visible = false
            this.levelUpText.visible = true;
            this.levelUpText.text = '已达本位面最高等级';
            return;
        }
        this.levelUpText.visible = false;
        this.levelUpCon.visible = true
        var b = true
        if(cost > UM.coin)
        {
            b = false
            this.setHtml(this.coinText, '<font color="#ff0000">' + cost + '</font>/' + UM.coin);
        }
        else
            this.coinText.text = '' + cost + '/' + UM.coin;

        if(collectNeed > collectNum)
        {
            b = false
            this.setHtml(this.cardText, '<font color="#ff0000">' + collectNeed + '</font>/' + collectNum);
        }
        else
        {
            this.cardText.text = '' + collectNeed + '/' + collectNum;
        }

        if(b)
            this.levelUpBtn.skinName = 'Btn_r2Skin'
        else
            this.levelUpBtn.skinName = 'Btn_d2Skin'


    }

    public renewPage(){
        this.levelUpGroup.visible = false;
        this.pageGroup.visible = true;
        if(this.dataArray.length <2)
            return;
        if(this.index > 0)
        {
            this.la.source = 'arrow1_png'
            this.lt.textColor = 0xCBB46B
        }
        else
        {
            this.la.source = 'arrow3_png'
            this.lt.textColor = 0x734B41
        }

        if(this.index < this.dataArray.length-1)
        {
            this.ra.source = 'arrow1_png'
            this.rt.textColor = 0xCBB46B
        }
        else
        {
            this.ra.source = 'arrow3_png'
            this.rt.textColor = 0x734B41
        }

        this.pageText.text =  (this.index + 1) + '/' + this.dataArray.length;

        var current = this.index%10;
        var max = 10;
        if(Math.ceil(this.dataArray.length/10) ==  Math.ceil((this.index+1)/10))//最后一页
        {
            max = this.dataArray.length%10 || 10;
        }

        for(var i=0;i<10;i++)
        {
            var mc = this['p' + i];
            if(i<max)
            {
                this.pageGroup.addChild(mc);
                if(i == current)//当前
                    mc.source = 'point2_png';
                else
                    mc.source = 'point1_png';
            }
            else
            {
                MyTool.removeMC(mc);
            }
        }
    }
}