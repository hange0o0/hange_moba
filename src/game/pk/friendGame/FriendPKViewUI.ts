class FriendPKViewUI extends game.BaseUI {
    private static instance:FriendPKViewUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendPKViewUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup0: eui.Group;
    private pkTypeText: eui.Label;
    private myGroup0: eui.Group;
    private bg0: eui.Group;
    private myList0: eui.List;
    private ringText0: eui.Label;
    private ringText1: eui.Label;
    private myGroup1: eui.Group;
    private bg1: eui.Group;
    private myList1: eui.List;
    private ringText2: eui.Label;
    private ringText3: eui.Label;
    private myChooseGroup: eui.Group;
    private myList2: eui.List;
    private chooseMC: eui.Image;




    private data;
    private isAnswer;
    private specialData;
    public constructor() {
        super();
        this.skinName = "FriendPKViewUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.addEventListener('hide',this.hide,this);
        //this.addBtnEvent(this, this.onClick);

        //this.inputText.addEventListener(egret.Event.CHANGE,this.onTextChange)
    }

    private onClick(){

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
        }

        var data = this.data.content.from_list;
        var specialData:any = this.specialData = {};
        if(this.isAnswer && this.data.content.isequal)
        {
            specialData.isEqual = true;
        }
        //更新卡组1
        var chooseList1 = [];
        for(var i=0;i<data.choose[0].list.length;i++)
        {
            var id = data.choose[0].list[i]
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
        this.ringText0.text = RingVO.getObject(data.choose[0].ring[0]).name
        this.ringText1.text = RingVO.getObject(data.choose[0].ring[1]).name


        //更新卡组2
        var chooseList2 = [];
        for(var i=0;i<data.choose[1].list.length;i++)
        {
            var id = data.choose[1].list[i]
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
        this.ringText2.text = RingVO.getObject(data.choose[1].ring[0]).name
        this.ringText3.text = RingVO.getObject(data.choose[1].ring[1]).name
    }
}