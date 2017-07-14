class PKDressSettingItem extends game.BaseItem {
    public constructor() {
        super();
        //this.skinName = "PKDressSettingItem";
    }

    private chooseGroup: eui.Group;
    private chooseGroupBG: eui.Image;
    private headMC: eui.Image;
    private desBG: eui.Image;
    private numGroup: eui.Group;
    private n0: eui.Image;
    private n1: eui.Image;
    private n2: eui.Image;
    private n3: eui.Image;
    private n4: eui.Image;
    private n5: eui.Image;
    private addBtn: eui.Group;
    private decBtn: eui.Group;












    public index;
    public setting:PKDressSettingUI;

    public childrenCreated() {
        this.addBtnEvent(this.chooseGroup,this.onClick);
        this.addBtnEvent(this.addBtn,this.onAdd);
        this.addBtnEvent(this.decBtn,this.onDec);
        this.chooseGroupBG.visible = false;
        this.numGroup.touchEnabled = this.numGroup.touchChildren = false;

    }

    protected onClick(){
        if(this.chooseGroupBG.visible)
            this.setting.renewChooseing(null);
        else
            this.setting.renewChooseing(this.data.mid);
    }

    protected onAdd(){
        this.setting.monsterSelect[this.data.mid]  = (this.setting.monsterSelect[this.data.mid] || 0) + 1
        this.setting.renew();
        GuideManager.getInstance().showGuide(PKDressUI.getInstance())
    }

    protected onDec(){
        this.setting.monsterSelect[this.data.mid]  = (this.setting.monsterSelect[this.data.mid] || 0) - 1
        this.setting.renew();
        GuideManager.getInstance().showGuide(PKDressUI.getInstance())
    }

    public setChooseing(mid){
        this.chooseGroupBG.visible = this.data.mid == mid;
    }

    //type == 1,显示基础
    //type == 2,在主线PK中，会杀
    public dataChanged() {
        this.setting = this.data.setting;
        var vo = MonsterVO.getObject(this.data.mid);

        var num = this.setting.monsterSelect[this.data.mid] || 0
        this.numGroup.removeChildren()
        if(num < 0)
        {
            this.headMC.source = vo.thumbGray
        }
        else
        {
            this.headMC.source = vo.thumb
            for(var i=0;i<num;i++)
            {
                this.numGroup.addChild(this['n' + i])
            }
        }

        this.desBG.visible = num > 0


        MyTool.changeGray(this.decBtn,num<0 || this.setting.getDisArr().length >= 7,true)


        var b = true
        var arr = this.setting.getPKArr();
        if(arr.length >= 6)
        {
            b = false
        }
        else
        {
            arr.push(this.data.mid)
            if(PKManager.getInstance().getCost(arr) > PKManager.PKCost)
            {
                b = false;
            }
        }
        MyTool.changeGray(this.addBtn,!b,true);
    }

}