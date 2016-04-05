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
            this._desText.text = '1'

            this.y = 300;
            this.scaleX = 0.1
            this.scaleY = 0.1
            this.x = (640 - 640*0.1)/2;
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({x:(640 - 640*0.6)/2,y:20,scaleX:0.6,scaleY:0.6}, 200,egret.Ease.sineIn).
                to({x:0,y:80,scaleX:1,scaleY:1}, 300,egret.Ease.sineOut).wait(300).call(this.stepOne,this);
        }
        else if(award.levelUp)//升级了
        {
            award.levelUp = false
            this._desText.text += '升级了'
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(false)//完成任务了
        {

        }
        else if(award.forceUp)//战力提升了
        {
            award.forceUp = false
            if(this._desText.text)
                this._desText.text += '\n';
            this._desText.text += '战力提升了'
            this.timer = egret.setTimeout(this.stepOne,this,300);
        }
        else if(false)//新增任务了
        {

        }
        else if(award.prop)//加入道具
        {
            var arr = award.prop;
            for(var i=0;i<arr.length;i++)
            {
                arr[i].cd = i*500 + 100
            }

            award.prop = null;
            this._list.visible = true;
            this._list.dataProvider = new eui.ArrayCollection(arr);
            this.timer = egret.setTimeout(this.stepOne,this,arr.length * 500 + 500);
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
    }
}