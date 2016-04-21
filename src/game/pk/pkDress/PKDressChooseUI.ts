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
    private h7: PKDressChooseItem;
    private h8: PKDressChooseItem;
    private h9: PKDressChooseItem;
    private h10: PKDressChooseItem;
    private spliceGroup: eui.Group;
    private a1: eui.Image;
    private a2: eui.Image;
    private a3: eui.Image;
    private a4: eui.Image;
    private a5: eui.Image;
    private a6: eui.Image;
    private a7: eui.Image;
    private a8: eui.Image;
    private a9: eui.Image;
    private a10: eui.Image;
    private a11: eui.Image;
    private a12: eui.Image;





    private mvItem: PKDressChooseItem; //动画过度





    private splicaArray = [];
    private posArray = [];
    private mcArray = [];//没用到的MC
    private listLength ;//当前有效卡组长度
    public list//数据


   private selectIndex = -1;

    private outPos

    public specialData;


    public childrenCreated() {
        super.childrenCreated();

        //this.posData = {};

        this.mvItem = new PKDressChooseItem();
        this.itemGroup.addChild(this.mvItem);
        this.mvItem.visible = false;
        var des = 126;
        for(var i=1;i<=10;i++)
        {
            var mc = this['h'+i]
            mc.index = i;
            this.addBtnEvent(mc,this.onMCClick)
            MyTool.addLongTouch(mc,this.onLongTouch,this);
            mc.addEventListener('deleted',this.onDelete,this)



            var dec = 15;
            this.posArray.push({x:mc.x,y:mc.y});
            if(i == 10)
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

        for(var i=1;i<=12;i++)
        {
            var a = this['a' + i];
            this.addBtnEvent(a,this.onSplice)
            this.splicaArray.push(a);
            var index = i-1;
            if(index>5)
                index--;
            a.index = index;
        }
    }

    private onDelete(e){
        var item = e.currentTarget;
        var index = this.mcArray.indexOf(item);
        this.mcArray.splice(index,1);
        this.listLength --;

        this.selectIndex = -1;
        this.mcArray.push(item);
        item.data = null;
        item.x = this.outPos.x;
        item.y = this.outPos.y;
        this.renewPos();
        this.dispatchEventWith('change');
    }

    //插入
    private onSplice(e){
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
        this.renewPos([selectItem]);
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
        }
        else if(this.selectIndex == index)//取消选中
        {
            this.selectIndex = -1;
            item.data.selected = false;
            item.dataChanged();
            this.renewSplice();
        }
        else //交换
        {
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
        for(var i=1;i<=10;i++) {
            var mc = this['h' + i]
            if(list[i-1])
            {
                mc.data = {id:list[i-1],specialData:this.specialData,vo:MonsterVO.getObject(list[i-1]),type:2,state:0,index:i};
            }
            else
            {
                mc.data = null;
            }
            this.mcArray.push(mc);
        }
        
        this.mvItem.visible = false
        this.renewPos(null,true);
    }


    private onLongTouch(target){
        if(!target.data)
            return;
        var chooseList = [];
        for(var i=0;i<this.mcArray.length;i++) {
            var mc = this.mcArray[i];
            if(mc.data)
            {
                chooseList.push(mc.data);
            }

        }
        var index = chooseList.indexOf(target.data);
        MonsterList.getInstance().show(chooseList,index)
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
                if(mc.y == posMC.y || moveArr.indexOf(mc) != -1)
                    tw.to({x:posMC.x,y:posMC.y}, 200);
                else
                {
                    var tw2:egret.Tween = egret.Tween.get(this.mvItem);
                    this.mvItem.visible = true;
                    this.mvItem.data = mc.data;
                    this.mvItem.x = mc.x;
                    this.mvItem.y = mc.y;

                    if(mc.y < posMC.y) //向下移
                    {
                        mc.y = posMC.y;
                        mc.x = posMC.x - des;
                        tw.to({ x: posMC.x},200);

                        tw2.to({ x: this.mvItem.x + des},200).call(function(){
                            this.mvItem.visible = false;
                        },this);
                    }
                    else{
                        mc.y = posMC.y;
                        mc.x = posMC.x + des;
                        tw.to({ x: posMC.x },200);

                        tw2.to({ x: this.mvItem.x - des},200).call(function(){
                            this.mvItem.visible = false;
                        },this);

                    }


                }
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
        mc.data = {vo:MonsterVO.getObject(mid),type:2,state:0,id:mid,specialData:this.specialData};
        this.listLength ++;
        this.renewSplice();
        this.dispatchEventWith('change');
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