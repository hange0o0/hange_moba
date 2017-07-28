class TipsUI extends game.BaseContainer{
	private static instance:TipsUI;
	public static getInstance() {
		if (!this.instance) this.instance = new TipsUI();
		return this.instance;
	}

    private text: eui.Label;

	private timer;

	public constructor() {
		super();
		this.skinName = 'TipsUISkin';
	}

	public show(v?,cd?){
		egret.clearTimeout(this.timer);


		//this.verticalCenter = 0;
		GameManager.stage.addChild(this);
		this.setHtml(this.text,v);
		if(this.text.numLines > 1)
			this.text.textAlign = 'left'
		this.timer = egret.setTimeout(this.onTimer,this,cd);

		this.validateNow();
		this.x =  (GameManager.stage.stageWidth -this.width)/2
		this.y =  GameManager.stage.stageHeight * 0.1;
	}

	private onTimer(){
		this.hide();
	}

	public hide(){
		egret.clearTimeout(this.timer);
		MyTool.removeMC(this);
		PopUpManager.testShape();
	}


}
