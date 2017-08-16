class GuessUI extends game.BaseWindow {
    private static instance:GuessUI;
    public static getInstance() {
        if (!this.instance) this.instance = new GuessUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "GuessUISkin";
    }

    private teamInfo1: eui.List;
    private teamInfo2: eui.List;
    private bg1: eui.Rect;
    private cb: eui.RadioButton;
    private coinText: eui.Label;
    private h1: eui.HSlider;
    private addBtn: eui.Group;
    private reduceBtn: eui.Group;
    private bg0: eui.Rect;
    private cb0: eui.RadioButton;
    private h0: eui.HSlider;
    private cardText: eui.Label;
    private addBtn0: eui.Group;
    private reduceBtn0: eui.Group;
    private team1Btn: eui.Button;
    private backBtn: eui.Button;
    private team2Btn: eui.Button;
    private desText: eui.Label;
    private helpBtn: eui.Group;
    private videoBtn: eui.Group;












    private data

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('胜负竞猜');


        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.team1Btn, this.onTeam1);
        this.addBtnEvent(this.team2Btn, this.onTeam2);
        this.addBtnEvent(this.videoBtn, this.onVideo);
        this.addBtnEvent(this.helpBtn, this.onHelp);


        this.addBtnEvent(this.addBtn, this.onAdd);
        this.addBtnEvent(this.addBtn0, this.onAdd0);
        this.addBtnEvent(this.reduceBtn, this.onReduce);
        this.addBtnEvent(this.reduceBtn0, this.onReduce0);

        this.teamInfo1.itemRenderer  = PKResultItem3
        this.teamInfo2.itemRenderer  = PKResultItem3

        this.cb.group.addEventListener(eui.UIEvent.CHANGE,this.onRChange,this);
        this.cb.selected = true

        this.h1.addEventListener(egret.Event.CHANGE,this.renewCoin,this)
        this.h0.addEventListener(egret.Event.CHANGE,this.renewCard,this)
    }

    private onAdd(){
        if(this.h1.value < this.h1.maximum)
        {
            this.h1.value ++;
            this.renewCoin();
        }
    }
    private onAdd0(){
        if(this.h0.value < this.h0.maximum)
        {
            this.h0.value ++;
            this.renewCard();
        }
    }
    private onReduce(){
        if(this.h1.value > this.h1.minimum)
        {
            this.h1.value --;
            this.renewCoin();
        }
    }
    private onReduce0(){
        if(this.h0.value > this.h0.minimum)
        {
            this.h0.value --;
            this.renewCard();
        }
    }

    private onVideo(){
        GuessLogUI.getInstance().show();
    }
    private onHelp(){
        HelpManager.getInstance().guessHelp();
    }

    private renewCoin(){
        this.coinText.text = '金币 ×' + this.h1.value + ''
        this.onRChange();
    }

    private renewCard(){
        this.cardText.text = '碎片 ×' + this.h0.value + '';
        this.onRChange();
    }

    private onTeam1(){
         if(!this.testResource())
            return;
        this.guess(true)
    }

    private onTeam2(){
        if(!this.testResource())
            return;
        this.guess(false)
    }

    private guess(win){
        var type = this.cb.selected?'coin':'card'
        var num = this.cb.selected?this.h1.value:this.h0.value
        if(this.cb.selected)
            SharedObjectManager.instance.setMyValue('guess_coin',this.h1.value)
        else
            SharedObjectManager.instance.setMyValue('guess_card',this.h0.value)
        var self = this;
        GuessManager.getInstance().guess(type,num,win,function(){
           self.hide();
        })
    }

    private testResource(){
        if(this.cb.selected)
        {
             return UM.testCoin(this.h1.value)
        }
        else
        {
            return UM.testCard(this.h0.value)
        }
    }

    private onRChange(){
        MyTool.changeGray(this.h0,this.cb.selected,true)
        MyTool.changeGray(this.addBtn0,this.cb.selected || !(this.h0.value < this.h0.maximum),true)
        MyTool.changeGray(this.reduceBtn0,this.cb.selected || !(this.h0.value > this.h0.minimum),true)
        MyTool.changeGray(this.h1,!this.cb.selected,true)
        MyTool.changeGray(this.addBtn,!this.cb.selected || !(this.h1.value < this.h1.maximum),true)
        MyTool.changeGray(this.reduceBtn,!this.cb.selected || !(this.h1.value > this.h1.minimum),true)

        this.bg0.visible = !this.cb.selected
        this.bg1.visible = this.cb.selected

        if(this.cb.selected)
        {
            this.coinText.textColor = 0xE0A44A
            this.cardText.textColor = 0xCCB48E
        }
        else
        {
            this.coinText.textColor = 0xCCB48E
            this.cardText.textColor = 0xE0A44A
        }

    }





    public show(){
        GuessManager.getInstance().getGuess(()=>{
            super.show();
        })

    }

    public onShow(){

        var GM = GuessManager.getInstance();
        GM.passDay();
        var guessData = UM.active.guess || {};
        var current = guessData.num || 0;
        var max = GM.getMaxTimes();

        MyTool.setColorText(this.desText,'答对后获得[双倍]返还 ('+(max - current)+'/'+max+')')




        this.h1.maximum = Math.floor(Math.pow(UM.level,1.5)) * 100
        this.h1.minimum = Math.max(10,this.h1.maximum /100)
        this.h1.value = SharedObjectManager.instance.getMyValue('guess_coin') || this.h1.minimum;

        this.h0.maximum = Math.floor(Math.pow(UM.level,1.5)) * 5
        this.h0.minimum = Math.max(1,Math.floor(this.h0.maximum /100))
        this.h0.value = SharedObjectManager.instance.getMyValue('guess_card') || this.h0.minimum;

        var specialData = {isEqual:true}
        var list = UM.active.guess.list1
        var list1 = []
        for(var i=0;i<list.length;i++)
        {
            var mid = list[i]
            var oo = {
                id:mid,
                list:list1,
                specialData:specialData,
                index:i,
            }
            list1.push(oo)
        }

        list = UM.active.guess.list2
        var list2 = []
        for(var i=0;i<list.length;i++)
        {
            var mid = list[i]
            var oo = {
                id:mid,
                list:list2,
                specialData:specialData,
                index:i,
            }
            list2.push(oo)
        }

        this.teamInfo1.dataProvider = new eui.ArrayCollection(list1)
        this.teamInfo2.dataProvider = new eui.ArrayCollection(list2)

        this.renewCoin()
        this.renewCard()
        this.onRChange();
    }
}