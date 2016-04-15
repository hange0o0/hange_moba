class ResourceUI extends game.BaseContainer {
    
    private energyText: eui.Label;
    private diamondText: eui.Label;
    private feeText: eui.Label;
    private coinText: eui.Label;

	public constructor() {
	    super();
	}

    public childrenCreated() {
        this.addBtnEvent(this.energyText,this.onEnergyClick);
        this.addBtnEvent(this.diamondText,this.onDiamondClick);
        this.addBtnEvent(this.coinText,this.onCoinClick);


        EM.addEvent(GameEvent.client.coin_change,this.renew,this);
        EM.addEvent(GameEvent.client.diamond_change,this.renew,this);
        EM.addEvent(GameEvent.client.energy_change,this.renew,this);
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

    public renew(){
        if(!this.stage)
            return;
        this.energyText.text = '' + UM.getEnergy();
        this.diamondText.text = '' + UM.diamond.rmb;
        this.feeText.text = '' + UM.diamond.free;
        this.coinText.text = '' + UM.coin;
    }
}
