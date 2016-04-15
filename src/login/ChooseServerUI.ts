class ChooseServerUI extends game.BaseUI {
    private static instance:ChooseServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ChooseServerUI();
        return this.instance;
    }

    private list1;
    private list2;


    private serverid;
    private type;

    public constructor() {
        super();
        this.skinName = "ChooseServerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
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
        this.hide();
        if(this.type == 1)
            LoginServerUI.getInstance().renewServer(this.list1.selectedItem.id)
        else
            LoginServerUI.getInstance().renewServer(this.list2.selectedItem.id)
    }

    public show(v?){
        this.serverid = v;
        super.show();
    }

    public onShow(){
        var oo = LoginManager.getInstance().getAllServer();
        var my = oo.my;
        var other = oo.other;

        var selectIndex = -1;
        this.type = 1;
        for(var i=0;i<my.length;i++)
        {
            if(my[i].id == this.serverid)
            {
                selectIndex = i
            }
        }

        if(selectIndex == -1)
        {
            this.type = 2;
            for(var i=0;i<other.length;i++)
            {
                if(other[i].id == this.serverid)
                {
                    selectIndex = i
                }
            }
        }


    }
}