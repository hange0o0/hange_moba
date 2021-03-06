class LeaderStudyUI extends game.BaseContainer {
    private static instance:LeaderStudyUI;
    public static getInstance() {
        return this.instance;
    }

    private bg: eui.Rect;
    private chooseList: eui.List;
    private mainGroup: eui.Group;
    private btn1: eui.Button;
    private des1: eui.Label;
    private des2: eui.Label;
    private redMC: eui.Image;
    private btn2: eui.Button;
    private des3: eui.Label;
    private des4: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desGroup: eui.Group;
    private desText: eui.Label;
    private continueBtn: eui.Button;
    private sortBtn: eui.Image;
    private sortText: eui.Label;
    private sortGroup: eui.Group;
    private sortList: eui.List;





    public selectArr = [];
    public addExp = {};
    private type
    public constructor() {
        super();
        this.skinName = "LeaderStudyUISkin";
        LeaderStudyUI.instance  = this
    }


    public childrenCreated() {
        super.childrenCreated();


        this.scroller.viewport = this.list;
        this.list.itemRenderer = LeaderListItem

        this.chooseList.itemRenderer = LeaderItem


        this.addBtnEvent(this.btn1,this.onClick1)
        this.addBtnEvent(this.btn2,this.onClick2)
        this.addBtnEvent(this.continueBtn,this.onClick3)



        this.addBtnEvent(this.sortBtn,this.onSort);
        this.addBtnEvent(this.sortText,this.onSort);
        this.sortList.selectedIndex = 0;
        this.sortList.addEventListener(egret.Event.CHANGE,this.renewList,this)
        this.sortGroup.visible = false;
    }



    private renewList(){
        var arr = [];
        var vo:any
        if(this.sortList.selectedIndex == 4)
        {
             if(UM.tec.leader.list)
             {
                 for(var i=0;i<UM.tec.leader.list.length;i++)
                 {
                     vo = MonsterVO.getObject(UM.tec.leader.list[i]);
                     arr.push({
                         vo:vo,
                         mtyle:vo.mtype,
                         id:vo.id,
                         exp:UM.getLeaderExp(vo.id)
                     });
                 }
             }
        }
        else
        {
            var mList = MonsterVO.getListByLevel(UM.level)
            for(var i=0;i<mList.length;i++)
            {
                vo = mList[i];

                if(this.sortList.selectedIndex == 0 || this.sortList.selectedIndex == vo.mtype)
                {
                    arr.push({
                        vo:vo,
                        mtyle:vo.mtype,
                        id:vo.id,
                        exp:UM.getLeaderExp(vo.id)
                    });
                }
            }
        }

        ArrayUtil.sortByField(arr,['exp','mtyle','id'],[1,0,0]);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.sortText.text =  this.sortList.selectedItem.label
    }

    private renewSort4(){
        var current = UM.tec.leader.list?UM.tec.leader.list.length:0
        this.sortList.dataProvider.getItemAt(4).label = '当前 ×' + current
        this.sortText.text =  this.sortList.selectedItem.label
        //var scrollV = this.scroller.viewport.scrollV;
        this.renewList();
        //this.scroller.validateNow();
        //this.scroller.viewport.scrollV = scrollV
    }

    private onSort(){
        GameManager.stage.once(egret.TouchEvent.TOUCH_TAP,this.onHideSort,this,true);
        this.sortGroup.visible = true;


    }

    private onHideSort(e?){
        if(e)
            e.stopImmediatePropagation()
        this.sortGroup.visible = false;
    }

    private onClick1(){
        var self = this;
        LeaderManager.getInstance().leaderGet(1,function(){
            self.mvShow();
        })
    }

    private onClick2(){
        var num = PropManager.getInstance().getNum(32);
        if(!num && !UM.testDiamond(500))
            return;

        var self = this;
        LeaderManager.getInstance().leaderGet(2,function(){
            self.mvShow();
        })
    }

    private onClick3(){
        var self = this;
        LeaderManager.getInstance().leaderAward(this.selectArr,function(){
            self.mvShow2();
            //ShowTips('学习成功！');
            self.selectArr.length = 0
            self.addExp = {}
            self.renewSort4();
            self.renewList();
        })
    }

    public beforeHide(){
        this.clearList([this.list,this.chooseList])
    }

    public hide(){
        this.beforeHide();
        MyTool.removeMC(this)
    }


    public onShow(){
        this.scroller.viewport.scrollV = 0;


        var arr = [];
        var mList = MonsterVO.getListByLevel(UM.level)
        var typeObj = {1:0,2:0,3:0};
        for(var i=0;i<mList.length;i++)
        {
            var vo = mList[i];
            typeObj[vo.mtype] ++;
        }
        arr.push({label:'全部 ×' + mList.length})
        arr.push({label:'攻将 ×' + typeObj[1]})
        arr.push({label:'盾将 ×' + typeObj[2]})
        arr.push({label:'辅将 ×' + typeObj[3]})
        var current = UM.tec.leader.list?UM.tec.leader.list.length:0
        arr.push({label:'当前 ×' + current})
        this.sortList.dataProvider = new eui.ArrayCollection(arr)
        if(this.sortList.selectedIndex == -1)
            this.sortList.selectedIndex = 0;
        this.renew();


        if(TaskManager.getInstance().nowAction == 'leader')
        {
            TaskManager.getInstance().showGuideMC(this.btn1)
        }
    }



    public onTimer(){
        if(this.mainGroup.visible)
        {
            this.btn1.touchChildren = this.btn1.touchEnabled = true;
            var num = PropManager.getInstance().getNum(31);
            var haveDone = DateUtil.isSameDay(UM.tec.leader.lasttime);
            if(num == 0)
            {
                this.des2.text = ''
                if(haveDone)
                {
                    this.redMC.visible = false;
                    this.des1.text = DateUtil.getStringBySecond(DateUtil.getNextDateTimeByHours(0) - TM.now())+' 后免费';
                    this.btn1.skinName = 'Btn_d2Skin'
                    this.btn1.label = '学　习'
                    this.btn1.touchChildren = this.btn1.touchEnabled = false;
                }
                else
                {
                    this.redMC.visible = true;
                    this.des1.text = '可免费学习一次'
                    this.btn1.label = '免费学习'
                    this.btn1.skinName = 'Btn_r2Skin'
                }
            }
            else
            {
                if(haveDone)
                {
                    this.redMC.visible = false;
                    this.des2.text = DateUtil.getStringBySecond(DateUtil.getNextDateTimeByHours(0) - TM.now())+' 后免费';
                    this.des1.text = '初级学习卡 X' + num;
                    this.btn1.skinName = 'Btn_r2Skin'
                    this.btn1.label = '学　习'
                }
                else
                {
                    this.redMC.visible = true;
                    this.des1.text = '可免费学习一次'
                    this.des2.text = '初级学习卡 X' + num
                    this.btn1.label = '免费学习'
                    this.btn1.skinName = 'Btn_r2Skin'
                }
            }
        }
    }

    private renew(){
        egret.Tween.removeTweens(this.mainGroup)
        egret.Tween.removeTweens(this.chooseList)
        if(UM.tec.leader.list)
            this.renewChoose();
        else
            this.renewMain();
        this.renewList();
    }

    private renewMain(){
        this.addExp = {};
        this.mainGroup.visible = true;
        this.chooseList.visible = false;
        this.mainGroup.scaleX = this.mainGroup.scaleY = 1;
        this.bg.visible = false
        this.continueBtn.visible = false
        this.desGroup.visible = false


        var num = PropManager.getInstance().getNum(32);
        if(num)
            this.des3.text = '高级学习卡 X' + num;
        else
            this.des3.text = '钻石 X' + 500;

        this.des4.text = ''

        this.onTimer();
    }

    private renewChoose(){
        this.mainGroup.visible = false;
        this.chooseList.visible = true;
        this.chooseList.scaleX = this.chooseList.scaleY = 1;
        this.chooseList.verticalCenter = 0;
        this.bg.visible = true
        this.selectArr.length = 0

        this.continueBtn.visible = true
        this.desGroup.visible = true


        if(UM.tec.leader.list.length  == 2)
        {
            this.type = 1;
            (<eui.TileLayout>this.chooseList.layout).requestedColumnCount = 2;
            (<eui.TileLayout>this.chooseList.layout).horizontalGap = 60;
        }
        else
        {
            this.type = 2;
            (<eui.TileLayout>this.chooseList.layout).requestedColumnCount = 3;
            (<eui.TileLayout>this.chooseList.layout).horizontalGap = 20;
        }

        var arr = [];
        this.addExp = {};
        for(var i=0;i<UM.tec.leader.list.length;i++)
        {
            var oo = {
                id: UM.tec.leader.list[i],
                type: this.type == 1?1:(i==0?3:2)
            };
            arr.push(oo)
            this.addExp[oo.id] = LeaderManager.getInstance().getAddExpByType(oo.type);
        }
        this.chooseList.dataProvider = new eui.ArrayCollection(arr)

        this.renewSelect();
    }

    private renewSelect(){
        var btnEnable = false
        if(this.type == 1)
        {
            MyTool.setColorText(this.desText,'你可以选取其中一项进行提升[（'+this.selectArr.length+'/1）]')
            if(this.selectArr.length == 1)
                btnEnable = true;
        }
        else
        {
            MyTool.setColorText(this.desText,'你可以选取其中两项进行提升[（'+this.selectArr.length+'/2）]');
            if(this.selectArr.length == 2)
                btnEnable = true;
        }

        if(btnEnable)
        {
            this.continueBtn.touchEnabled = true
            this.continueBtn.skinName = 'Btn_r2Skin'
        }
        else
        {
            this.continueBtn.touchEnabled = false
            this.continueBtn.skinName = 'Btn_d2Skin'
        }

        for(var i=0;i<this.chooseList.numChildren;i++)
        {
            var item:any = this.chooseList.getChildAt(i);
            item.renewChoose();
        }
        for(var i=0;i<this.list.numChildren;i++)
        {
            var item:any = this.list.getChildAt(i);
            item.renewSelect();
        }
    }

    //动画表现抽取
    private mvShow(){
        this.renewSort4();
        this.renewChoose();


        this.mainGroup.visible = true;
        var tw = egret.Tween.get(this.mainGroup);
        tw.to({scaleX:0,scaleY:0},300).call(function(){
            this.mainGroup.visible = false;
        },this);


        this.desGroup.visible = false
        this.continueBtn.visible = false
        this.chooseList.scaleX = this.chooseList.scaleY = 0
        this.chooseList.visible = true;
        var tw = egret.Tween.get(this.chooseList);
        tw.wait(500).to({scaleX:1.1,scaleY:1.1},200).to({scaleX:1,scaleY:1},300).call(function(){
            this.renewSelect();
            this.continueBtn.visible = true
            this.desGroup.visible = true
        },this);
    }

    //动画表现学习
    private mvShow2(){
        this.desGroup.visible = false
        this.continueBtn.visible = false
        this.bg.visible = false

        for(var i=0;i<this.chooseList.numChildren;i++)
        {
            var item:any = this.chooseList.getChildAt(i);
            item.movieOut();
        }

        var tw = egret.Tween.get(this.chooseList);
        tw.wait(800).to({verticalCenter:-50,scaleX:1.2,scaleY:1.2},200).wait(100).to({verticalCenter:150,scaleX:0,scaleY:0},200).call(function(){
            SoundManager.getInstance().playEffect(SoundConfig.effect_m_up);
        })

        var tw = egret.Tween.get(this.mainGroup);
        this.mainGroup.alpha = 0;
        tw.wait(1500).call(function(){
            this.renewMain();
        },this).to({alpha:1},500)
    }

    public onSelect(mid){
        var index = this.selectArr.indexOf(mid);
        if(index != -1)
            this.selectArr.splice(index,1);
        else
        {
            this.selectArr.push(mid);
            while(this.selectArr.length >  this.type)
                this.selectArr.shift();

            var arr = this.list.dataProvider['source']
            var index = ArrayUtil.indexOfByKey(arr,'id',mid)
            if(index != -1)
            {
                var scrollV = 50 * index
                if(scrollV + this.scroller.viewport.height > this.scroller.viewport.contentHeight)
                    scrollV =  Math.max(0,this.scroller.viewport.contentHeight - this.scroller.viewport.height);
                var tw = egret.Tween.get(this.scroller.viewport)
                tw.to({scrollV:scrollV},200).call(function(){
                    for(var i=0;i<this.list.numChildren;i++)
                    {
                        var item:any = this.list.getChildAt(i);
                        if(item.data.id == mid)
                        {
                            item.flash();
                            break;
                        }
                    }
                },this)
            }
        }
        this.renewSelect();
    }


}