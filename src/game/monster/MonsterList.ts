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








    public index;
    public dataArray;
    public startPos
    public rota
    public pageSize = 8
    private dragTimer = 0;

    //public isLevelUp = false

    public constructor() {
        super();
        this.skinName = "MonsterListUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡兵详情')
        this.topUI.addEventListener('hide',this.hide,this);


        this.addBtnEvent(this.leftBtn, this.onLeft);
        this.addBtnEvent(this.rightBtn, this.onRight);


        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        //this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        //this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,true)
        this.scroller.bounces = false;

        MyTool.removeMC(this.info2)
        //this.info.addEventListener(egret.Event.RESIZE,this.onResizeInfo,this)
        //this.info2.addEventListener(egret.Event.RESIZE,this.onResizeInfo,this)

        for(var i=0;i<10;i++)
        {
             var mc = this['p' + i];
            mc.index = i-1;
            this.addBtnEvent(mc,this.onPageClick)
        }
    }



    private onPageClick(e){
        var index = e.target.index
        var page = Math.ceil((this.index+1)/this.pageSize)
        index = index + (page-1)*this.pageSize;
        if(index == this.index)
            return;

        if(index < this.index)
        {
            this.rota = -1;
        }
        else if(index > this.index)
        {
            this.rota = 1;
        }

        this.renewInfo2(index);
        this.index = index;
        this.scrollToCurrentPage()
    }

    //private onResizeInfo(){
    //    if(this.scroller.viewport.scrollV + this.scroller.height > this.scroller.viewport.contentHeight)
    //        this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
    //}



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
        var cd = Math.min(200, 200 * Math.abs(targetX - this.scrollGroup.x) / 500);
        tw.to({x: targetX}, cd).call(function(){
            var temp = this.info;
            this.info = this.info2;
            this.info2 = temp;
            this.renew();
        },this);

        //this.info2.y = this.scroller.viewport.scrollV;


        //var tw:egret.Tween = egret.Tween.get(this.scroller.viewport);
        //tw.to({scrollV: 0},cd);
    }

    private renewInfo2(index = -1){
        this.info2.x = 640*this.rota;
        this.info2.y = this.scroller.viewport.scrollV;
        if(index == -1)
            index = this.index + this.rota
        var oo =  this.dataArray[index];
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

    public showID(id){
        this.show([{id:id}])
    }

    public hide(){
        super.hide();
        GuideManager.getInstance().showGuide(CollectUI.getInstance());
        TaskManager.getInstance().cleanNowAcrion('comment');
    }

    public show(list?,index?){
        this.dataArray = list;
        this.index = index || 0;
        //this.isLevelUp = false;
        super.show();
    }

    //public showLevelUp(vo){
    //    this.dataArray = [{id:vo.id,specialData:{isLevelUp:true}}]
    //    this.index = 0;
    //    this.isLevelUp = true;
    //    super.show();
    //}

    public onShow(){
        this.rt.text = ''
        this.lt.text = ''
        GuideManager.getInstance().enableScrollV(this.scroller);
        var w = 93
        var h = 86
        var toY = this.stage.stageHeight - h - 10;
        var toX = 640-w - 10;
        if(this.dataArray.length <2)
        {
            this.bottomGroup.visible = false;
            this.scroller.bottom = 0;
        }
        else
        {
            this.bottomGroup.visible = true;
            this.scroller.bottom = 80;
            toY -= 80;
        }


        this.scroller.viewport.scrollV = 0;
        this.renew();
        this.once(egret.Event.RENDER,function(){
            this.info.setMinHeight(this.scroller.height);
            this.info2.setMinHeight(this.scroller.height);
        },this);

        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewLevelUp)
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewLevelUp)

        GuideManager.getInstance().showGuide(MonsterList.getInstance());


    }

    private renewLevelUp(){
        this.info.renewLevelUp();
    }

    public renew(){
        this.info.y = 0
        this.info2.y = 0
        this.scroller.viewport.scrollV = 0;
        this.rota = 0;
        MyTool.removeMC(this.info2)
        this.scrollGroup.x = 0;
        this.info.x = 0;
        var oo =  this.dataArray[this.index];
        this.info.renew(oo.id,oo.specialData)
        //this.once(egret.Event.ENTER_FRAME,function(){
        //    if(this.scroller.viewport.scrollV + this.scroller.height > this.scroller.viewport.contentHeight)
        //        this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
        //},this)


        this.renewPage();
    }



    public renewPage(){

        if(this.dataArray.length <2)
            return;
        egret.Tween.removeTweens(this.lt)
        var tw = egret.Tween.get(this.lt)
        if(this.lt.text)
            tw.to({scaleX:0},200)
        else
            this.lt.scaleX = 0;
        tw.call(function(){
            if(this.index > 0)
            {
                this.la.source = 'arrow1_png'
                this.lt.textColor = 0xCBB46B

                this.lt.text = MonsterVO.getObject(this.dataArray[this.index-1].id).name;
            }
            else
            {
                this.la.source = 'arrow3_png'
                this.lt.textColor = 0x734B41
                this.lt.text = ''
            }
        },this).to({scaleX:1},200)


        egret.Tween.removeTweens(this.rt)
        var tw = egret.Tween.get(this.rt)
        if(this.rt.text)
            tw.to({scaleX:0},200)
        else
            this.rt.scaleX = 0;
        tw.call(function(){
            if(this.index < this.dataArray.length-1)
            {
                this.ra.source = 'arrow1_png'
                this.rt.textColor = 0xCBB46B
                this.rt.text = MonsterVO.getObject(this.dataArray[this.index+1].id).name;
            }
            else
            {
                this.ra.source = 'arrow3_png'
                this.rt.textColor = 0x734B41
                this.rt.text = ''
            }
        },this).to({scaleX:1},200)





        this.pageText.text =  (this.index + 1) + '/' + this.dataArray.length;

        //this.pageGroup.visible = true;
        //var pageSize = this.pageSize;
        //var current = this.index%pageSize;
        //var max = pageSize;
        //var maxPage = Math.ceil(this.dataArray.length/pageSize);
        //var page = Math.ceil((this.index+1)/pageSize)
        //if(page == maxPage)//最后一页
        //{
        //    max = this.dataArray.length%pageSize || pageSize;
        //}
        //
        //this.pageGroup.removeChildren()
        //if(page > 1)
        //{
        //    var mc = this['p' + 0];
        //    this.pageGroup.addChild(mc);
        //    mc.source = 'point1_png';
        //}
        //
        //for(var i=0;i<pageSize;i++)
        //{
        //    var mc = this['p' + (i+1)];
        //    if(i<max)
        //    {
        //        this.pageGroup.addChild(mc);
        //        if(i == current)//当前
        //            mc.source = 'point2_png';
        //        else
        //            mc.source = 'point1_png';
        //    }
        //}
        //
        //if(page < maxPage)
        //{
        //    var mc = this['p' + 9];
        //    this.pageGroup.addChild(mc);
        //    mc.source = 'point1_png';
        //}
    }
}