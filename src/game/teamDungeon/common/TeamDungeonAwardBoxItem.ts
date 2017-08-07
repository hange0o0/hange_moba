class TeamDungeonAwardBoxItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamDungeonAwardBoxItemSkin";
    }


    private nameText: eui.Label;
    private mc: eui.Image;





    public childrenCreated() {
         this.addBtnEvent(this,this.onClick)
        addBtnTips(this,this.onScore);
    }

    private onScore(){
        if(this.data.isOpen)
            return '';
        var arr = [];
        if(this.data.award.coin)
            arr.push('金币×' + this.data.award.coin);
        if(this.data.award.card)
            arr.push('碎片×' + this.data.award.card);
        return arr.join('\n');
    }

    private onClick(){
        if(this.data.isOpen && !this.data.isAward)
        {
            this.data.awardFun.apply(this.data.thisObj,[this.data.index]);
        }
    }

    public dataChanged() {
        if(this.data.isAward)
        {
            this.mc.source = 'box_open_png'
            this.nameText.text = '已领奖';
        }
        else
        {
            this.mc.source = 'box_close_png'
            if(this.data.isOpen)
            {
                MyTool.changeGray(this.mc,false);
                this.nameText.text = '可领奖';
            }
            else
            {
                MyTool.changeGray(this.mc,true)
                this.nameText.text = this.data.text;
            }
        }

        //index:i+1,
        //    awardFun:this.awardFun,
        //    isOpen:awardStep > i,
        //    isAward:player.award[i+1]
    }


}