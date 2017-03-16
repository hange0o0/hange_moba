class PKDressChooseUI extends game.BaseContainer {

    public constructor() {
        super();
        this.skinName = "PKDressChooseUISkin";
    }


    private itemGroup: eui.Group;
    private h1: PKDressChooseItem;
    private h2: PKDressChooseItem;
    private h3: PKDressChooseItem;
    private h4: PKDressChooseItem;
    private h5: PKDressChooseItem;
    private h6: PKDressChooseItem;
    private spliceGroup: eui.Group;
    private a1: eui.Image;
    private a2: eui.Image;
    private a3: eui.Image;
    private a4: eui.Image;
    private a5: eui.Image;
    private a6: eui.Image;
    private a7: eui.Image;
    private a8: eui.Image;
    private pkBtn: eui.Button;
    private randomBtn: eui.Group;
    private resetBtn: eui.Group;
    private desText: eui.Label;
    private deleteBtn: eui.Button;
    private removeGroup: eui.Group;
    private removeText: eui.Label;











    private mvItem: PKDressChooseItem; //动画过度





    private splicaArray = [];
    private posArray = [];
    private mcArray = [];//没用到的MC
    private listLength ;//当前有效卡组长度
    public list//数据


   private _selectIndex = -1;
    private get selectIndex(){
        return this._selectIndex;
    }
    private set selectIndex(v){
        this._selectIndex = v;
        var monsterID = null;
        if(v != -1)
        {
            monsterID = this.mcArray[v].data.id;
            egret.callLater(function(){
                PKDressUI.getInstance().once(egret.TouchEvent.TOUCH_TAP,this.onClickStage,this,false,-9999);
            },this)
        }
        else
        {
            PKDressUI.getInstance().removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickStage,this);
        }
        this.dispatchEventWith('chooseItem',false,monsterID)
    }

    private outPos

    public specialData;

    private dragTarget
    private overTarget


    public childrenCreated() {
        super.childrenCreated();

        //this.posData = {};

        this.mvItem = new PKDressChooseItem();
        this.itemGroup.addChild(this.mvItem);
        this.mvItem.visible = false;
        var des = 126;
        for(var i=1;i<=6;i++)
        {
            var mc = this['h'+i]
            mc.index = i;
            this.addBtnEvent(mc,this.onMCClick)
            //MyTool.addLongTouch(mc,this.onLongTouch,this);
            //mc.addEventListener('deleted',this.onDelete,this)

            mc.addEventListener('start_drag',this.onDragStart,this);
            mc.addEventListener('end_drag',this.onDragEnd,this);
            mc.addEventListener('move_drag',this.onDragMove,this);




            var dec = 15;
            this.posArray.push({x:mc.x,y:mc.y});
            if(i == 6)
                this.outPos = {x:mc.x + des,y:mc.y};
            //var line = Math.ceil(i/5);
            //if(!this.posData[line])
            //{
            //    this.posData[line] = {};
            //    this.posData[line].startY = mc.y + dec;
            //    this.posData[line].endY = mc.y + mc.height - dec;
            //}
            //var index = i%5 || 5;
            //this.posData[line]['x' + index] = mc.x + dec
            //this.posData[line]['x_' + index] = mc.x + mc.width - dec
        }

        for(var i=1;i<=8;i++)
        {
            var a = this['a' + i];
            a.bsy = a.scaleY;
            this.addBtnEvent(a,this.onSplice)
            this.splicaArray.push(a);
            var index = i-1;
            if(index>3)
                index--;
            a.index = index;
        }

        this.addBtnEvent(this.pkBtn, this.onPKStart);
        this.addBtnEvent(this.deleteBtn, this.onDelete);
        this.addBtnEvent(this.randomBtn, this.onRandom);
        this.addBtnEvent(this.resetBtn, this.onReset);

        //this.addBtnEvent(this.moreBtn, this.onMore);

        this.dragTarget = new PKDressChooseItem();
        this.dragTarget.alpha = 0.5


        //console.log(this.posArray);
    }

    public onRandom(){
        this.dispatchEventWith('random');
    }
    public onReset(){
        this.dispatchEventWith('reset');
    }

    public setDesText(str){
        this.setHtml(this.desText,str || '');
    }

    private renewChoosing(b){
        for(var i=1;i<=6;i++) {
            var mc = this['h' + i]
            mc.setChoosing(b);
        }
    }

    private onDragStart(e){
        this.changeState('drag')
        e.stopImmediatePropagation();
        e.target.alpla = 0.8;
        this.selectIndex = this.mcArray.indexOf(e.target);
        this.dragTarget.data = e.target.data
        this.stage.addChild(this.dragTarget);
        this.dragTarget.x = e.data.x;
        this.dragTarget.y = e.data.y;
        this.renewSplice();
    }
    private onDragMove(e){
        e.stopImmediatePropagation();
        this.dragTarget.x = e.data.x - this.dragTarget.width/2;
        this.dragTarget.y = e.data.y - this.dragTarget.height/2;
        this.overTarget = -1;

        if(this.overTarget== -1 && this.removeGroup.hitTestPoint(e.data.x,e.data.y))
        {
            this.removeText.stroke = 2
            this.overTarget = 20;
        }
        else
        {
            this.removeText.stroke = 0
        }

        for(var i=0;i<this.splicaArray.length;i++)
        {
            var mc = this.splicaArray[i];
            if(mc.visible)
            {
                if(this.overTarget== -1 && mc.hitTestPoint(e.data.x,e.data.y))
                {
                    mc.scaleX = 1.3
                    mc.scaleY = 1.3 * mc.bsy;
                    this.overTarget = mc.index + 10;
                }
                else
                {
                    mc.scaleX = 1
                    mc.scaleY = 1 * mc.bsy;
                }
            }
        }

        for(var i=1;i<=6;i++) {
            var mc = this['h' + i]
            if(mc.data && this.overTarget== -1 && mc.hitTestPoint(e.data.x,e.data.y))
            {
                mc.setStaticVisible(true);
                this.overTarget = this.mcArray.indexOf(mc);
            }
            else
            {
                mc.setStaticVisible(false);
            }
        }



    }
    private onDragEnd(e){
        e.stopImmediatePropagation();
        //var target = this.getTestTarget(this.dragTarget.x + this.dragTarget.width/2,this.dragTarget.y + this.dragTarget.height/2)
        MyTool.removeMC(this.dragTarget)

        for(var i=1;i<=6;i++) {
            var mc = this['h' + i];
            mc.alpla = 1;
            mc.setStaticVisible(false);
        }

        if(this.overTarget != -1)
        {
            if(this.overTarget == 20)//delete
                this.onDelete();
            else if(this.overTarget >= 10) //insert
            {
                this.onSplice({currentTarget:{index:this.overTarget-10}})
            }
            else  //swap
            {
                this.changeState('normal')
                this.swap(this.selectIndex,this.overTarget)
                this.selectIndex = -1;
                this.dispatchEventWith('change');
            }
        }
        else
        {
            this.onCancel();
        }
        //if(target && target.data != this.dragTarget.data)
        //{
        //    var temp = this.data.list[0]
        //    this.data.list[0] = this.data.list[1]
        //    this.data.list[1] = temp;
        //    this.dataChanged();
        //}
    }

    private changeState(stat){
        this.currentState = stat;
        this.renewChoosing(stat != 'normal');
        //for(var i=0;i<this.mcArray.length;i++) {
        //    var mc = this.mcArray[i];
        //    mc.y = this.posArray[i].y;
        //}
    }


    private onPKStart(){
        PKDressUI.getInstance().onPKStart();
    }

    private onMore(){
        var index = this.selectIndex
        var target = this.mcArray[this.selectIndex];
        var chooseList = [];
        for(var i=0;i<this.mcArray.length;i++) {
            var mc = this.mcArray[i];
            if(mc.data)
            {
                chooseList.push(mc.data);
            }
        }
        MonsterList.getInstance().show(chooseList,index)
    }


    private onClickStage(){
        if(this.selectIndex != -1)
            this.onCancel();
    }

    private onCancel(){
        this.changeState('normal')
        var item = this.mcArray[this.selectIndex];
        this.selectIndex = -1;
        item.data.selected = false;
        item.dataChanged();
        this.renewSplice();

    }

    private onDelete(){
        this.changeState('normal')
        var index = this.selectIndex
        var item = this.mcArray[index];

        this.mcArray.splice(index,1);
        this.listLength --;

        this.selectIndex = -1;
        this.mcArray.push(item);
        item.data = null;
        item.x = this.outPos.x;
        item.y = this.outPos.y;

        this.renewPos(null,true);
        this.renewSplice();
        this.dispatchEventWith('change');

        for(var i=0;i<this.mcArray.length;i++)   //上面拿了数据才会改变使用数量
        {
            this.mcArray[i].dataChanged();
        }
    }

    //插入
    private onSplice(e){
        this.changeState('normal')
        var item = e.currentTarget;
        var index = item.index;
        var selectItem = this.mcArray[this.selectIndex];

        if(this.selectIndex<index) //前面的插到后面
        {
            this.mcArray.splice(index,0,selectItem);
            this.mcArray.splice(this.selectIndex,1);
        }
        else
        {
            this.mcArray.splice(this.selectIndex,1);
            this.mcArray.splice(index,0,selectItem);
        }
        selectItem.data.selected = false;
        selectItem.dataChanged();
        this.selectIndex = -1;
        this.renewPos([selectItem]);
        this.renewSplice();
        this.dispatchEventWith('change');
    }

    private renewSplice(){
         for(var i=0;i<this.splicaArray.length;i++)
         {
             var mc = this.splicaArray[i];
             if(this.selectIndex == -1)
             {
                 mc.visible = false;
                 continue;
             }
             if(mc.index == this.selectIndex || mc.index == this.selectIndex + 1)
             {
                 mc.visible = false;
                 continue;
             }
             if(mc.index > this.listLength)
             {
                 mc.visible = false;
                 continue;
             }
             mc.visible = true;
             mc.scaleX = 1
             mc.scaleY = 1 * mc.bsy;
         }
    }

    private onMCClick(e){
        var item = e.currentTarget;
        var index = this.mcArray.indexOf(item);
        if(this.selectIndex == -1) //选中
        {
            if(!item.data)
                return
            this.selectIndex = index;
            item.data.selected = true;
            item.dataChanged();
            this.renewSplice();
            this.changeState('selected')
            GuideManager.getInstance().showGuide(PKDressUI.getInstance())
        }
        else if(this.selectIndex == index)//取消选中
        {
            this.selectIndex = -1;
            item.data.selected = false;
            item.dataChanged();
            this.renewSplice();
            this.changeState('normal')
        }
        else //交换
        {
            this.changeState('normal')
            var selectItem = this.mcArray[this.selectIndex];
            selectItem.data.selected = false;
            selectItem.dataChanged();
            if(item.data) //交换
            {
                this.swap(index,this.selectIndex);
                this.selectIndex = -1;
            }
            else//插到最后
            {
                this.mcArray.splice(this.listLength,0,selectItem)
                this.mcArray.splice(this.selectIndex,1);
                this.itemGroup.addChild(selectItem)
                this.selectIndex = -1;
                this.renewPos([selectItem]);
            }
            this.dispatchEventWith('change');
        }
    }

    public renew(list){


        this.selectIndex = -1;
        this.list = list
        this.listLength = list.length;
        this.cleanAll();
        for(var i=1;i<=6;i++) {
            var mc = this['h' + i]
            if(list[i-1])
            {
                mc.data = {id:list[i-1],specialData:this.specialData,vo:MonsterVO.getObject(list[i-1]),type:2,state:0,index:i,getChooseList:this.getChooseList(this)};
            }
            else
            {
                mc.data = null;
            }
            this.mcArray.push(mc);
        }
        
        this.mvItem.visible = false
        this.changeState('normal')
        this.renewPos(null,true);
        this.renewSplice();
    }

    //交换位置
    private swap(index1,index2){
        var item1 = this.mcArray[index1]
        var item2 = this.mcArray[index2]
        this.itemGroup.addChild(item1)
        this.itemGroup.addChild(item2)
        this.mcArray[index1] = item2;
        this.mcArray[index2] = item1;
        this.renewPos([item1,item2])
    }

    private renewPos(moveArr=null,stopTween = false){
        moveArr = moveArr || [];
        var des = 126;
        var changeNum = 0;
        for(var i=0;i<this.mcArray.length;i++)
        {
            var mc = this.mcArray[i];
            var posMC = this.posArray[i];
            if(!posMC)
            {
                posMC = this.posArray[9];
                mc.x = posMC.x + des;
                mc.y = posMC.y;
                mc.visible = false;
                continue;
            }
            mc.visible = true;
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
                tw.wait(changeNum * 50).to({x:posMC.x,y:posMC.y}, 200);
                changeNum ++;
            }
        }
    }

    public cleanAll(){
        while(this.mcArray.length > 0)
        {
            var mc = this.mcArray.pop();
            egret.Tween.removeTweens(mc);
        }
    }

    public addItem(mid){
        var mc = this.mcArray[this.listLength];
        mc.data = {vo:MonsterVO.getObject(mid),type:2,state:0,id:mid,specialData:this.specialData,getChooseList:this.getChooseList(this)};
        this.listLength ++;
        this.renewSplice();
        this.dispatchEventWith('change');

        for(var i=0;i<this.mcArray.length;i++)   //上面拿了数据才会改变使用数量
        {
            this.mcArray[i].dataChanged();
        }
    }

    public getChooseList(self){
        return function(){
            var arr = []
            for(var i=0;i<self.mcArray.length;i++) {
                var mc = self.mcArray[i];
                if(mc.data)
                    arr.push(mc.data);
            }
            return arr;
        }
    }

    public getList(){
        var chooseList = [];
        for(var i=0;i<this.mcArray.length;i++) {
            var mc = this.mcArray[i];
            if(mc.data)
                chooseList.push(mc.data.vo.id);
        }
        return chooseList;
    }

}