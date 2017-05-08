class MapInfoUI extends game.BaseContainer {
    private static instance:MapInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapInfoUISkin";
    }

    private titleText: eui.Label;
    private forceText: eui.Label;
    private awardList: eui.List;
    private titleText2: eui.Label;
    private btnGroup: eui.Group;
    private sweepGroup: eui.Group;
    private sweepBtn: eui.Button;
    private sweepText: eui.Label;
    private pkBtn: eui.Button;
    private pkText: eui.Label;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private closeBtn: eui.Button;
    private emptyText: eui.Label;









    private level


    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.sweepBtn,this.onSweep)

        this.awardList.itemRenderer = AwardItem;
        this.bottom = 0;

    }

    public hide(){
        this.visible = false;
    }

    public show(v?){
        this.level = v;
        this.visible = true
        this.onShow();
    }

    private onPK(){
        var MM = MapManager.getInstance();
        var self = this;
        MM.getEnemy(this.level,function(){
            MapGameUI.getInstance().show();
            self.hide()
        })
    }
    private onSweep(){
        var MM = MapManager.getInstance();
        var times = 10 - MM.getSweepNum(this.level);
        if(!UM.testDiamond(times))
            return;
        var self = this;
        MM.sweep(this.level,function(){
            self.hide();
        })

    }

    public onShow(){
         this.renew();
    }

    private renew(){
        var MM = MapManager.getInstance();
        var begin = Math.ceil(Math.pow(this.level,2.2));
        var end = begin + Math.ceil(Math.pow(this.level,1.2));
        this.forceText.text = begin + ' - ' + end;
        this.titleText.text = '据点' + this.level;

        var barWidth = 360
        this.emptyText.visible = false
        this.btnGroup.visible = true
        if(this.level == MM.level)
        {
            this.rateText.text = ''+MM.step+'/10'
            this.barMC.width = barWidth * MM.step / 10;
            MyTool.removeMC(this.sweepGroup)
            this.titleText2.text = '清剿进度：'
            //this.desText.text = '每次挑战需消耗 1 点体力'
        }
        else
        {
            this.titleText2.text = '扫荡进度：'
            var times = MM.getSweepNum(this.level);
            if(times >= 10)
            {
                this.rateText.text = ''+10+'/10'
                this.barMC.width = barWidth;
                this.emptyText.visible = true
                this.btnGroup.visible = false
                //this.desText.text = ''
            }
            else
            {
                this.rateText.text = ''+times+'/10'
                this.barMC.width = barWidth*times/10;
                this.btnGroup.addChildAt(this.sweepGroup,0)
                times = 10 -times;
                this.sweepBtn.label = '扫荡 '+times+' 次';
                this.sweepText.text = '消耗 '+times+' 钻石'
            }
        }

        var arr = [];
        var exp = Math.ceil(20*(1+this.level/10));
        var g_exp = this.level * 2;
        arr.push({type:'g_exp',des:'×' + g_exp})
        arr.push({type:'exp',des:'×' + exp})
        this.awardList.dataProvider = new eui.ArrayCollection(arr);
    }
}