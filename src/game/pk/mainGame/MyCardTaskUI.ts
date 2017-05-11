class MyCardTaskUI extends game.BaseWindow {
    private static instance:MyCardTaskUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MyCardTaskUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MyCardTaskUISkin";
    }

    private taskText: eui.Label;
    private useText: eui.Label;
    private rateText: eui.Label;
    private awardText: eui.Label;
    private okBtn: eui.Button;
    private awardItem: AwardItem;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);

    }

    public testShow(){
        var myCard = UM.getMyCard();
        var task = myCard.task
        if(task && task.current < task.num)
            this.show();
    }

    public show(){
        super.show();
    }

    public onShow(){
        var myCard = UM.getMyCard();
         var task = myCard.task
        if(!task)
        {
            Alert('暂无PK任务')
            this.hide();
            return;
        }
        this.setText(this.useText,'[使用次数：]'+(10-myCard.num)+'/10');
        this.setText(this.rateText,'[任务进度：]'+Math.min(task.current,task.num)+'/'+task.num);
        switch(task.award_type)
        {
            case 'diamond':
                this.setText(this.awardText,'[任务奖励：]钻石 +'+task.award_value);
                break;
            case 'coin':
                this.setText(this.awardText,'[任务奖励：]金币 +'+task.award_value);
                break;
            case 'card':
                this.setText(this.awardText,'[任务奖励：]碎片 +'+task.award_value);
                break;
            case 'energy':
                this.setText(this.awardText,'[任务奖励：]体力 +'+task.award_value);
                break;
            case 'ticket':
                this.setText(this.awardText,'[任务奖励：]修正币 +'+task.award_value);
                break;
        }

        this.awardItem.data = {type:'monster',id:task.mid}
        this.awardItem['newIcon'].visible = false;
        var numStr = '['+task.num+']';
        switch(task.type)
        {
            case 1:
                this.setText(this.taskText,'取得我方的' +numStr +'次首杀');
                break;
            case 2:
                this.setText(this.taskText,'取得' +numStr +'次双杀');
                break;
            case 3:
                this.setText(this.taskText,'取得' +numStr +'次三杀');
                break;
            case 4:
                this.setText(this.taskText,'胜利终结比赛' +numStr +'次');
                break;
            case 5:
                this.setText(this.taskText,'消灭' +numStr +'个敌人');
                break;
            case 6:
                this.setText(this.taskText, '赢得' +numStr +'次胜利');
                break;
        }
    }

    private setText(text,str){
        str = this.changeValue(str);
        this.setHtml(text,str);
    }

    private changeValue(str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        return str;
    }

}