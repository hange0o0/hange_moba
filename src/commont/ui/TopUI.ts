class TopUI extends game.BaseContainer {
    public constructor() {
        super();
    }

    private closeBtn: eui.Button;
    private titleText: eui.Label;


    public childrenCreated() {
        this.addBtnEvent(this.closeBtn,this.backBtnClick);
    }
    public setTitle(name:string):void{
        this.titleText.text = name;
    }
    private backBtnClick(event:egret.TouchEvent):void {
        this.dispatchEventWith("hide");
    }
}