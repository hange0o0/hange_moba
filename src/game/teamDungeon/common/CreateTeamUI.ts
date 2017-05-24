class CreateTeamUI extends game.BaseWindow {
    private static instance:CreateTeamUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CreateTeamUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "CreateTeamUISkin";
    }

    private titleText: eui.Label;
    private forceText: eui.Label;
    private levelText: eui.Label;
    private nameText: eui.TextInput;
    private randomBtn: eui.Group;
    private cancleBtn: eui.Button;
    private okBtn: eui.Button;
    private sortBtn: eui.Image;
    private sortText: eui.Label;
    private sortGroup: eui.Group;
    private sortList0: eui.List;





    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);

    }

    public hide(){
        super.hide();
        if(this.data)
            MyCardTaskUI.getInstance().testShow();
    }



    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){

    }
}