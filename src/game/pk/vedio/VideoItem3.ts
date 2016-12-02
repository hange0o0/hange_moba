class VideoItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoItem3Skin";
    }

    private headMC: eui.Image;
    private con: eui.Group;

    public index;
    private maxConWidth = 500;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {
        var VC = VideoCode.getInstance();
        var data = this.data;
        if(data.type == 'over')
        {
            this.currentState = 'left'
            return;
        }
        var base = data[0];
        this.index = base.index;
        //this.headMC.source =
        //console.log(data);
        //var skillI
        //this.currentState = 'left'
        //this.currentState = 'right'

        for(var i=0;i<data.length;i++)
        {
            this.addOneSkill(data[i])
        }
    }

    private addOneSkill(data){

        var skill = data.skillID;

        switch(skill)
        {
            case 50://物攻
                this.decode_atk(data);
                break;
        }

    }

    //解释物攻
    private decode_atk(data){
        var arr = data.defender;
        var atker = data.atker;
        var group = this.addGroup();
        for(var i=0;i<arr.length;i++)
        {

        }

    }

    //特效后使用攻击
    private decode_satk(data){
        var arr = data.defender;
        var atker = data.atker;
        var group = this.addGroup();
        for(var i=0;i<arr.length;i++)
        {

        }
    }

    //攻击后有特效
    private decode_atks(data){
        var arr = data.defender;
        var atker = data.atker;
        var group = this.addGroup();
        for(var i=0;i<arr.length;i++)
        {

        }
    }

    //对1个单位施法
    private decode_skill1(data){
        var arr = data.defender;
        var atker = data.atker;
        var group = this.addGroup();
        for(var i=0;i<arr.length;i++)
        {

        }
    }



    private addGroup(){
        var group = new eui.Group();
        var layOut = new eui.HorizontalLayout();
        group.layout = layOut;
        group.height = 60;
        this.con.addChild(group);
        return group;
    }

    private getWordText(){
        var hpText = new eui.Label();
        hpText.size = 18;
        //hpText.horizontalCenter = 0;
        //this.addChild(hpText)
        //hpText.text = '-' + NumberUtil.formatStrBigNum(word)
    }
    private getPKIcon(){

    }
}