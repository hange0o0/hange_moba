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
    private scrollGroup: eui.Group;
    private p0: MainPageItem;
    private p1: MainPageItem;
    private p2: MainPageItem;
    private p3: MainPageItem;
    private p4: MainPageItem;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.headMC, this.onHead);
        this.addBtnEvent(this.diamondText, this.onDiamondAdd);
        this.addBtnEvent(this.forceText, this.onForce);
        this.addBtnEvent(this.energyText, this.onEnergyAdd);



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
    }

    private onHead(){

    }
    private onDiamondAdd(){

    }
    private onForce(){

    }
    private onEnergyAdd(){

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
        //this.expBar.maximum = UM.next_exp
        //this.expBar.value = Math.min(UM.exp,UM.next_exp);
        this.levelText.text = UM.level + '';
    }
    public renewEnergy(){
        UM.getEnergy();
        this.energyText.text = UM.energy.v + '+' + UM.energy.rmb;
    }
}