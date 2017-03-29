class MonsterSendStarUI extends game.BaseWindow {
    private static instance:MonsterSendStarUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterSendStarUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MonsterSendStarSkin";
    }

    private titleText: eui.Label;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private starText: eui.Label;
    private cancelBtn: eui.Button;
    private sendBtn: eui.Button;



    private monsterID
    private star

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.sendBtn, this.onSend);

        for(var i=0;i<5;i++)
        {
            this['s' + i].star = i+1
            this.addBtnEvent(this['s' + i],this.changeStar);
        }

    }

    private changeStar(e){
        this.star = e.target.star;
        this.renewStar();
    }



    private onSend(){
        var self = this;
        MonsterManager.getInstance().sendStar(this.monsterID,this.star,function(){
            self.hide();
            MonsterTalkUI.getInstance().onSetStar()
        })
    }

    public show(data?){
        this.monsterID = data;
        super.show();
    }

    public onShow(){
        var vo = MonsterVO.getObject(this.monsterID);
        this.titleText.text = '请输入你对' + vo.name + '的评星'
        this.star = 3;
        this.renewStar();
    }

    private renewStar(){
        this.starText.text  =  this.star + '星'
        for(var i=0;i<5;i++)
        {
            if(i<this.star)
                this['s' + i].filters = null;
            else
                MyTool.changeGray(this['s' + i]);
        }
    }
}