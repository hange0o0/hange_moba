class TecUI extends game.BaseUI {
    private static instance:TecUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TecUI();
        return this.instance;
    }
    
    private infoGroup: eui.Group;
    private levelUpBtn: eui.Button;
    private coinText: eui.Label;
    private propGroup1: eui.Group;
    private propText1: eui.Label;
    private propMC1: eui.Image;
    private propGroup2: eui.Group;
    private propText2: eui.Label;
    private propMC2: eui.Image;
    private itemMC: TecItem;
    private desText: eui.Label;
    private tab1: eui.Button;
    private tab2: eui.Button;
    private tab3: eui.Button;
    private myCoinText: eui.Label;



    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}