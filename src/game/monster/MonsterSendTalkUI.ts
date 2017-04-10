class MonsterSendTalkUI extends game.BaseWindow {
    private static instance:MonsterSendTalkUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterSendTalkUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MonsterSendTalkSkin";
    }

    private titleText: eui.Label;
    private editText: eui.EditableText;
    private cancelBtn: eui.Button;
    private sendBtn: eui.Button;




    private monsterID

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.sendBtn, this.onSend);
        this.editText.restrict = "^\\\\\"\'"

        this.editText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);
    }

    private onChange(){
        var len = StringUtil.getStringLength(this.editText.text);
        this.editText.text = MyTool.replaceEmoji(this.editText.text);
        if(len > 1000)
        {
            len = 1000;
            this.editText.text = StringUtil.getStringByLength(this.editText.text,500);
        }

    }

    private onSend(){
        var self = this;
        if(!this.editText.text)
        {
            Alert('没输入任何内容')
            return
        }
        if(BadWordsFilter.validateWords(this.editText.text))
        {
            Alert('文字中含有非法字符')
            return
        }
        if(!UM.testEnergy(1))
        {
            return;
        }
        MonsterManager.getInstance().sendTalk(this.monsterID,this.editText.text,function(){
            self.hide();
            MonsterTalkUI.getInstance().renewTalk();
        })
    }

    public show(data?){
        this.monsterID = data;
        super.show();
    }

    public onShow(){
        var vo = MonsterVO.getObject(this.monsterID);
        this.titleText.text = '请输入你对' + vo.name + '的评论'
        this.editText.text = '';
        //this.editText.setFocus();


    }
}