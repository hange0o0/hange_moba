class VideoUI2 extends game.BaseUI {
    private static instance:VideoUI2;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoUI2();
        return this.instance;
    }


    public constructor() {
        super();
        this.skinName = "VideoUI2Skin";
    }


    public childrenCreated() {
        super.childrenCreated();

        //this.addBtnEvent(this.jumpBtn, this.onClose)
        //this.topUI.addEventListener('hide',this.onClose,this);
    }

    public show(){

    }

    public onShow(){

    }
}