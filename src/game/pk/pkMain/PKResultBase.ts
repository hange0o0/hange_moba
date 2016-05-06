class PKResultBase extends game.BaseContainer {
    protected _desText: eui.Label;
    protected _list: eui.List;



    public timer;
    public step = 0;
    public constructor() {
        super();
    }


    public childrenCreated() {
        super.childrenCreated();
        this._list.itemRenderer = PKResultItem;
    }


    public stepOne(){
        var award = PKManager.getInstance().pkAward;
        this.step ++;
        if(this.step == 1)
        {
            this._desText.text = ''

            this.y = 300;
            this.scaleX = 0.1
            this.scaleY = 0.1
            this.x = (640 - 640*0.1)/2;
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({x:(640 - 640*0.6)/2,y:20,scaleX:0.6,scaleY:0.6}, 200,egret.Ease.sineIn).
                to({x:0,y:80,scaleX:1,scaleY:1}, 300,egret.Ease.sineOut).wait(300).call(this.stepOne,this);
        }
        else if(!award)
        {
            MyTool.removeMC(this._list);
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({y:0}, 300).call(this.onMVFinish,this);
        }
        else if(award.levelUp)//升级了
        {
            award.levelUp = false;
            this._desText.text += '升级了'
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(award.finishTask)//完成任务了
        {
            award.finishTask = false;
            if(this._desText.text)
                this._desText.text += '\n';
            this._desText.text += '当前阶段任务已完成'
        }
        else if(award.forceUp)//战力提升了
        {
            award.forceUp = false;
            this._desText.text += '\n战力提升到：' + UM.getForce()
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(award.newTask)//新增任务了
        {
            award.newTask = false;
            var task = UM.active.task;
                var type = '修正场PK'
                if(task.type == 'server_game')
                    type = '竞技场PK';
            this._desText.text += '\n新增阶段任务：\n在'+task.targettotal+'场'+type+'中取得'+task.targetwin+'场胜利【战力+'+task.award+'】';
        }
        else if(award.prop && award.prop.length)//加入道具
        {
            this.addChild(this._list);
            var arr = award.prop;
            for(var i=0;i<arr.length;i++)
            {
                arr[i].cd = i*500 + 100
            }
            this._list.visible = true;
            this._list.dataProvider = new eui.ArrayCollection(arr);
            this.timer = egret.setTimeout(this.stepOne,this,arr.length * 500 + 500);
            award.prop = null;
        }
        else //完成，加入列表
        {
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({y:0}, 300).call(this.onMVFinish,this);
            PKManager.getInstance().pkAward = null
        }
    }

    protected onStepOver(){

    }

    private onMVFinish(){
        this.onStepOver();
        PKResultUI.getInstance().showMore(this)
    }
}