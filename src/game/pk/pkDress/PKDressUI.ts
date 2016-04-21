class PKDressUI extends game.BaseUI {
    private static instance:PKDressUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKDressUI();
        return this.instance;
    }
    


    
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private coinText: eui.Label;
    private woodText: eui.Label;
    private forceText: eui.Label;
    private viewBtn: eui.Button;
    private enemyList: eui.List;
    private ringRadio0: eui.RadioButton;
    private ringRadio1: eui.RadioButton;
    private pkBtn: eui.Button;
    private pkDressChooseUI: PKDressChooseUI;



    private totalWood = 1;
    private totalCoin = 100

    public monsterList = [];
    public ringList = [];
    public chooseList = [];

    public history = {};//历史记录


    public isEqual = false;
    public specialData = {isEqual:false};
    public dataIn;
    public orginData; //卡组的原始数据
    public pkType; //PK类型
    public key;//记录上一次选择的TAB

    public chooseMonster;


    public constructor() {
        super();
        this.skinName = "PKDressUISkin";

        this.history = SharedObjectManager.instance.getMyValue('dress_history') || {}
    }

    public show(data?){
        this.dataIn = data
        this.pkType = data.pktype;
        this.orginData = data.data;
        this.isEqual = data.isEqual;
        this.specialData.isEqual = this.isEqual;

        this.key = this.orginData.list.join(',') + '|' + this.orginData.ring.join(',');


        super.show();
    }

    public onShow(){
        this.monsterList = this.orginData.list;
        this.ringList = this.orginData.ring;
        this.reInitData();
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('调整位置')
        this.topUI.addEventListener('hide',this.hide,this);




        this.addBtnEvent(this.pkBtn, this.onPKStart);
        this.addBtnEvent(this.viewBtn, this.onView);
        this.addBtnEvent(this.forceText, this.onForceText);



        this.list.itemRenderer = PKDressChooseListItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;


        this.enemyList.itemRenderer = EnemyHeadItem;

        this.pkDressChooseUI.addEventListener('change',this.onChooseChange,this)
        this.pkDressChooseUI.specialData = this.specialData;
    }


    private onPKStart(){
        if(this.chooseList.length == 0)
        {
            Alert('请先选择出战单位');
            return;
        }
        var chooseData = {list:this.chooseList,ring:this.ringRadio0.group.selectedValue,index:this.dataIn.index}
        var self = this
        PKManager.getInstance().startPK(PKDressUI.getInstance().pkType,chooseData,function(){
            PKDressUI.getInstance().hide();
            self.hide();
            PKMainUI.getInstance().show();
        })
    }

    private onForceText(){
          if(this.forceText.textColor == 0xFF0000)
          {
              Alert('当出战单位种类较为单一时，会产生过载，整体战力-8%');
          }
    }

    private onView(){
        if(this.currentState == 'more')
            this.currentState = 'normal';
        else
            this.currentState = 'more';

    }

    public addMonster(mid){
        if(this.chooseList.length > 0)
        {
            Alert('每次战斗最多可出10张卡');
            return;
        }
        this.pkDressChooseUI.addItem(mid);
    }
    
    private onChooseChange(){
        this.chooseList = this.pkDressChooseUI.getList();
        this.saveHistory();
        this.renew();
        this.renewList();
    }

    //怪物被使用次数
    public getMonsterNum(mid){
        var count = 0;
        for(var i=0;i<this.chooseList.length;i++)
        {
            if(this.chooseList[i] == mid)
                count ++;
        }
        return count;
    }
    private saveHistory(){
        this.history[this.pkType] = {key:this.key,list:this.chooseList,ring:this.ringRadio0.group.selectedValue,time:TM.now()};
        SharedObjectManager.instance.setMyValue('dress_history',this.history);
    }


    //得到当前用剩的资源
    public getCurrentResource(){
        var oo = {coin:this.totalCoin,wood:this.totalWood}
        var arr = this.chooseList
        for(var i=0;i<arr.length;i++) {
            var vo = MonsterVO.getObject(arr[i]);
            oo.coin -= vo.cost;
            oo.wood -= vo.wood;
        }
        return oo;
    }

    public reInitData(){

        this.ringRadio0.value = this.ringList[0];
        this.ringRadio1.value = this.ringList[1];
        this.ringRadio0.label =  RingVO.getObject(this.ringList[0]).name;
        this.ringRadio1.label =  RingVO.getObject(this.ringList[1]).name;


        this.totalWood = 1;
        this.totalCoin = 100;
        if(!this.history[this.pkType] || this.history[this.pkType].key != this.key)
            this.history[this.pkType] = {key:this.key,list:[],ring:this.ringList[0],time:TM.now()};
        var data = this.history[this.pkType];
        this.ringRadio0.group.selectedValue = data.ring;
        this.chooseList = data.list;

        this.list.selectedIndex = -1;
        this.chooseMonster = null;
        this.scroller.viewport.scrollV = 0;

        this.enemyList.dataProvider = new eui.ArrayCollection(this.dataIn.enemy);
        if(!this.dataIn.enemy)
        {
            this.currentState = 'normal';
            this.viewBtn.visible = false;
        }
        else
        {
            this.viewBtn.visible = true;
        }


        this.pkDressChooseUI.renew(this.chooseList);
        this.renewList();
        this.renew();
    }


    private renewList(){
        var arr = [];
        var selectVO = MonsterVO.getObject(this.chooseMonster);

        var ro = this.getCurrentResource();
        for(var i=0;i<this.monsterList.length;i++)
        {
             var oo:any = {};
            var vo = MonsterVO.getObject(this.monsterList[i]);

            oo.vo = vo;
            oo.id = vo.id;
            oo.specialData =  this.specialData;
            oo.num = this.getMonsterNum(vo.id);
            oo.index = i;
            oo.list = arr;
            oo.ro = ro;
            arr.push(oo);
        }

        this.list.dataProvider = new eui.ArrayCollection(arr);
    }


    public renew(){
        var oo = this.getCurrentResource();
        //资源
        this.coinText.text = oo.coin + '';
        this.woodText.text = oo.wood + '';

        //战力加成相关
        var fight = 0;
        var list = []//this.chooseUI.getChooseList();
        var monsterRecord = {};
        var count = 0;
        for(var i=0;i<list.length;i++)
        {
            var monsterID = list[i];
            if(monsterRecord[monsterID])
                continue;
            monsterRecord[monsterID] = 1;
            count ++;
            if(UM.getMonsterCollect(monsterID) == 4)//4星对全体战力加成2%
            {
                if(MonsterVO.getObject(monsterID).wood)
                    fight += 5;
                else
                    fight += 2;
            }
        }
        if(count*2 > list.length) //过载
        {
            fight -= 8;
            this.forceText.textColor = 0xFF0000;
            if(fight < 0)
                this.forceText.text = '' + fight + '%' + '(过载)'
            else
                this.forceText.text = '+' + fight + '%' + '(过载)'
        }
        else if(fight > 0)
        {
            this.forceText.textColor = 0x00FF00;
            this.forceText.text = '+' + fight + '%'
        }
        else
        {
            this.forceText.text = '';
        }


    }

}