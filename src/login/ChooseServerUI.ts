class ChooseServerUI extends game.BaseUI {
    private static instance:ChooseServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ChooseServerUI();
        return this.instance;
    }

    private okBtn: eui.Button;
    private scrollerGroup: eui.Group;
    private myGroup: eui.Group;
    private list1: eui.List;
    private otherGroup: eui.Group;
    private list2: eui.List;




    private serverid;
    private type;

    public constructor() {
        super();
        this.skinName = "ChooseServerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onClick);
        this.list1.itemRenderer = ChooseServerItem
        this.list2.itemRenderer = ChooseServerItem
        this.list1.addEventListener(egret.Event.CHANGE,this.onSelect1,this)
        this.list2.addEventListener(egret.Event.CHANGE,this.onSelect2,this)
    }

    private onSelect1(){
        this.type = 1;
        this.list2.selectedIndex = -1;
    }
    private onSelect2(){
        this.type = 2;
        this.list1.selectedIndex = -1;
    }
    private onClick(){

        if(this.type == 1)
            LoginServerUI.getInstance().renewServer(this.list1.selectedItem.serverid)
        else
            LoginServerUI.getInstance().renewServer(this.list2.selectedItem.serverid)
        this.hide();
    }

    public show(v?){
        this.serverid = v;
        super.show();
    }

    public beforeHide(){
        this.clearList([this.list1,this.list2])
    }


    public onShow(){
        var oo = LoginManager.getInstance().getAllServer();
        var my = oo.my;
        var other = oo.other;

        var selectIndex = -1;
        this.type = 1;
        for(var i=0;i<my.length;i++)
        {
            if(my[i].serverid == this.serverid)
            {
                selectIndex = i
                break;
            }
        }

        if(my.length == 0)
        {
            MyTool.removeMC(this.myGroup);
        }
        else
        {
            this.scrollerGroup.addChildAt(this.myGroup,0);
            this.list1.dataProvider = new eui.ArrayCollection(my);
            this.list1.selectedIndex  =  selectIndex;
        }

        if(other.length == 0)
        {
            MyTool.removeMC(this.otherGroup);
        }
        else
        {
            this.scrollerGroup.addChild(this.otherGroup);
            this.list2.dataProvider = new eui.ArrayCollection(other);
            this.list2.selectedIndex  =  -1;
        }



        if(selectIndex == -1)
        {
            this.type = 2;
            for(var i=0;i<other.length;i++)
            {
                if(other[i].serverid == this.serverid)
                {
                    selectIndex = i
                    this.list2.selectedIndex  =  selectIndex;
                    break;
                }
            }
        }
    }
}