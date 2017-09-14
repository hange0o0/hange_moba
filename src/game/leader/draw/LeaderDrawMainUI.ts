class LeaderDrawMainUI extends game.BaseContainer {
    private static instance:LeaderDrawMainUI;
    public static getInstance() {
        return this.instance;
    }

    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private list: eui.List;
    private btn0: eui.Button;
    private redPoint: eui.Image;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private doorGroup: eui.Group;
    private doorNpc: eui.Image;
    private desGroup: eui.Group;
    private desText: eui.Label;
    //private emptyText: eui.Label;





    private lastItems = [];

    public constructor() {
        super();
        this.skinName = "LeaderDrawMainUISkin";
        LeaderDrawMainUI.instance  = this
    }


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = LeaderDrawLogItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

        this.addBtnEvent(this.btn0,this.onClick0)
        this.addBtnEvent(this.btn1,this.onClick1)
        this.addBtnEvent(this.btn2,this.onClick2)
    }

    private onClick0(){
        LeaderDrawComposeUI.getInstance().show();
    }
    private onClick1(){
        this.draw(1)
    }
    private onClick2(){
        this.draw(8)
    }

    public draw(times,needDiamnd?){
       var LM = LeaderManager.getInstance();
        var diamond =needDiamnd || TM.now() - (SharedObjectManager.instance.getMyValue('skillDrawDiamond') || 0) < 24*3600
        var propNum = UM.getPropNum(41);
        if(propNum < times)
        {
            if(diamond)
            {
                 var needDiamond = (times - propNum)*100
                if(UM.getDiamond() < needDiamond)
                {
                    LeaderDrawDiamondUI.getInstance().show(times);
                    return;
                }
            }
            else
            {
                LeaderDrawDiamondUI.getInstance().show(times);
                return;
            }
        }
        LM.skillDraw(times,diamond,(data)=>{this.onDrawResult(data)})
    }

    public hide(){
        this.beforeHide();
        MyTool.removeMC(this)
        egret.Tween.removeTweens(this.doorGroup);
        egret.Tween.removeTweens(this.doorNpc);

        for(var i=0;i<this.lastItems.length;i++)
        {
            var item = this.lastItems[i];
            MyTool.removeMC(item);
        }
        this.lastItems.length = 0;
    }

    public beforeHide(){
        this.clearList([this.list])
    }




    public onShow(){
        this.btn0.touchEnabled = true
        this.btn1.touchEnabled = true
        this.btn2.touchEnabled = true
        this.btn0.skinName = 'Btn_r2Skin'
        this.btn1.skinName = 'Btn_r2Skin'
        this.btn2.skinName = 'Btn_r2Skin'

        for(var i=0;i<this.lastItems.length;i++)
        {
            var item = this.lastItems[i];
            MyTool.removeMC(item);
        }
        this.lastItems.length = 0;

        this.renewLog();
        this.onPropChange();

        var tw = egret.Tween.get(this.doorGroup,{loop:true})
        this.doorGroup.y = 180;
        this.doorGroup.scaleX = this.doorGroup.scaleY = 1;
        tw.to({y:170},1500,egret.Ease.sineInOut).to({y:180},1500,egret.Ease.sineInOut)

        this.doorNpc.alpha = 0;
        var tw = egret.Tween.get(this.doorNpc,{loop:true})
        tw.wait(4000).to({alpha:1},1500).wait(1000).to({alpha:0},1500)
    }

    public onPropChange(){
        this.redPoint.visible = UM.getPropNum(42) >= 10;
        this.desText.text = '当前拥有命运石：' + UM.getPropNum(41);
    }

    private renewLog(){
        var LM = LeaderManager.getInstance();
        LM.skillDrawLog(()=>{
            this.scroller.viewport.scrollV = 0;
            var arr = LM.getSkillLog(0);
            this.list.dataProvider = new eui.ArrayCollection(arr)
        })
    }

    private onDrawResult(data){
        this.btn0.touchEnabled = false
        this.btn1.touchEnabled = false
        this.btn2.touchEnabled = false
        this.btn0.skinName = 'Btn_d2Skin'
        this.btn1.skinName = 'Btn_d2Skin'
        this.btn2.skinName = 'Btn_d2Skin'
        if(this.doorGroup.scaleX == 1)//未抽过
        {
            egret.Tween.removeTweens(this.doorGroup);
            var tw = egret.Tween.get(this.doorGroup)
            tw.to({scaleX:0.5,scaleY:0.5,y:280},300).call(function(){
                egret.Tween.removeTweens(this.doorGroup);
                var tw = egret.Tween.get(this.doorGroup,{loop:true})
                tw.to({y:270},1500,egret.Ease.sineInOut).to({y:280},1500,egret.Ease.sineInOut);
            },this).wait(500)
        }
        else
        {
            for(var i=0;i<this.lastItems.length;i++)
            {
                var item = this.lastItems[i];
                var tw = egret.Tween.get(item)
                tw.to({alpha:0},500)
            }
        }

        var tw = egret.Tween.get(this)
        tw.wait(1000).call(function(){
            for(var i=0;i<this.lastItems.length;i++)
            {
                var item = this.lastItems[i];
                MyTool.removeMC(item);
            }
            this.lastItems.length = 0;

            var haveSkill = false
            console.log(data);
            for(var i=0;i<data.length;i++)
            {
                this.showItem(data[i],i,data.length)
                if(data[i].type == 'skill')
                    haveSkill  = true
            }

            if(haveSkill)
                this.renewLog();

        },this).wait(data.length * 100 + 500).call(function(){
            this.btn0.touchEnabled = true
            this.btn1.touchEnabled = true
            this.btn2.touchEnabled = true
            this.btn0.skinName = 'Btn_r2Skin'
            this.btn1.skinName = 'Btn_r2Skin'
            this.btn2.skinName = 'Btn_r2Skin'
        },this)


    }

    private showItem(data,index,maxNum)
    {
        var item = new LeaderDrawItem();
        this.lastItems.push(item);
        this.addChild(item);
        item.scaleX = item.scaleY = 0;
        item.x = 320
        item.y = 400
        item.data = data;
        var tw = egret.Tween.get(item);
        tw.wait(index*100);
         if(maxNum == 1) //1次
         {
             tw.to({scaleX:1.1,scaleY:1.1,y:320},200).to({scaleX:1,scaleY:1},300)
         }
        else
         {
             tw.to({scaleX:1.1,scaleY:1.1,y:Math.floor(index/4)*170 + 220,x:(index%4) * 140 + 50 + 60},200).to({scaleX:1,scaleY:1},300)
         }
    }


}

