class PKResultBase extends game.BaseContainer {
    protected _desText: eui.Label;
    protected _list: eui.List;
    protected _resultGroup: eui.Group;



    public timer;
    public step = 0;
    public constructor() {
        super();
    }


    public childrenCreated() {
        super.childrenCreated();
        this._list.itemRenderer = PKResultItem;
    }

    private showBG(){
        PKResultUI.getInstance().showBG();
    }

    public stepOne(){
        var award = PKManager.getInstance().pkAward;
        this.step ++;
        if(this.step == 1)
        {
            this._desText.text = ''
            MyTool.removeMC(this._list);
            this.y = (GameManager.stage.stageHeight - 300)/2;
            this.scaleX = 0.1
            this.scaleY = 0.1
            this.x = (640 - 640*0.1)/2;
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({x:(640 - 640*1.2)/2,y:100,scaleX:1.2,scaleY:1.2}, 200).
                to({x:0,y:120,scaleX:1,scaleY:1}, 100).call(this.showBG,this).wait(300).call(this.stepOne,this);
            //this.stepOne();
        }
        else if(!award)
        {

            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({y:0}, 300).call(this.onMVFinish,this);
        }
        else if(award.gLevelUp)//升级了
        {

            if(this._desText.text)
                this._desText.text += '\n';
            if(PKManager.getInstance().pkType == PKManager.PKType.SERVER)
                this._desText.text += '竞技场升到 '+award.gLevelUp+' 阶'
            else
                this._desText.text += '修正场升到 '+award.gLevelUp+' 阶'
            award.gLevelUp = 0;
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(award.levelUp)//升级了
        {
            award.levelUp = false;
            if(this._desText.text)
                this._desText.text += '\n';
            this._desText.text += '玩家升到 '+UM.level+' 级'
            this.timer = egret.setTimeout(this.stepOne,this,300);
            SoundManager.getInstance().playEffect(SoundConfig.effect_u_up);
        }
        else if(award.dayAward)//日常奖战力
        {
            award.dayAward = false;
            if(this._desText.text)
                this._desText.text += '\n';
            this._desText.text += '研究院积分凑满10分';
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        //else if(award.finishTask)//完成任务了
        //{
        //    award.finishTask = false;
        //    if(this._desText.text)
        //        this._desText.text += '\n';
        //    this._desText.text += '当前阶段任务已完成'
        //}
        else if(award.forceUp)//战力提升了
        {
            award.forceUp = false;
            this._desText.text += '\n战力提升到：' + UM.getForce()
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(award.getNewCard)//卡级
        {
            award.getNewCard = false;
            PKResultUI.getInstance().showCardTask = true;
            this._desText.text += '\n卡组次数已用完，获得了新卡组';
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(award.passMap)//卡级
        {
            award.passMap = false;
            PKResultUI.getInstance().openNewLevel = true;
            this._desText.text += '\n成功通过了本据点，开启据点' + MapManager.getInstance().level;
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        //else if(award.newTask)//新增任务了
        //{
        //    award.newTask = false;
        //    var task = UM.active.task;
        //        var type = '修正场PK'
        //        if(task.type == 'server_game')
        //            type = '竞技场PK';
        //    this._desText.text += '\n新增阶段任务：\n在'+task.targettotal+'场'+type+'中取得'+task.targetwin+'场胜利【战力+'+task.award+'】';
        //}
        else if(award.prop && award.prop.length)//加入道具
        {
            this._resultGroup.addChildAt(this._list,1);
            var arr = award.prop;
            for(var i=0;i<arr.length;i++)
            {
                arr[i].cd = i*200 + 100
            }
            this._list.visible = true;
            this._list.dataProvider = new eui.ArrayCollection(arr);

            if(arr.length <=4)
            {
                (<eui.TileLayout>this._list.layout).requestedColumnCount = 0;
                (<eui.TileLayout>this._list.layout).requestedRowCount = 1
            }
            else if(arr.length <=8)
            {
                (<eui.TileLayout>this._list.layout).requestedRowCount = 2
                if(arr.length <=6)
                    (<eui.TileLayout>this._list.layout).requestedColumnCount = 3;
                else
                    (<eui.TileLayout>this._list.layout).requestedColumnCount = 4;
            }
            else
            {
                (<eui.TileLayout>this._list.layout).requestedColumnCount = 4;
                (<eui.TileLayout>this._list.layout).requestedRowCount = 0
            }


            this.timer = egret.setTimeout(this.stepOne,this,arr.length * 100 + 500);
            award.prop = null;
        }
        else //完成，加入列表
        {
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({y:0}, 300).call(this.onMVFinish,this);

        }
    }

    protected onStepOver(){

    }

    private onMVFinish(){
        this.onStepOver();
        PKResultUI.getInstance().showMore(this)

        if(PKManager.getInstance().pkAward.finishTask)
        {
            PKManager.getInstance().pkAward.finishTask.title = '完成卡组任务';
            AwardUI.getInstance().show(PKManager.getInstance().pkAward.finishTask);
        }
        PKManager.getInstance().pkAward = null
    }
}