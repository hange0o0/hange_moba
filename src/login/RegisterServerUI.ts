class RegisterServerUI extends game.BaseWindow {
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

        this.nameText.restrict = "a-zA-Z0-9_\u0391-\uFFE5";
        this.nameText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);



    }

    private onChange(){
        this.nameText.text = MyTool.replaceEmoji(this.nameText.text);
        var len = StringUtil.getStringLength(this.nameText.text);
        if(len > 14)
        {
            this.nameText.text = StringUtil.getStringByLength(this.nameText.text,7);
        }
    }

    public show(serverID?){
        this.serverID = serverID;
        super.show();
    }

    public onShow(){
        this.chooseHead = false;
        this.onRandom();
        if(FromManager.getInstance().h5Form)
        {
            var nick = FromManager.getInstance().getDefaultNick()
            if(nick)
                this.nameText.text = nick;
            MyTool.removeMC(this.backBtn);
        }


        //if(Config.platform == 'egret' && EgretManager.getInstance().nickName)
        //{
        //    this.nameText.text = EgretManager.getInstance().nickName;
        //}
    }

    private onClick(){
        var LM = LoginManager.getInstance();
        if(!this.nameText.text || this.nameText.text == '神秘人' || BadWordsFilter.validateName(this.nameText.text))
        {
            Alert('名字中含有非法字符');
            return;
        }

        LM.registerServer(this.nameText.text,this.headID,this.serverID);
    }
    private onRandom(){
        if(!this.chooseHead)
        {
            var arr = MonsterVO.getListByLevel(1);
            this.headID = ArrayUtil.randomOne(arr).id;
            this.renewHead();
        }
        this.nameText.text = MyTool.randomName();
    }

    private renewHead(){
        this.headMC.source =MyTool.getHeadUrl(this.headID);
    }

    private onHeadClick(){
        var self = this;
         ChangeHeadUI.getInstance().show(this.headID,true,function(id){
             self.headID = id;
             self.chooseHead = true;
             self.renewHead();
             ChangeHeadUI.getInstance().hide();
         });
    }
}