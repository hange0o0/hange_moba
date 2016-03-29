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
    private topUI: TopUI;
    private btnGrop: eui.Group;
    private pkBtn: eui.Group;
    private ringRadio2: eui.RadioButton;
    private ringRadio1: eui.RadioButton;
    private backBtn: eui.Button;
    private boxMC: eui.Image;
    private h1: PKDressChooseItem;
    private h2: PKDressChooseItem;
    private h3: PKDressChooseItem;
    private h4: PKDressChooseItem;
    private h5: PKDressChooseItem;
    private h9: PKDressChooseItem;
    private h10: PKDressChooseItem;
    private h6: PKDressChooseItem;
    private h7: PKDressChooseItem;
    private h8: PKDressChooseItem;



    private dragMC: PKDressChooseItem;
    private posArray = [];
    private mcArray = [];//没用到的MC
    public dataIn//数据

    private overPos;
    private dragMCOrginPos;
    private dragMCStat;//0:普通，1垃圾，2还原块



    private touchTimer
    private ringInfo


    
    
    
    
   private posData:any //位置的初始数据
   private point //重复利用的point节点


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('调整位置&出战')
        this.topUI.addEventListener('hide',this.hide,this);
        this.addBtnEvent(this.pkBtn,this.onPK);
        this.addBtnEvent(this.backBtn,this.onSet);

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


            this.posArray.push({x:mc.x,y:mc.y});
            var line = Math.ceil(i/4);
            if(!this.posData[line])
            {
                this.posData[line] = {};
                this.posData[line].startY = mc.y;
                this.posData[line].endY = mc.y + mc.height;
            }
            var index = i%4 || 4;
            this.posData[line]['x'+index]  = mc.x
            this.posData[line]['x_'+index]  = mc.x + mc.y
        }

        this.ringRadio1.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onRing1Touch,this);
        this.ringRadio2.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onRing2Touch,this);
    }

    private onPK(){
        this.hide();
    }

    private onSet(){
        PKDressUI.getInstance().resetChoose(this.getChooseData());
        this.hide();
    }

    private getChooseData(){
        var oo:any = {list:[]};
        for(var i=0;i<this.mcArray.length;i++)
        {
             oo.list.push(this.mcArray[i].vo.id);
        }
        oo.ring = this.ringRadio1.group.selectedValue;
        return oo;
    }

    public show(data?){
        this.dataIn = data;
        this.overPos = -1;
        super.show();
        //PKDressChooseUI.getInstance().show({list:[101,101,101,101,101,101,101],ring:1,ring1:1,ring2:2})
    }

    public onShow(){
        var list = this.dataIn.list;
        this.cleanAll();
        for(var i=1;i<=10;i++) {
            var mc = this['h' + i]
            if(list[i])
            {
                mc.data = {vo:MonsterVO.getObject(list[i]),type:2,state:0,index:i};
                mc.visible = true;
                mc['stopMove'] = false;
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

    private onRing1Touch(){
        this.stage.once(egret.TouchEvent.TOUCH_END,this.onRingTouchEnd,this);
        //this.touchTimer = egret.setTimeout(this.showRingInfo,this,500,this.ringList[0]);
    }
    private onRing2Touch(){
        this.stage.once(egret.TouchEvent.TOUCH_END,this.onRingTouchEnd,this);
        //this.touchTimer = egret.setTimeout(this.showRingInfo,this,500,this.ringList[1]);
    }

    private showRingInfo(ringID){
        this.ringInfo.visible = true;
        //if(this.isEqual)
        //    this.ringInfo.text = '' + RingVO.getObject(ringID).getLevelDes(RingVO.equalLevel);
        //else
            this.ringInfo.text = '' + RingVO.getObject(ringID).getLevelDes(UM.getRingLevel(ringID));
    }

    private onRingTouchEnd(){
        egret.clearTimeout(this.touchTimer);
        this.ringInfo.visible = false;
    }

    private onClick(e){
        this.dispatchEventWith('chooseMC',false,e.target.data);
    }

    private onStart(e){
        this.dragMC = e.currentTarget;
        var index = this.mcArray.indexOf(this.dragMC);
        this.mcArray.splice(index,1);
        this.dragMCOrginPos = index;
        this.dragMCStat = 0;

        this.renewPos();
    }

    private onMove(e){
        if(this.boxMC.hitTestPoint(e.data.x,e.data.y))//移到垃圾桶上
        {
            if(this.dragMCStat == 1)//还在垃圾桶上
                return;
            this.boxMC.source = 'aa';
            this.dragMCStat = 1;
            return;
        }
        else if(this.dragMCStat == 1)//移出垃圾桶
        {
            this.boxMC.source = 'bb';
            this.dragMCStat = 0;
        }

        this.testCurrentPos(e.data.x,e.data.y);
    }

    private testCurrentPos(x,y){
        this.point = this.globalToLocal(x,y,this.point)
        x = this.point.x;
        y = this.point.y;
        var index2 = this.mcArray.indexOf(this.dragMC);
        this.overPos = -1;
        for(var i=1;i<=3;i++)
        {
            var data = this.posData[i];
            if(data.startY < y && data.endY > y)//在某一行中    ;
            {
                var line = i;
                for(var i=1;i<=4;i++)
                {
                    var index = (line-1)*4 + i - 1;
                      if(x <this.posData[line]['x'+i])//左则,插入
                      {
                          if(index2 == -1)
                          {
                              this.mcArray.splice(index,0,this.dragMC);
                              this.dragMC['stopMove'] = true;
                              this.renewPos();
                              console.log('inject:' + index);
                          }
                      }
                      else if(x <this.posData[line]['x_'+i])//代替，发光
                      {
                          if(index2 != -1)
                          {
                              this.mcArray.splice(index2,1);
                          }
                          console.log('over:' + index);
                          this.overPos = index;
                          this.dragMC['stopMove'] = false;
                          this.renewPos();
                      }
                }
                break;
            }
        }
        //没行为
        this.dragMC['stopMove'] = false;
        if(index2 != -1)
        {
            this.mcArray.splice(index2,1);
        }
        this.renewPos();
    }

    private onEnd(e){
        if(this.dragMCStat = 1) //移除了当前块
        {
            //this.mcArray.push(this.dragMC);
            egret.Tween.removeTweens(this.dragMC);
        }
        else if(this.mcArray.indexOf(this.dragMC) == -1)//返回原位置
        {
            this.mcArray.splice(this.dragMCOrginPos,0,this.dragMC);
        }
        this.dragMC = null;
        this.renewPos();

    }

    private renewPos(stopTween = false){
        for(var i=0;i<this.mcArray.length;i++)
        {
            var mc = this.mcArray[i];
            var posMC = this.posArray[i];
            console.log(mc.x,mc.y)
            //mc.index = i;
            //if(mc == this.dragMC)
            //{
            //    mc = this.replaceDragMC;
            //}

            if(mc == this.dragMC)//自己本身
            {
                //this.mcArray[i].data.state = 1;
                //this.mcArray[i].dataChange();
            }
            else if(i == this.overPos && this.mcArray[i].data.state != 2)//经过发光
            {
                this.mcArray[i].data.state = 2;
                this.mcArray[i].dataChange();
            }
            else if(this.dragMC && this.mcArray[i].data.vo.isEffect(this.dragMC.data.vo.id) && this.mcArray[i].data.state != 3)//有加成的发光
            {
                this.mcArray[i].data.state = 3;
                this.mcArray[i].dataChange();
            }
            else if(this.mcArray[i].data.state != 0)//无发光
            {
                this.mcArray[i].data.state = 0;
                this.mcArray[i].dataChange();
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
        while(this.mcArray.length > 0)
        {
            var mc = this.mcArray.pop();
            egret.Tween.removeTweens(mc);
        }
    }

}