class MyCardGroupUI extends game.BaseItem {
    public constructor() {
        super();
    }

    private con: eui.Group;
    private myGroup: eui.Group;
    private myList: eui.List;
    private titleText: eui.Label;
    private taskGroup: eui.Group;
    private taskText:eui.Label;
    private taskRateText: eui.Label;




    public index;

    public childrenCreated() {
        //MyTool.addTestBlock(this);
        this.myList.itemRenderer = MyHeadItem
        this.addBtnEvent(this.taskGroup,this.onClick);

    }

    private onClick(){
        MyCardTaskUI.getInstance().show();
    }

    public renew(specialData?){
        var myCard = UM.getMyCard();
        var specialData = specialData || {};
        //更新卡组1
        var chooseList1 = [];
        PKManager.getInstance().sortMonster(myCard.list);
        for(var i=0;i<myCard.list.length;i++)
        {
            var id = myCard.list[i]
            chooseList1.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList1
            });
        }
        this.myList.dataProvider = new eui.ArrayCollection(chooseList1);
        this.titleText.text = '我的卡组（'+(10-myCard.num)+'/10）'


        var myCard = UM.getMyCard();
        var task = myCard.task;
        if(!task)
        {
            MyTool.removeMC(this.taskGroup)
            return;
        }

        this.con.addChild(this.taskGroup)

        this.taskRateText.text = Math.min(task.current,task.num)+'/'+task.num;
        if(task.current >= task.num)
        {
            this.taskRateText.text = '已完成'
        }

        var numStr = '['+task.num+']';
        var str = '[卡组任务：]使用['+MonsterVO.getObject(task.mid).name+']'
        switch(task.type)
        {
            case 1:
                str += ('取得我方的' +numStr +'次首杀');
                break;
            case 2:
                str += ('取得' +numStr +'次双杀');
                break;
            case 3:
                str += ('取得' +numStr +'次三杀');
                break;
            case 4:
                str += ('胜利终结比赛' +numStr +'次');
                break;
            case 5:
                str += ('消灭' +numStr +'个敌人');
                break;
            case 6:
                str += ( '赢得' +numStr +'次胜利');
                break;
        }
        MyTool.setColorText(this.taskText,str);
        return task.mid;
    }
}
