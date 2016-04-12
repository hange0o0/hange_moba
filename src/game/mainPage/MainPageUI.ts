class MainPageUI extends game.BaseUI {
    private static instance:MainPageUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainPageUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MainPageUISkin";
    }


    private headMC: eui.Image;
    private expBar: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.BitmapLabel;
    private coinText: eui.Label;
    private energyText: eui.Label;
    private diamondText: eui.Label;
    private feeText: eui.Label;
    private levelText: eui.Label;
    private taskGroup: eui.Group;
    private taskText: eui.Label;
    private videoBtn: eui.Group;
    private rankBtn: eui.Group;
    private friendBtn: eui.Group;
    private collectBtn: eui.Group;
    private honorBtn: eui.Group;
    private tecBtn: eui.Group;
    private bagBtn: eui.Group;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private scroller: eui.Scroller;
    private scrollGroupCon: eui.Group;
    private scrollGroup: eui.Group;
    private mainGame: MainMainItem;
    private serverGame: MainServerItem;
    private serverGameEqual: MainServerEqualItem;
    private p0: MainPageItem;
    private p1: MainPageItem;
    private p2: MainPageItem;




    private pageArray = [];
    private currentPage= 0;
    private startPos;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.headMC, this.onHead);
        this.addBtnEvent(this.diamondText, this.onDiamondAdd);
        this.addBtnEvent(this.forceText, this.onForce);
        this.addBtnEvent(this.energyText, this.onEnergyAdd);

        this.addBtnEvent(this.leftBtn, this.onLeft);
        this.addBtnEvent(this.rightBtn, this.onRight);



        this.addBtnEvent(this.friendBtn, this.onFriend);
        this.addBtnEvent(this.collectBtn, this.onCollect);
        this.addBtnEvent(this.bagBtn, this.onBag);
        this.addBtnEvent(this.honorBtn, this.onHonor);
        this.addBtnEvent(this.rankBtn, this.onRank);
        this.addBtnEvent(this.tecBtn, this.onTec);


        //this.addBtnEvent(this.img, this.onMain);
        //this.addBtnEvent(this.img, this.onServer);
        //this.addBtnEvent(this.img, this.onServerEqual);
        //this.addBtnEvent(this.img, this.onDay);

        EM.addEvent(GameEvent.client.coin_change,this.renewCoin,this);
        EM.addEvent(GameEvent.client.diamond_change,this.renewDiamond,this);
        EM.addEvent(GameEvent.client.force_change,this.renewForce,this);
        EM.addEvent(GameEvent.client.exp_change,this.renewExp,this);
        EM.addEvent(GameEvent.client.level_change,this.renewExp,this);
        EM.addEvent(GameEvent.client.energy_change,this.renewEnergy,this);
        EM.addEvent(GameEvent.client.task_change,this.renewTask,this);

        for(var i=0;i<=2;i++)
        {
              this.pageArray.push(this['p'+i]);
        }


        //this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,true)

    }

    private onBegin(e:egret.TouchEvent){
        if(this.scroller.viewport.contentHeight > this.scroller.viewport.height)//有垂直滚动
        {
            return;
        }

        this.scrollGroup.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)

        this.startPos = {x:e.stageX,tx:this.scrollGroup.x};

    }

    private onMove(e:egret.TouchEvent){
        if(!this.startPos.drag)
        {
            if(Math.abs(e.stageX - this.startPos.x) > 10)
            {
                this.startPos.drag = true;
            }
        }
        if(this.startPos.drag)
        {
            this.scrollGroup.x = this.startPos.tx + e.stageX-this.startPos.x;
        }
    }

    private onEnd(e:egret.TouchEvent){
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
        if(Math.abs(this.scrollGroup.x - this.startPos.tx) > 150)//可翻页
        {
            if(this.scrollGroup.x > this.startPos.tx)//右移
            {
                this.onLeft();
            }
            else
            {
                this.onRight();
            }

        }
        else
        {
            this.scrollToCurrentPage();
        }

    }

    //滚动后防止按钮事件被触发
    private onTouchTap(e:egret.TouchEvent){
        if(this.startPos && this.startPos.drag)
        {
            e.stopPropagation();
        }
    }



    private onHead(){
         MyInfoUI.getInstance().show();
    }
    private onDiamondAdd(){

    }
    private onForce(){

    }
    private onEnergyAdd(){

    }
    private onLeft(){
        if(this.currentPage > 0)
            this.currentPage --;
        this.scrollToCurrentPage();
    }
    private onRight(){
        if(this.currentPage < this.pageArray.length - 1)
            this.currentPage ++;
        this.scrollToCurrentPage();
    }


    private onFriend(){
        FriendListUI.getInstance().show();
    }
    private onCollect(){
        CollectUI.getInstance().show();
    }
    private onBag(){
        BagUI.getInstance().show();

    }
    private onHonor(){
        HonorUI.getInstance().show();

    }
    private onRank(){
        RankUI.getInstance().show();

    }
    private onTec(){
        TecUI.getInstance().show();

    }


    private onMain(){
        MainGameUI.getInstance().show();

    }
    private onServer(){
        ServerGameUI.getInstance().show();

    }
    private onServerEqual(){
        ServerGameEqualUI.getInstance().show();

    }
    private onDay(){
        DayGameUI.getInstance().show();

    }

    public onShow(){
        this.renewTop();

        this.renewTask();
        this.renewPage();
        this.scrollToCurrentPage();

        this.renewMiddle();
    }

    public renewMiddle(){
        //this.scrollGroup.removeChildren();
        //this.scrollGroup.addChild(this.img);
        //if(true)
        //{
        //    this.scrollGroup.addChild(this.img);
        //}
    }


    public renewTop(){
        this.renewDiamond();
        this.renewForce();
        this.renewCoin();
        this.renewExp();
        this.renewEnergy();

        this.nameText.text = UM.nick;
        this.headMC.source = UM.head;
    }
    public renewDiamond(){
        this.diamondText.text = UM.diamond.free + '';
        this.feeText.text = UM.diamond.rmb + '';
    }
    public renewForce(){
        this.forceText.text = UM.getForce() + '';
    }
    public renewCoin(){
        this.coinText.text = NumberUtil.addNumSeparator(UM.coin);
    }
    public renewExp(){
        this.expBar.scrollRect = new egret.Rectangle(0,0,Math.min(UM.exp/UM.next_exp,1)*640,6)
        this.levelText.text = UM.level + '';
    }
    public renewEnergy(){
        UM.getEnergy();
        this.energyText.text = UM.energy.v + '+' + UM.energy.rmb;
    }

    public renewTask(){
        var task = UM.active.task;
        if(task.doing)
        {
            this.taskGroup.visible = true;
            var type = '修正场PK'
            if(task.type == 'server_game')
                type = '竞技场PK';
            this.taskText.text = '任务：在'+task.targettotal+'场'+type+'中取得'+task.targetwin+'场胜利【战力+'+task.award+'】（'+task.win+'/'+task.total+'）';
        }
        else
        {
            this.taskGroup.visible = false;
        }
    }

    public renewPage(){
        if(this.currentPage == 0)
            this.leftBtn.alpha = 0.5;
        else
            this.leftBtn.alpha = 1;

        if(this.currentPage == this.pageArray.length - 1)
            this.rightBtn.alpha = 0.5;
        else
            this.rightBtn.alpha = 1;

        for(var i=0;i<this.pageArray.length;i++)
        {
            this.pageArray[i].data = this.currentPage == i;
        }
    }

    public scrollToCurrentPage(nomovie=false){
        egret.Tween.removeTweens(this.scrollGroup)
        var targetX = -this.currentPage * 500;
        this.scroller.viewport.scrollV = 0;
        if(nomovie)
        {
            this.scrollGroup.x = targetX;
        }
        else if(this.scrollGroup.x != targetX)
        {
            var tw:egret.Tween = egret.Tween.get(this.scrollGroup);
            tw.to({x:targetX}, Math.min(200,200*Math.abs(targetX-this.scrollGroup.x)/500));
        }

        switch(this.currentPage)
        {
            case 0:
                this.mainGame.renew();
                this.videoBtn.visible = UM.main_game.pkdata;
                break;
            case 1:
                this.serverGame.renew();
                this.videoBtn.visible = UM.server_game.pkdata;
                break;
            case 2:
                this.serverGameEqual.renew();
                this.videoBtn.visible = UM.server_game_equal.pkdata;
                break;
        }
    }


}