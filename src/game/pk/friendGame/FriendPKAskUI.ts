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
    private ringRadio0: eui.RadioButton;
    private ringRadio1: eui.RadioButton;
    private inputText: eui.TextInput;
    private enemyGroup0: eui.Group;
    private pkTypeText: eui.Label;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private ringText0: eui.Label;
    private ringText1: eui.Label;
    private chooseBtn0: eui.Button;
    private myGroup1: eui.Group;
    private myList1: eui.List;
    private ringText2: eui.Label;
    private ringText3: eui.Label;
    private chooseBtn1: eui.Button;



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
    }

    private onRadioChange(){
         if(this.ringRadio0.selected) //选中第一个
            this.specialData.isEqual = false;
        else
             this.specialData.isEqual = true;
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
        this.ringText0.text = RingVO.getObject(data[0].ring[0]).name
        this.ringText1.text = RingVO.getObject(data[0].ring[1]).name


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
        this.ringText2.text = RingVO.getObject(data[1].ring[0]).name
        this.ringText3.text = RingVO.getObject(data[1].ring[1]).name
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
            PKDressUI.getInstance().show({pktype:'friend_answer',data:this.data.content.from_list[index],isEqual:isEqual})
        }
        else
        {
            FPKM.otherid = this.data.otherid;
            FPKM.othernick = this.data.othernick;
            FPKM.isequal = isEqual;
            FPKM.talk = this.inputText.text;
            PKDressUI.getInstance().show({pktype:'friend_ask',data:this.data.content.from_list[index],isEqual:isEqual})
        }

    }
}