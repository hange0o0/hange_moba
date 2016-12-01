class VideoStatItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoStatItemSkin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;


    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {

    }

    private changeStat(data){
        var str = ''
        var oo = {
            1:'攻击+',
            2:'速度+',
            3:'防御+',
            4:'伤害+',
            11:'攻击-',
            12:'速度-',
            13:'防御-',
            14:'伤害-',
            21:'缴械',
            22:'冷却',
            23:'沉默',
            24:'静止',
            25:'魅惑',
            31:'魔免',
            41:'治疗',
            42:'失血'
        }

        if(data.cd)
            return oo[data.stat] + data.cd;
        return oo[data.stat];
    }
}