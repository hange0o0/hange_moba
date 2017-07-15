class MainTaskItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainTaskItemSkin";
    }

    private titleText: eui.Label;
    private resultText: eui.Label;






    public time = 0;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }


    private onClick(){
        if(this.data.isFinish())
        {
            TaskManager.getInstance().getTaskAward(this.data.id);
        }
        else
            this.data.onClick();
    }


    public dataChanged() {
        var vo = this.data;
        MyTool.setColorText(this.titleText,vo.getDes());
        if(vo.isFinish())
        {
            this.resultText.text =  '【领奖】'
            this.resultText.textColor =  0xFFFF00
        }
        else
        {
            this.resultText.text =  vo.getRate()
            this.resultText.textColor =  0xE0A44A
        }
    }
}