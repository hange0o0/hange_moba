class FriendPKAskUI extends game.BaseUI {
    private static instance:FriendPKAskUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendPKAskUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private timesText: eui.Label;
    private ringRadio0: eui.RadioButton;
    private ringRadio1: eui.RadioButton;
    private inputText: eui.TextInput;
    private enemyGroup0: eui.Group;
    private pkTypeText: eui.Label;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private chooseBtn0: eui.Button;
    private myGroup1: eui.Group;
    private myList1: eui.List;
    private chooseBtn1: eui.Button;
    private helpBtn: eui.Group;




    private data;
    private isAnswer;
    private specialData:any;
    public constructor() {
        super();
        this.skinName = "FriendPKAskUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.addEventListener('hide',this.hide,this);
        //this.addBtnEvent(this, this.onClick);

        //this.inputText.addEventListener(egret.Event.CHANGE,this.onTextChange)

        this.ringRadio0.group.addEventListener(egret.Event.CHANGE,this.onRadioChange,this)
        this.ringRadio0.selected = true;

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);
        this.addBtnEvent(this.chooseBtn1, this.onChoose2);
        
        this.myList0.itemRenderer =  MyHeadItem;
        this.myList1.itemRenderer =  MyHeadItem;

        this.inputText.restrict = "^\\\\\"\'"

        this.scroller.bounces = false;
        this.addBtnEvent(this.helpBtn,this.onHelp);
    }

    private onHelp(){
        HelpManager.getInstance().friendHelp();
    }

    public beforeHide(){
        this.clearList([this.myList0,this.myList1])
    }

    private onRadioChange(){
         if(this.ringRadio0.selected) //选中第一个
            this.specialData.isEqual = false;
        else
             this.specialData.isEqual = true;
        this.renewCardList();
    }

    public show(data?,isAnswer?){
        this.data = data;
        this.isAnswer = isAnswer;

        super.show();
    }

    public onShow(){
        if(this.isAnswer)
        {
            this.topUI.setTitle('好友应战')
            MyTool.removeMC(this.enemyGroup)
            this.scrollerGroup.addChildAt(this.enemyGroup0,0);
            if(this.data.content.isequal)
                this.pkTypeText.text = '使用规则：修正场规则';
            else
                this.pkTypeText.text = '使用规则：竞技场规则';
        }
        else
        {
            this.topUI.setTitle('挑战好友')
            MyTool.removeMC(this.enemyGroup0)
            this.scrollerGroup.addChildAt(this.enemyGroup,0)
            this.inputText.text = '';
            this.timesText.text = '剩余次数:' + UM.getFriendPKTimes() + '/' + FriendManager.getInstance().maxPK
        }

        var data = this.data.content.from_list;
        var specialData:any = this.specialData = {};
        if(this.isAnswer && this.data.content.isequal)
        {
            specialData.isEqual = true;
        }
        else if(!this.isAnswer && this.ringRadio1.selected)
        {
            specialData.isEqual = true;
        }
        this.renewCardList();
        this.scroller.viewport.scrollV = 0;


        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewCardList);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewCardList);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewCardList);
    }

    private renewCardList(){
        var data = this.data.content.from_list;
        var specialData:any = this.specialData;
        PKManager.getInstance().sortMonster(data[0].list);
        PKManager.getInstance().sortMonster(data[1].list);
        //更新卡组1
        var chooseList1 = [];
        for(var i=0;i<data[0].list.length;i++)
        {
            var id = data[0].list[i]
            chooseList1.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList1
            });
        }
        this.myList0.dataProvider = new eui.ArrayCollection(chooseList1);

        //更新卡组2
        var chooseList2 = [];
        for(var i=0;i<data[1].list.length;i++)
        {
            var id = data[1].list[i]
            chooseList2.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList2
            });
        }
        this.myList1.dataProvider = new eui.ArrayCollection(chooseList2);
    }

    private onChoose1(){
        this.chooseIndex(0);
    }

    private onChoose2(){
        this.chooseIndex(1);
    }

    private chooseIndex(index){
        var FPKM = FriendPKManager.getInstance();
        var isEqual = this.specialData.isEqual
        if(this.isAnswer)
        {
            FPKM.logid = this.data.id;
            PKDressUI.getInstance().show({pktype:'friend_answer',data:this.data.content.from_list,isEqual:isEqual,index:index})
        }
        else
        {
            if(BadWordsFilter.validateWords(this.inputText.text || ''))
            {
                Alert('挑战宣言中含有非法字符')
                return
            }
            FPKM.otherid = this.data.otherid;
            FPKM.othernick = this.data.othernick;
            FPKM.otherhead = this.data.otherhead;
            FPKM.isequal = isEqual;
            FPKM.talk = this.inputText.text;

            PKDressUI.getInstance().show({pktype:'friend_ask',data:this.data.content.from_list,isEqual:isEqual,index:index})
        }

    }
}