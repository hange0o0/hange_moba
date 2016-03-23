class PKDressSimpleItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private stateMC: eui.Image;
    private headMC: eui.Image;



    private txt: eui.Label;
    private img: eui.Image;

    public index;

    public childrenCreated() {

    }

    public dataChange() {
        var chooseArray = PKDressUI.getInstance().chooseUI.chooseList;
        var chooseID = PKDressUI.getInstance().selectMonster;
        var vo = MonsterVO.getObject(this.data);
        this.img.source = vo.thumb;

        //我是选中单位
        if(chooseID == this.data) {

        }
        //是否影响选中单位
        if(vo.isEffect(chooseID)) {

        }

        //是否被选中单位影响
        if(vo.isBeEffect(chooseID)) {

        }

        //加成
        var add = 0;
        if(chooseArray[this.index + 1] && vo.isBeEffect(chooseArray[this.index + 1]))
            add++;
        if(chooseArray[this.index + 2] && vo.isBeEffect(chooseArray[this.index + 2]))
            add++;
        if(add > 0) {
            this.txt.text = add * 10 + '%';
        }

    }
}