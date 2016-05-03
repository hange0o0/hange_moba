class TypeInfoUI extends game.BaseWindow {
    private static instance:TypeInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TypeInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectDraw10ResultUISkin";
    }

    private okBtn: eui.Button;
    private list: eui.List;


    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);

        this.list.itemRenderer = CollectItem
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.list.dataProvider = new eui.ArrayCollection(this.data);
    }
}