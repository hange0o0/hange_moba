class SettingUI extends game.BaseWindow {
    private static instance:SettingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new SettingUI();
        return this.instance;
    }


    private musicCB: eui.CheckBox;
    private friendCB: eui.CheckBox;
    private soundCB: eui.CheckBox;
    private modeCB: eui.CheckBox;
    private PKCB: eui.CheckBox;
    private loginBtn: eui.Button;
    private closeBtn: eui.Button;
    private idText: eui.Label;
    private versionText: eui.Label;
    private logBtn: eui.Label;
    private qqText: eui.Label;
    private emailText: eui.Label;









    public constructor() {
        super();
        this.skinName = "SettingSkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('设置')
        this.addBtnEvent(this.musicCB,this.onMusic);
        this.addBtnEvent(this.soundCB,this.onSound);
        this.addBtnEvent(this.friendCB,this.onFriend);
        this.addBtnEvent(this.modeCB,this.onMode);
        this.addBtnEvent(this.PKCB,this.onPK);
        this.addBtnEvent(this.closeBtn,this.hide);
        this.addBtnEvent(this.loginBtn,this.onLoginOut);
        this.addBtnEvent(this.logBtn,this.onLog);
        //this.addBtnEvent(this.qqBtn,this.onQQ);

        //this.addBtnEvent(this.okBtn, this.onChoose);
    }

    private onMode(){
          var oldMode = SharedObjectManager.instance.getValue("renderMode") || 'webgl'
        if(oldMode == 'webgl')
            var str = '切换成兼容模式，会对游戏性能有一些影响，是否继续'
        else
            var str = '停用兼容模式后，游戏在部分机型上可能会出现异常，是否继续'
        Confirm(str,function(value){
            if(value == 1)
            {
                SharedObjectManager.instance.setValue("renderMode",oldMode=='webgl'?'canvas':'webgl')
                MyTool.refresh();
            }
        },['取消','继续'])
    }

    private onLog(){
        GameLogUI.getInstance().show();
    }

    private onLoginOut(){
        //PopUpManager.showToMain();
        LoginServerUI.getInstance().show();
        PopUpManager.movieChange(MainPageUI.getInstance(),LoginServerUI.getInstance(),-1)
    }

    private onMusic(){
        SoundManager.getInstance().bgPlaying = this.musicCB.selected
    }

    private onSound(){
        SoundManager.getInstance().soundPlaying = this.soundCB.selected
    }

    private onFriend(){
        FriendManager.getInstance().stop(this.friendCB.selected);
    }

    private onPK(){
        PKManager.getInstance().pkJump = !PKManager.getInstance().pkJump;
        SharedObjectManager.instance.setMyValue("pkJump",PKManager.getInstance().pkJump)
    }

    private onQQ(){
        //如遇到BUG或有好的建议，可发送邮件至：1624431545@qq.com
        //游戏官方QQ群：1624431545
    }

    public onShow(){
        this.currentState = FromManager.getInstance().h5Form?'h5':'normal'
        this.PKCB.visible = Config.isDebug || UM.isVip(203);//5级才有跳过功能
        this.musicCB.selected = SoundManager.getInstance().bgPlaying
        this.soundCB.selected = SoundManager.getInstance().soundPlaying
        this.friendCB.selected = UM.friends.stop;
        this.modeCB.selected = SharedObjectManager.instance.getValue("renderMode") == 'canvas';
        this.PKCB.selected = PKManager.getInstance().pkJump;
        this.idText.textFlow = <Array<egret.ITextElement>>[
            {text: UM.gameid + "", style: {"underline": true}}
        ];
        if(FromManager.getInstance().isQunHei)          //群号 246970435
        {
            this.qqText.textFlow = <Array<egret.ITextElement>>[
                {text: "246970435", style: {"underline": true}}
            ];
        }
        else
        {
            this.qqText.textFlow = <Array<egret.ITextElement>>[
                {text: "347331204", style: {"underline": true}}
            ];
        }


        this.emailText.textFlow = <Array<egret.ITextElement>>[
            {text: "1624431545@qq.com", style: {"underline": true}}
        ];
        this.versionText.textFlow = <Array<egret.ITextElement>>[
            {text: '1.' + Config.version + '.' + Config.m_version, style: {"underline": true}}
        ];

        this.logBtn.visible = LoginManager.getInstance().logText.text;
        if(FromManager.getInstance().h5Form)
            MyTool.removeMC(this.loginBtn)
    }


}