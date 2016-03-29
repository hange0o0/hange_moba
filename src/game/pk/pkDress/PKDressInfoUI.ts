class PKDressInfoUI extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private monsterInfo:MonsterInfoBase;

    private txt:eui.Label
    private img:eui.Image
    private list:eui.List
    private scroller:eui.Scroller


    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.img, this.onChoose);
    }

    private onChoose(){
        var PD = PKDressUI.getInstance();
        //PD.chooseUI.addOne(PD.selectMonster);
    }

    public renew(){
        var PD = PKDressUI.getInstance();
        var monsterID = PD.selectMonster;

        var oo = {
            fight:0,
            isEqual:PD.isEqual
            //index:PD.monsterList.indexOf(monsterID)
        };

        this.monsterInfo.renew(monsterID,oo)


        var cost = PD.getCurrentResource();
        var vo = MonsterVO.getObject(monsterID);
        var currentChoose =1// PD.chooseUI.getMonsterNum(monsterID);
        var max = Math.min(UM.getMonsterCollect(monsterID),3)
        this.img.visible = true; //选中按钮
        if(max <= currentChoose)
        {
            this.img.visible =false;
            this.txt.text = '已达最高可选数量';
        }
        else if(cost.coin < vo.cost)
        {
            this.img.visible =false;
            this.txt.text = '金币不足';
        }
        else if(cost.wood < vo.wood)
        {
            this.img.visible =false;
            this.txt.text = '木不足';
        }
    }




}