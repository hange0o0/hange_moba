class PKJumpWindow extends game.BaseWindow {
    private static instance:PKJumpWindow;
    public static getInstance() {
        if (!this.instance) this.instance = new PKJumpWindow();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "PKJumpWindowSkin";
    }

    private numText: eui.Label;
    private cancleBtn: eui.Button;
    private okBtn: eui.Button;
    private cb: eui.CheckBox;
    private input: CommonNumInput;
    private buyBtn: eui.Button;


    private fun;
    public childrenCreated() {
        super.childrenCreated();

        this.setTitle('跳过确认',220)
        this.addBtnEvent(this.cancleBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onJump);
        this.addBtnEvent(this.buyBtn, this.onBuy);

        this.input.minNum = 20;
        this.input.maxNum = 1000;
        this.input.stepNum = 20;

    }

    private onBuy(){
        var self = this;
        var buyNum = Math.ceil(this.input.nowNum/20);
        var cost = 5 * buyNum;
        var times = 20 * buyNum;
        Confirm('确定消耗 '+MyTool.createHtml(cost,0xE0A44A)+' 钻石购买'+times+'次跳过机会吗？',function(v){
            if(v == 1)
            {
                if(!UM.testDiamond(cost))
                {
                    return;
                }
                PKManager.getInstance().buyPKJump(buyNum,function(){
                    self.renew();
                });
            }
        })
    }

    private onJump(){
        var self = this;
        if(!UM.pk_common.pk_jump || UM.pk_common.pk_jump < 0)
        {
            Alert('没有跳过次数了')
               return;
        }
        self.hide();
        self.fun();

        if(PKManager.getInstance().pkAward && PKManager.getInstance().pkAward.desArr)
            PKManager.getInstance().pkAward.desArr.push('剩余跳过次数：' + (UM.pk_common.pk_jump-1))

        PKManager.getInstance().PKJumpAction(function(){
             //无条件跳，只是发个信息给服务器同步一下
        });
    }



    public hide(){
        if(!this.stage)
            return;
        super.hide();
        if(this.cb.selected)
            SharedObjectManager.instance.setMyValue('pk_jump_time',TM.now())
        else
            SharedObjectManager.instance.setMyValue('pk_jump_time',0)
    }

    public show(v?){
        this.fun = v
        if(TM.now() - (SharedObjectManager.instance.getMyValue('pk_jump_time') || 0) < 24*3600)
        {
            if(UM.pk_common.pk_jump && UM.pk_common.pk_jump > 0)
            {
                this.onJump();
                return;
            }
        }
        super.show();
    }

    public onShow(){
        this.cb.selected = SharedObjectManager.instance.getMyValue('pk_jump_time');
        this.renew()



    }

    private renew(){
        this.numText.text = (UM.pk_common.pk_jump || 0) + '';
        this.input.nowNum = 20;
    }

}