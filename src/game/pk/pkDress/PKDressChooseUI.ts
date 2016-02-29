class PKDressChooseUI extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private deleteMC:eui.Image
    private cancelMC1:eui.Image
    private cancelMC2:eui.Image


    private posArray = [];
    private mcArray = [];
    public chooseList = []

    private dragMC;
    private dragMCPos;
    private dragMCOrginPos;
    private dragMCStat;//0:普通，1垃圾，2还原块

    private replaceDragMC//代替拖动块显示的MC




    public childrenCreated() {
        super.childrenCreated();
        for(var i=0;i<10;i++)
        {
            var posMC = this['pos'+i]
            this.posArray.push(posMC);

            var mc = this['mc'+i]
            this.mcArray.push(mc);
            DragManager.getInstance().setDrag(mc);
            mc.addEventListener('start_drag',this.onStart,this)
            mc.addEventListener('move_drag',this.onMove,this)
            mc.addEventListener('end_drag',this.onEnd,this)
            mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClick,this)
            MyTool.removeMC(mc);
        }
    }

    private onClick(e){
        this.dispatchEventWith('chooseMC',false,e.target.data);
    }

    private onStart(e){
        this.dragMC = e.currentTarget;
        this.dragMC.parent.addChild(this.dragMC);
        this.dragMCPos = this.chooseList.indexOf(this.dragMC);
        this.dragMCOrginPos = this.dragMCPos;
        this.dragMCStat = 0;

        this.replaceDragMC.visible = true;
    }

    private onMove(e){
        if(this.deleteMC.hitTestPoint(e.data.x,e.data.y))//移到垃圾桶上
        {
            if(this.dragMCStat == 1)//还在垃圾桶上
                return;
            this.deleteMC.source = 'aa';
            this.chooseList.splice(this.dragMCPos,1)
            this.dragMCStat = 1;
            this.renewPos();
            return;
        }
        else  if(this.dragMCStat == 1)//移出垃圾桶
        {
            this.deleteMC.source = 'bb';
            this.chooseList.splice(this.dragMCPos,0,this.dragMC)
            this.dragMCStat = 0;
            this.renewPos();
        }

        if(this.cancelMC1.hitTestPoint(e.data.x,e.data.y) || this.cancelMC2.hitTestPoint(e.data.x,e.data.y))//移到还原上
        {
            if(this.dragMCStat == 2)//还在还原块上
                return;
            this.chooseList.splice(this.dragMCPos,1)
            this.chooseList.splice(this.dragMCOrginPos,0,this.dragMC)
            this.dragMCStat = 2;
            this.renewPos();
            return;
        }
        else  if(this.dragMCStat == 2)//移出还原
        {
            this.chooseList.splice(this.dragMCOrginPos,1)
            this.chooseList.splice(this.dragMCPos,0,this.dragMC)
            this.dragMCStat = 0;
            this.renewPos();
        }

        for(var i=0;i<this.mcArray.length;i++)
        {
            var mc = this.mcArray[i]
            if(mc.hitTestPoint(e.data.x,e.data.y))
            {
                i = Math.max(i,this.chooseList.length-1);
                if(i != this.dragMCPos)
                {
                    this.chooseList.splice(this.dragMCPos,1)
                    this.chooseList.splice(i,0,this.dragMC);
                    this.dragMCPos = i;
                    this.renewPos();
                }
                break;
            }
        }
    }

    //private removeDrag(){
    //
    //}

    private onEnd(e){
        if(this.dragMCStat = 1) //移除了当前块
        {
            this.mcArray.push(this.dragMC);
            egret.Tween.removeTweens(this.dragMC);
        }
        this.dragMC = null;
        this.replaceDragMC.visible = false;
        this.renewPos();

    }

    private renewPos(stopTween = false){
        for(var i=0;i<this.chooseList.length;i++)
        {
            var mc = this.chooseList[i];
            var posMC = this.posArray[i];
            mc.index = i;
            if(mc == this.dragMC)
            {
                mc = this.replaceDragMC;
            }

            if(posMC.x == mc.x &&  posMC.y == mc.y)
                continue;

            egret.Tween.removeTweens(mc);
            if(stopTween)
            {
                mc.x = posMC.x;
                mc.y = posMC.y;
            }
            else
            {
                var tw:egret.Tween = egret.Tween.get(mc);
                tw.to({x:posMC.x,y:posMC.y}, 500);
            }
        }
    }

    public cleanAll(){
        while(this.chooseList.length > 0)
        {
            var mc = this.chooseList.pop();
            this.mcArray.push(mc);
            egret.Tween.removeTweens(mc);
        }
    }

    public addOne(id){
        var mc:any = this.mcArray.pop();
        mc.data = id;
        this.chooseList.push(mc);
        this.renewPos(true);
        this.renewMonster();
    }

    public renewMonster(){
        for(var i=0;i<this.chooseList.length;i++) {
            var mc = this.chooseList[i];
            mc.dataChange();
        }
    }

    //选中的怪物列表
    public getChooseList(){
        var arr = [];
        for(var i=0;i<this.chooseList.length;i++) {
            var mc = this.chooseList[i];
            arr.push(mc.data);
        }
        return arr;
    }

    //选中的怪物数量
    public getMonsterNum(id){
        var count = 0;
        for(var i=0;i<this.chooseList.length;i++) {
            var mc = this.chooseList[i];
            if(mc.data == id)
                count ++;
        }
        return count;
    }
}