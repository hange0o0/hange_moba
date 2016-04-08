class CollectItemInfo extends game.BaseWindow {
    private static instance:CollectItemInfo;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectItemInfo();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "RegisterUISkin";
    }

    private joinBtn: eui.Button;
    private moreBtn: eui.Button;
    private splitBtn: eui.Button;
    private lockBtn: eui.Button;
    private itemMC: CollectItem;
    private slider: eui.Button;


    private openType

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onClick);
        this.addBtnEvent(this.backBtn, this.hide);
    }

    public show(v?){
        this.openType = v;
        super.show();
    }

    public onShow(){
        if(this.openType)//转正
        {
            this.titleText.text = '账号转正'
        }
        else
        {
            this.titleText.text = '注册账号'
        }
    }

    private onClick(){

    }
}