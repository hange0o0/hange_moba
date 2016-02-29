//展示NPC的数据，点击会在下面展开详情
class NPCTeamUI extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }
    private monsterInfo:MonsterInfoBase;

    private con:eui.Group
    private group:eui.Group
    private txt:eui.Label
    private img:eui.Image
    private list:eui.List
    private scroller:eui.Scroller


    private defaultHeight = 300;

    private mcArray = [];


    private listArray = [];
    private dataIn;
    public childrenCreated() {
        super.childrenCreated();
        for(var i=0;i<10;i++)
        {
            var mc = this['mc'+i]
            this.mcArray.push(mc);
            DragManager.getInstance().setDrag(mc);
            mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClick,this)
        }

        this.addBtnEvent(this.img,this.closeInfo);
        //this.group.addChild(this.monsterInfo);
    }

    public renew(data){
        this.dataIn = data;
        this.listArray = data.list;

        for(var i=0;i<this.mcArray.length;i++)
        {
            var mc = this.mcArray[i];
            if(this.listArray[i])
            {
                mc.visible = true;
                mc.source = MonsterVO.getObject(this.listArray[i]).thumb;
            }
            else
            {
                mc.visible = false;
            }
        }
    }

    public onResize(space = 0){
        this.scroller.height = GameManager.stage.stageHeight-this.defaultHeight - space;
    }

    private closeInfo(){
        MyTool.removeMC(this.group)
    }

    private onClick(e:egret.TouchEvent){
        this.con.addChild(this.group);
        var index = this.mcArray.indexOf(e.currentTarget);
        var monsterID = this.listArray[index];

        var oo = {
            isNPC:true,
            fight:this.dataIn.fight,
            isEqual:this.dataIn.isEqual,
            index:index
        };
        this.monsterInfo.renew(monsterID,oo)
    }




}
