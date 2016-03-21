class RegisterServerUI extends game.BaseUI {
    private static instance:RegisterServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterServerUI();
        return this.instance;
    }

    private backBtn: eui.Button;
    private registerBtn: eui.Button;
    private nameText: eui.TextInput;
    private randomBtn: eui.Group;
    private headGroup: eui.Group;
    private headMC: eui.Image;

    private chooseHead = false;
    private headID = 0;
    private serverID = 0;

    public constructor() {
        super();
        this.skinName = "RegisterServerUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.registerBtn, this.onClick);
        this.addBtnEvent(this.randomBtn, this.onRandom);
        this.addBtnEvent(this.headGroup, this.onHeadClick);
    }

    public show(serverID?){
        this.serverID = serverID;
        super.show();
    }

    public onShow(){
        this.chooseHead = false;
        this.onRandom();
    }

    private onClick(){
        var LM = LoginManager.getInstance();
        if(!this.nameText.text || !BadWordsFilter.validateName(this.nameText.text))
        {
            Alert('名字中含有非法字符');
            return;
        }

        LM.registerServer(this.nameText.text,this.headID,this.serverID);
    }
    private onRandom(){
        if(!this.chooseHead)
        {
            this.headID = Math.floor(Math.random()*50);
            this.headMC.source = 'head_'+this.headID + '_jpg';
        }
        this.nameText.text = MyTool.randomName();
    }
    private onHeadClick(){

    }
}