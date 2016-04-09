class CollectDrawResultUI extends game.BaseWindow {
    private static instance:CollectDrawResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectDrawResultUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectDrawResultUISkin";
    }

    private itemMC: CollectItem;
    private okBtn: eui.Button;


    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.itemMC.data = this.data;
    }
}