class PKDressChooseUI extends game.BaseWindow {

    private static instance:PKDressChooseUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKDressChooseUI();
        return this.instance;
    }


    public constructor() {
        super();
        this.skinName = "PKDressChooseUISkin";
    }

    
    private boxMC: eui.Image;
    private h1: PKDressChooseItem;
    private h2: PKDressChooseItem;
    private h3: PKDressChooseItem;
    private h4: PKDressChooseItem;
    private h5: PKDressChooseItem;
    private h9: PKDressChooseItem;
    private h6: PKDressChooseItem;
    private h7: PKDressChooseItem;
    private h8: PKDressChooseItem;
    private h10: PKDressChooseItem;






    private dragMC: PKDressChooseItem;
    private posArray = [];
    private mcArray = [];//没用到的MC
    private listLength ;//没用到的MC
    public dataIn//数据

    private dragMCOrginPos;
    private dragMCStat;//0:普通，1垃圾，2还原块


    
   private posData:any //位置的初始数据
   private point //重复利用的point节点


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('调整位置&出战')
        this.topUI.addEventListener('hide',this.hide,this);
        this.addBtnEvent(this.pkBtn2,this.onPKStart);
        this.addBtnEvent(this.pkBtn,this.onPK);
        this.addBtnEvent(this.backBtn,this.onSet);
        this.addBtnEvent(this.backBtn2,this.onChangeNormal);

        this.posData = {};
        for(var i=1;i<=10;i++)
        {
            //var posMC = this['pos'+i]


            var mc = this['h'+i]
            //this.mcArray.push(mc);
            DragManager.getInstance().setDrag(mc);
            mc.addEventListener('start_drag',this.onStart,this)
            mc.addEventListener('move_drag',this.onMove,this)
            mc.addEventListener('end_drag',this.onEnd,this)
            mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClick,this)
            //MyTool.removeMC(mc);

            var dec = 15;

            this.posArray.push({x:mc.x,y:mc.y});
            var line = Math.ceil(i/4);
            if(!this.posData[line])
            {
                this.posData[line] = {};
                this.posData[line].startY = mc.y + dec;
                this.posData[line].endY = mc.y + mc.height - dec;
            }
            var index = i%4 || 4;
            this.posData[line]['x' + index] = mc.x + dec
            this.posData[line]['x_' + index] = mc.x + mc.width - dec
        }

        MyTool.addLongTouch(this.ringRadio1,this.showRingInfo1)
        MyTool.addLongTouch(this.ringRadio2,this.showRingInfo2)
    }

    private onPKStart(){
        var self = this
        PKManager.getInstance().startPK(PKDressUI.getInstance().pkType,this.getChooseData(),function(){
            PKDressUI.getInstance().hide();
            self.hide();
            PKMainUI.getInstance().show();
        })
    }
    private onPK(){
        this.currentState = 'ready'
        this.pkBtn2.visible = true;
        this.backBtn2.visible = true;
        this.pkBtn.visible = false;
        this.backBtn.visible = false;
    }

    private onChangeNormal(){
        this.currentState = 'normal'
        this.pkBtn2.visible = false;
        this.backBtn2.visible = false;
        this.pkBtn.visible = true;
        this.backBtn.visible = true;
    }
    private onSet(){
        PKDressUI.getInstance().resetChoose(this.getChooseData());
        this.hide();
    }

    private getChooseData(){
        var oo:any = {list:[]};
        for(var i=0;i<this.mcArray.length;i++)
        {
             oo.list.push(this.mcArray[i].data.vo.id);
        }
        oo.ring = this.ringRadio1.group.selectedValue;
        oo.index = this.dataIn.index;
        return oo;
    }

    public show(data?){
        this.dataIn = data;
        super.show();
        //PKDressChooseUI.getInstance().show({list:[101,101,101,101,101,101,101],ring:1,ring1:1,ring2:2})
    }

    public onShow(){
        this.onChangeNormal();

        var list = this.dataIn.list;
        this.listLength = list.length;
        this.cleanAll();
        for(var i=1;i<=10;i++) {
            var mc = this['h' + i]
            if(list[i-1])
            {
                mc.data = {vo:MonsterVO.getObject(list[i-1]),type:2,state:0,index:i};
                mc.visible = true;
//                mc['stopMove'] = false;
                this.mcArray.push(mc);
            }
            else
            {
                mc.visible = false;
            }
        }

        this.ringRadio1.value =  this.dataIn.ring1
        this.ringRadio2.value =  this.dataIn.ring2
        this.ringRadio1.label = RingVO.getObject(this.dataIn.ring1).name;
        this.ringRadio2.label = RingVO.getObject(this.dataIn.ring2).name;
        if(this.dataIn.ring == this.dataIn.ring1)
        {
            this.ringRadio1.selected = true;
        }
        else
        {
            this.ringRadio2.selected = true;
        }

        this.renewPos(true);
    }

    private showRingInfo1(){
         console.log('ring info ' + this.ringRadio1.value)
    }
    private showRingInfo2(){
        console.log('ring info ' + this.ringRadio2.value)

    }

    private onClick(e){
        this.dispatchEventWith('chooseMC',false,e.target.data);
    }

    private onStart(e){
        this.dragMC = e.currentTarget;
        this.dragMC.alpha = 0.5;
        this.dragMC.parent.addChild(this.dragMC);
        var index = this.mcArray.indexOf(this.dragMC);
        this.mcArray.splice(index,1);
        this.dragMCOrginPos = index;
        this.dragMCStat = 0;

        this.btnGrop.visible = false;
        this.boxMC.visible = true;
        this.boxMC.source = 'drop2_png';

        this.renewPos();
    }

    private onMove(e){
        if(this.boxMC.hitTestPoint(e.data.x,e.data.y))//移到垃圾桶上
        {
            if(this.dragMCStat == 1)//还在垃圾桶上
                return;
            this.boxMC.source = 'drop_png';
            this.dragMCStat = 1;
            return;
        }
        else if(this.dragMCStat == 1)//移出垃圾桶
        {
            this.boxMC.source = 'drop2_png';
            this.dragMCStat = 0;
        }

        this.testCurrentPos(e.data.x,e.data.y);
    }

    private testCurrentPos(x,y){
        this.point = this.globalToLocal(x,y,this.point)
        x = this.point.x;
        y = this.point.y;
        var index2 = this.mcArray.indexOf(this.dragMC);
        for(var i=1;i<=3;i++)
        {
            var data = this.posData[i];
            if(data.startY < y && data.endY > y)//在某一行中    ;
            {
                var line = i;
                for(var i=1;i<=4;i++)
                {
                    var index = (line-1)*4 + i - 1;
                    if(index >= this.listLength) //无这个位置卡牌了
                    {
                         break
                    }
                    if(x < this.posData[line]['x_'+i] && x > this.posData[line]['x'+i])//在上方,插入
                    {
                        if(index2 == -1)
                        {
                            this.mcArray.splice(index,0,this.dragMC);
//                            this.dragMC['stopMove'] = true;
                            this.renewPos();
                        }

                        return;
                    }
                }
                break;
            }
        }
        //没行为
//        this.dragMC['stopMove'] = false;
        if(index2 != -1)
        {
            this.mcArray.splice(index2,1);
        }
        this.renewPos();
    }

    private onEnd(e){
        if(this.dragMCStat == 1) //移除了当前块
        {
            //this.mcArray.push(this.dragMC);
            egret.Tween.removeTweens(this.dragMC);
            this.listLength --;
            this.dragMC.visible = false
        }
        else if(this.mcArray.indexOf(this.dragMC) == -1)//返回原位置
        {
            this.mcArray.splice(this.dragMCOrginPos,0,this.dragMC);
        }
        
        this.dragMC.alpha = 1;
        this.dragMC = null;
        this.renewPos();

        this.btnGrop.visible = true;
        this.boxMC.visible = false;

    }

    private renewPos(stopTween = false){
        for(var i=0;i<this.mcArray.length;i++)
        {
            var mc = this.mcArray[i];
            var posMC = this.posArray[i];
            //mc.index = i;
            //if(mc == this.dragMC)
            //{
            //    mc = this.replaceDragMC;
            //}

            if(mc == this.dragMC)//自己本身
            {
                continue;
                //this.mcArray[i].data.state = 1;
                //this.mcArray[i].dataChanged();
            }
            else if(this.dragMC && this.mcArray[i].data.vo.isEffect(this.dragMC.data.vo.id) && this.mcArray[i].data.state != 2)//有加成的发光
            {
                this.mcArray[i].data.state = 2;
                this.mcArray[i].dataChanged();
            }
            else if(this.mcArray[i].data.state != 0)//无发光
            {
                this.mcArray[i].data.state = 0;
                this.mcArray[i].dataChanged();
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
                if(mc.y == posMC.y)
                    tw.to({x:posMC.x,y:posMC.y}, 200);
                else if(mc.y < posMC.y) //向下移
                {
                    mc.y = posMC.y;
                    mc.x = posMC.x - 160;
                    tw.to({ x: posMC.x},200);
                }
                else{
                    mc.y = posMC.y;
                    mc.x = posMC.x + 160;
                    tw.to({ x: posMC.x },200); 
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

}