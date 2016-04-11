class CollectItemInfo extends game.BaseWindow {
    private static instance:CollectItemInfo;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectItemInfo();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectItemInfoSkin";
    }

    private itemMC: CollectItem;
    private titleText: eui.Label;
    private joinBtn: eui.Button;
    private splitBtn: eui.Button;
    private lockBtn: eui.Button;
    private closeBtn: eui.Button;
    private slider: eui.HSlider;
    private numText: eui.Label;
    private resultText: eui.Label;
    private addBtn: eui.Image;
    private decBtn: eui.Image;




    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.joinBtn, this.onJoin);
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.splitBtn, this.onSplit);
        this.addBtnEvent(this.lockBtn, this.onLock);
        this.addBtnEvent(this.itemMC, this.onMore);

        this.slider.addEventListener(egret.Event.CHANGE,this.onChange,this)
    }

    private onChange(){
        var now = CollectManager.getInstance().getCollectNum(this.data);
        this.numText.text = now + '/' + this.slider.maximum
        this.resultText.text = '分解后可获得元素：' + this.slider.value*CollectManager.getInstance().splitNum
    }

    private onJoin(){
        var self = this;
        CollectManager.getInstance().levelUp(this.data,function(){
            self.onShow();
        })
    }

    private onMore(){

    }

    private onSplit(){
        if(this.slider.value == 0)
            return;
        var self = this;
        var oo = {}
        oo[this.data] = this.slider.value;
        CollectManager.getInstance().split(oo,function(){
            self.onShow();
        })
    }

    private onLock(){
        var self = this;
        var isLock = CollectManager.getInstance().isLock(this.data);
        CollectManager.getInstance().lock(this.data,!isLock,function(){
            self.onShow();
        });
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        var CM = CollectManager.getInstance();
        this.itemMC.data = this.data;
        var vo = MonsterVO.getObject(this.data);
        var level = UM.getMonsterCollect(vo.id);

        var need = CM.getLevelUpNeed(level + 1);
        var now = CM.getCollectNum(vo.id);

        this.slider.maximum = now;
        this.slider.minimum = 0;
        this.slider.value = now;


        if(level < 4 && now>need){  //可升级
            this.joinBtn.visible = true;
        }
        else
        {
            this.joinBtn.visible = false;
        }

        if(CM.isLock(vo.id))
        {
              this.lockBtn.label = '解锁'
              this.lockBtn.skinName = 'Btn_d1Skin'
        }
        else
        {
              this.lockBtn.label = '锁定'
              this.lockBtn.skinName = 'Btn_b1Skin'
        }

        this.onChange()
    }

}