class MainTaskUI extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "MainTaskUISkin";
    }

    private taskIcon: eui.Image;
    private taskText: eui.Label;
    private list: eui.List;
    private closeBtn: eui.Image;
    private redMC: eui.Image;








    public time = 0;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.onClose)
        this.addBtnEvent(this,this.onClick)
        this.currentState = 'close'
        this.list.itemRenderer = MainTaskItem;
    }

    public onClose(e){
        e.stopImmediatePropagation()
       this.currentState='close'
    }

    private onClick(){
          if(this.currentState == 'close')
          {
              this.currentState='open';
              egret.Tween.removeTweens(this.taskIcon)
              this.taskIcon.alpha = 1;
              GuideUI.getInstance().hideHand();
          }
    }

    public showMV(){
        GuideUI.getInstance().showHand(this);
        //egret.Tween.removeTweens(this.taskIcon)
        //this.taskIcon.alpha = 1;
        //var tw = egret.Tween.get(this.taskIcon,{loop:true})
        //tw.to({alpha:0.3},1000).to({alpha:1},1000)//.wait(1000)
    }

    public renew(){
        var count = 0;
        var arr = TaskManager.getInstance().getCurrentTaskList();
        this.list.dataProvider = new eui.ArrayCollection(arr)
        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            if(item.isFinish())
            {
                if(!TaskManager.getInstance().lastFinishStat[item.id])
                {
                    ShowTips('【'+item.getDes() + '】　[已完成]',2000);
                    TaskManager.getInstance().lastFinishStat[item.id] = true;
                }
                count ++;
            }
        }
        this.taskText.text = '任务：' + count + '/' + arr.length;
        this.redMC.visible = count > 0;
    }



}