class CollectDownItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "EnemyHeadItemSkin";
    }

    private chooseGroup: eui.Group;
    private chooseGroupBG: eui.Image;
    private headMC: eui.Image;
    private teamGroup: eui.Group;
    private teamGroupBG: eui.Image;
    private headMC2: eui.Image;
    private headBG: eui.Image;
    private lvText: eui.Label;
    private closeBtn: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;










    public index;

    public childrenCreated() {
        MyTool.removeMC(this.teamGroup);
        this.addChildAt(this.chooseGroup,0);
        this.scaleX = this.scaleY = 0.7
    }

    public dataChanged(){
        var mvo = MonsterVO.getObject(this.data.id);
        this.headMC.source = mvo.thumb
        this.nameText.size = 22
        this.nameText.text = mvo.name
        this.setChoose(CollectUI.getInstance().chooseMonster);
        this.renewDes();
    }

    public renewDes(){
        if(this.data.toLast)
        {
            this.nameText.text = '即将解锁';
            return;
        }

        switch(CollectUI.getInstance()['sortList'].selectedIndex)
        {
            case 0://默认
                this.nameText.text = MonsterVO.getObject(this.data.id).name;
                break;
            case 1://等级升序
            case 2://等级降序
                MyTool.setColorText(this.nameText, 'LV.' + UM.getMonsterLevel(this.data.id))
                break;
            case 3://使用次数
                MyTool.setColorText(this.nameText, ''+(this.data.t || 0) + '次')
                break;
            case 4://胜利次数
                MyTool.setColorText(this.nameText, ''+(this.data.w || 0) + '次')
                break;
            case 5://胜率
                MyTool.setColorText(this.nameText, ''+MyTool.toFixed(((this.data.r || 0)*100),1) + '%')
                break;
            case 6://胜率
                MyTool.setColorText(this.nameText, ''+Math.round(this.data.w * this.data.r) +'分');
                break;


        }
    }

    public setChoose(mid)
    {
        var b = this.data.id == mid
        this.chooseGroupBG.visible = b;
        return b
    }
}