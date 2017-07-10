class PKDressSettingItem extends game.BaseItem {
    public constructor() {
        super();
        //this.skinName = "PKDressSettingItem";
    }

    private chooseGroup: eui.Group;
    private chooseGroupBG: eui.Image;
    private headMC: eui.Image;
    private numText: eui.Label;
    private addBtn: eui.Group;
    private decBtn: eui.Group;










    public index;
    public setting:PKDressSettingUI;

    public childrenCreated() {
        this.addBtnEvent(this.chooseGroup,this.onClick);
        this.addBtnEvent(this.addBtn,this.onAdd);
        this.addBtnEvent(this.decBtn,this.onDec);
        this.chooseGroupBG.visible = false;

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
        this.headMC.source = vo.thumb
        var num = this.setting.monsterSelect[this.data.mid] || 0
        if(num < 0)
        {
            this.numText.text = '×'
            this.numText.size = 30
            this.numText.textColor = 0xCC0000
        }
        else
        {
            if(num)
                this.numText.textColor = 0xE0A44A
            else
                this.numText.textColor = 0x666666
            this.numText.size = 22
            this.numText.text = num + ''
        }


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