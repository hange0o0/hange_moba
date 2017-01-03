class ResourceUI extends game.BaseContainer {

    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private cardGroup: eui.Group;
    private feeText: eui.Label;
    private energyGroup: eui.Group;
    private energyText: eui.Label;
    private diamondGroup: eui.Group;
    private diamondText: eui.Label;


	public constructor() {
	    super();
	}

    public childrenCreated() {
        this.addBtnEvent(this.energyGroup,this.onEnergyClick);
        this.addBtnEvent(this.diamondGroup,this.onDiamondClick);
        this.addBtnEvent(this.coinGroup,this.onCoinClick);
        this.addBtnEvent(this.cardGroup,this.onCardClick);


        EM.addEvent(GameEvent.client.coin_change,this.renew,this);
        EM.addEvent(GameEvent.client.diamond_change,this.renew,this);
        EM.addEvent(GameEvent.client.energy_change,this.renew,this);
        EM.addEvent(GameEvent.client.card_change,this.renew,this);
    }

    private onEnergyClick(){
        ShopUI.getInstance().show('energy');
    }

    private onCoinClick(){
        ShopUI.getInstance().show('coin');

    }

    private onDiamondClick(){
        ShopUI.getInstance().show('diamond');

    }
    private onCardClick(){
        ShopUI.getInstance().show('card');

    }

    public renew(){
        if(!this.stage)
            return;
        this.energyText.text = '' + UM.getEnergy();
        this.diamondText.text = '' + UM.getDiamond();
        this.feeText.text = '' + UM.card;
        this.coinText.text = '' + UM.coin;
    }
}
