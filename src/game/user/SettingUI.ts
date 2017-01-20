class SettingUI extends game.BaseWindow {
    private static instance:SettingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new SettingUI();
        return this.instance;
    }


    private musicCB: eui.CheckBox;
    private soundCB: eui.CheckBox;
    private closeBtn: eui.Button;
    private idText: eui.Label;
    private qqText: eui.Label;
    private emailText: eui.Label;




    public constructor() {
        super();
        this.skinName = "SettingSkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.musicCB,this.onMusic);
        this.addBtnEvent(this.soundCB,this.onSound);
        this.addBtnEvent(this.closeBtn,this.hide);
        //this.addBtnEvent(this.qqBtn,this.onQQ);

        //this.addBtnEvent(this.okBtn, this.onChoose);
    }

    private onMusic(){
        SoundManager.getInstance().bgPlaying = this.musicCB.selected
    }

    private onSound(){
        SoundManager.getInstance().soundPlaying = this.soundCB.selected
    }

    private onQQ(){
        //如遇到BUG或有好的建议，可发送邮件至：1624431545@qq.com
        //游戏官方QQ群：1624431545
    }

    public onShow(){
        this.musicCB.selected = SoundManager.getInstance().bgPlaying
        this.soundCB.selected = SoundManager.getInstance().soundPlaying
        this.idText.textFlow = <Array<egret.ITextElement>>[
            {text: UM.gameid + "", style: {"underline": true}}
        ];
        this.qqText.textFlow = <Array<egret.ITextElement>>[
            {text: "1624431545", style: {"underline": true}}
        ];
        this.emailText.textFlow = <Array<egret.ITextElement>>[
            {text: "1624431545@qq.com", style: {"underline": true}}
        ];
        //this.idText.text = UM.gameid;
    }


}