class LeaderMainUI extends game.BaseUI {
    private static instance:LeaderMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderMainUI();
        return this.instance;
    }

    private studyUI: LeaderStudyUI;
    private drawUI: LeaderDrawMainUI;
    private skillUI: LeaderSkillMainUI;
    private tab: eui.TabBar;
    private topUI: TopUI;
    private helpBtn: eui.Group;



    public constructor() {
        super();
        this.skinName = "LeaderMainUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('军校系统')
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.helpBtn,this.onHelp)

        //this.tab.touchChildren = this.tab.touchEnabled = false;
        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
    }

    private onHelp(){
        if(this.tab.selectedIndex == 0)
            HelpManager.getInstance().leaderHelp();
        else if(this.tab.selectedIndex == 1)
            HelpManager.getInstance().leaderHelp();
    }

    private typeBarClick(){
        this.studyUI.hide();
        this.drawUI.hide();
        if(this.tab.selectedIndex == 0)
        {
            this.addChildAt(this.studyUI,0)
            this.studyUI.onShow()
            return;
        }
        if(this.tab.selectedIndex == 1)
        {
            this.addChildAt(this.drawUI,0)
            this.drawUI.onShow()
            return;
        }
        if(this.tab.selectedIndex == 2)
        {
            this.addChildAt(this.skillUI,0)
            this.skillUI.onShow()
            return;
        }
    }




    public beforeHide(){
        this.studyUI.hide();
        this.drawUI.hide();
        this.skillUI.hide();
    }


    public show(){
        if(UM.main_game.level < Config.leaderLevel)
        {
            Alert('需达到'+this.createHtml(MainGameManager.getInstance().getStepName(Config.leaderLevel),0xE0A44A)+'('+Config.leaderLevel+'分)才可进入')
            return;
        }

        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.typeBarClick()
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.prop_change,this.onPropChange)
    }

    private onPropChange(){
        if(this.studyUI.stage)
            this.studyUI.onTimer()
        else if(this.drawUI.stage)
            this.drawUI.onPropChange()
    }
    private onTimer(){
        if(this.studyUI.stage)
            this.studyUI.onTimer()
    }





}