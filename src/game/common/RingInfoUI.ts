class RingInfoUI extends game.BaseWindow {
    private static instance:RingInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RingInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "RingInfoUISkin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;
    private titleText: eui.Label;
    private desText: eui.Label;
    private levelText: eui.Label;



    private data
    private isEqual

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);
    }

    public show(data?,isEqual?){
        this.data = data;
        this.isEqual = isEqual;
        super.show();
    }

    public onShow(){
        var vo = RingVO.getObject(this.data);
        this.titleText.text = '' + vo.name
        var level = 10
        if(!this.isEqual)
        {
            level =  UM.getRingLevel(vo.id)
        }


        this.desText.text = '' + vo.getDes(level)
        //this.levelText.text = '' + level;

        this.headMC.source = vo.thumb;
    }
}