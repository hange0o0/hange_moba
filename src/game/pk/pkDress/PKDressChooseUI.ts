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
    private randomBG: eui.Image;
    private randomIcon: eui.Image;
    private resetBtn: eui.Group;
    private sortBtn: eui.Group;
    private sortText: eui.Label;
    private cb: eui.CheckBox;
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
    public atkData:any = {};


   private _selectIndex = -1;
    private get selectIndex(){
        return this._selectIndex;
    }
    private set selectIndex(v){
        this._selectIndex = v;
        var monsterData = null;
        if(v != -1)
        {
            monsterData = this.mcArray[v].data;
            //egret.callLater(function(){
            //    this.once(egret.TouchEvent.TOUCH_TAP,this.onClickStage,this,false,-9999);
            //},this)
        }
        else
        {
            //this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickStage,this);
        }
        this.dispatchEventWith('chooseItem',false,monsterData)
    }

    private outPos

    public specialData;

    private dragTarget
    private overTarget


    public sortIndex = 0;
    private sortArr = [
        {w:'费用排序',c:0xCCB48E},
        {w:'血量排序',c:0xFF4747},
        {w:'攻击排序',c:0xFDC04F},
        {w:'速度排序',c:0x747DFF}
    ];
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
        this.addBtnEvent(this.sortBtn, this.onSort);

        this.sortBtn.touchChildren = false;

        //this.addBtnEvent(this.moreBtn, this.onMore);

        this.dragTarget = new PKDressChooseItem();
        this.dragTarget.alpha = 0.5

        this.cb.addEventListener(eui.UIEvent.CHANGE,this.onCBChange,this);
        this.cb.selected = true;


        MyTool.addLongTouch(this.randomBtn,this.onRandomSetting,this)

        //console.log(this.posArray);
    }

    private onRandomSetting(){
        PKDressUI.getInstance().showSetting();
        GuideManager.getInstance().showGuide(PKDressUI.getInstance())
    }

    public setRandomBG(b){
         this.randomBG.visible = b;
    }

    public resetSort(){
        if(!GuideManager.getInstance().isGuiding)
        {
            this.sortIndex = SharedObjectManager.instance.getValue('monster_sort') || 0;
            var cbSelect =  SharedObjectManager.instance.getValue('monster_cb')
            if(cbSelect == undefined)
                cbSelect = true;
            this.cb.selected =  cbSelect;
        }
        this.sortText.text = this.sortArr[this.sortIndex].w;
        this.sortText.textColor = this.sortArr[this.sortIndex].c;
    }

    private onCBChange(){
        SharedObjectManager.instance.setValue('monster_cb',this.cb.selected)
        this.renewSplice();
    }

    private onSort(){
        this.sortIndex ++
        if(this.sortIndex >= this.sortArr.length)
            this.sortIndex = 0;
        this.sortText.text = this.sortArr[this.sortIndex].w;
        this.sortText.textColor = this.sortArr[this.sortIndex].c;
        SharedObjectManager.instance.setValue('monster_sort',this.sortIndex)
        this.dispatchEventWith('sort');
    }

    public onRandom(){
        var GM = GuideManager.getInstance();
        if(GM.isGuiding && GM.guideRandom == 2)
        {
            ShowTips('请' + this.createHtml('【长按】',0xE0A44A)+'随机按钮')
            return;
        }

        this.dispatchEventWith('random');
    }
    public onReset(){
        if(GuideManager.getInstance().isGuiding)
        {

            return;
        }
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
        this._selectIndex = this.mcArray.indexOf(e.target);
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


    private onClickStage(e){
        if(this.selectIndex != -1)
        {
            if(e.target != this.cb)
                this.onCancel();
        }
    }

    private onCancel(){
        this.changeState('normal')
        var item = this.mcArray[this.selectIndex];
        this.selectIndex = -1;
        if(item.data)
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

        this.justRenewList();
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
        if(selectItem.data)
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
             mc.visible = this.cb.selected || this.dragTarget.parent;
             mc.scaleX = 1
             mc.scaleY = 1 * mc.bsy;
         }
    }

    public selectMCByIndex(index){
        if(this.selectIndex == index)
            return;
        if(this.selectIndex != -1)
        {
            var item = this.mcArray[this.selectIndex];
            if(item.data)
                item.data.selected = false;
            item.dataChanged();
        }
        var item = this.mcArray[index];
        this.selectIndex = index;
        if(item.data)
            item.data.selected = true;
        item.dataChanged();
        this.renewSplice();
        this.changeState('selected')
        GuideManager.getInstance().showGuide(PKDressUI.getInstance())
    }

    private onMCClick(e){
        var item = e.currentTarget;
        if(item['stopClickTimer'] &&  egret.getTimer() - item['stopClickTimer'] < 200)
            return

        var index = this.mcArray.indexOf(item);
        if(this.selectIndex == -1) //选中
        {
            if(!item.data)
            {
                ShowTips('请点击下方卡兵选择上阵单位')
                return
            }
            this.selectIndex = index;
            if(item.data)
                item.data.selected = true;
            item.dataChanged();
            this.renewSplice();
            this.changeState('selected')
            GuideManager.getInstance().showGuide(PKDressUI.getInstance())
        }
        else if(this.selectIndex == index)//取消选中
        {
            this.selectIndex = -1;
            if(item.data)
                item.data.selected = false;
            item.dataChanged();
            this.renewSplice();
            this.changeState('normal')
        }
        else //交换
        {
            var selectItem = this.mcArray[this.selectIndex];
            if(selectItem.data)
                selectItem.data.selected = false;
            selectItem.dataChanged();

            if(!this.cb.selected)
            {
                this.selectIndex = index;
                if(item.data)
                    item.data.selected = true;
                item.dataChanged();
                return;
            }


            this.changeState('normal')
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
            mc.renewIndex(i)
            this.mcArray.push(mc);
        }
        
        this.mvItem.visible = false
        this.changeState('normal')
        this.renewPos(null,true);
        this.renewSplice();
        this.justRenewList();
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
            mc.renewIndex(i+1)
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

        this.justRenewList();
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

    public justRenewList(){
        this.atkData = {
            atk:[],
            hp:[],
            speed:[],
        }
        //var temp:any = this.atkData[vo.id] = {};
        //temp.hp =  Math.round(vo.hp * (1+fightData.hp/100));
        //temp.atk =  Math.round(vo.atk * (1+fightData.atk/100));
        //temp.speed =  Math.round(vo.speed * (1+fightData.speed/100));
        //this.atkData.hp.push(temp.hp);
        //this.atkData.atk.push(temp.atk);
        //this.atkData.speed.push(temp.speed);
        for(var i=0;i<this.mcArray.length;i++) {
            var mc = this.mcArray[i];
            if(mc.data)
            {
                var temp = PKDressUI.getInstance().atkData[mc.data.id];
                this.atkData.hp.push(temp.hp);
                this.atkData.atk.push(temp.atk);
                this.atkData.speed.push(temp.speed);
            }
        }

        var sortNumber = function(a,b)
        {
            return b - a;
        }
        this.atkData.hp.sort(sortNumber);
        this.atkData.atk.sort(sortNumber);
        this.atkData.speed.sort(sortNumber);


        for(var i=0;i<this.mcArray.length;i++) {
            var mc = this.mcArray[i];
            mc.dataChanged();
        }
    }

}