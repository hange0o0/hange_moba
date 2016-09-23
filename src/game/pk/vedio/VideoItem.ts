class VideoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private stateText: eui.BitmapLabel;
    private hpBar: eui.Image;
    private hpText: eui.Label;
    private mpBar: eui.Image;
    private mpText: eui.Label;
    private apBar: eui.Image;
    private apText: eui.Label;





    public index;
    public player:PlayerVO;

    //主要表现的属性
    public hp
    public maxHp
    public mp
    public maxMp
    public actionCount
    //public atk
    //public speed

    private valueObject;
    private hpBarWidth = 275
    private mpBarWidth = 235
    private apBarWidth = 195

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    public getPlayerXY(){
        return this.localToGlobal(this.headMC.x + this.headMC.width/2,this.headMC.y + this.headMC.height/2) ;
    }

    private onClose(){

    }

    //初始化数据
    public dataChanged() {
        var player = this.player = this.data;
        var vo = MonsterVO.getObject(this.data.mid);
        var PKM = PKManager.getInstance();

        if(this.index == 1)
        {
            this.headMC.source = MyTool.getHeadUrl(PKM.team1Head);
            //this.skillText.text = RingVO.getObject(PKM.team1Ring).name;
        }
        else
        {
            this.headMC.source = MyTool.getHeadUrl(PKM.team2Head);
            //this.skillText.text = RingVO.getObject(PKM.team2Ring).name;
        }


        this.stateText.text = player.tag;
        this.nameText.text = vo.name

        this.hpBar.width = player.hp/player.maxHp*this.hpBarWidth
        this.mpBar.width = player.mp/vo.mp*this.mpBarWidth
        this.apBar.width = player.actionCount/30*this.apBarWidth


        this.hpText.text = player.hp + '/' + player.maxHp
        this.mpText.text = player.mp + '/' + vo.mp
        this.apText.text = player.actionCount + '/' + 30


        //this.atkText.text = '攻击：' + player.atk
        //this.speedText.text = '速度：' + player.speed + ''

        this.hp = player.hp
        //this.atk = player.atk
        //this.speed = player.speed
        this.maxHp = player.maxHp
        this.mp = player.mp
        this.maxMp = player.maxMp
        this.maxMp = player.maxMp
        this.actionCount = player.actionCount
    }

    //属性改变动画
    public showValueChange()
    {
        var player = this.player;
        var b = false;
        var times = 3;
        var o:any = {};

        if(player.hp != this.hp || player.maxHp != this.maxHp)
        {
            var tw:egret.Tween = egret.Tween.get(this.hpBar);
            tw.to({width:player.hp/player.maxHp*this.hpBarWidth},100);
            o.hp = MyTool.getValueChangeArray(this.hp,player.hp,times);
            b = true;
        }
        if(player.mp != this.mp || player.maxMp != this.maxMp)
        {
            var tw:egret.Tween = egret.Tween.get(this.mpBar);
            tw.to({width:Math.min(player.mp/player.maxMp,1)*this.mpBarWidth},100);
            o.mp = MyTool.getValueChangeArray(this.mp,player.mp,times);
            b = true;
        }
        if(player.actionCount != this.actionCount)
        {
            var tw:egret.Tween = egret.Tween.get(this.mpBar);
            tw.to({width:Math.min(player.actionCount/30,1)*this.apBarWidth},100);
            o.ap = MyTool.getValueChangeArray(this.actionCount,player.actionCount,times);
            b = true;
        }



        //if(player.atk != this.atk)
        //{
        //    o.atk = MyTool.getValueChangeArray(this.atk,player.atk,times);
        //    b = true;
        //}
        //if(player.speed != this.speed)
        //{
        //    o.speed = MyTool.getValueChangeArray(this.speed,player.speed,times);
        //    b = true;
        //}

        if(b) //数值有变化
        {
            this.valueObject = o;
             this.addEventListener(egret.Event.ENTER_FRAME,this.onValueChange,this)
        }

        this.hp = player.hp
        //this.atk = player.atk
        //this.speed = player.speed
        this.maxHp = player.maxHp
        this.maxMp = player.maxMp
        this.actionCount = player.actionCount
        this.mp = player.mp

    }

    private onValueChange(){
        var b = false;
         for(var s in this.valueObject)
         {
             var v = this.valueObject[s]
             if(v.length == 0)
                continue;
             b = true;
             if(s == 'hp')
                this.hpText.text = v.shift()  + '/' + this.maxHp;
             else if(s == 'mp')
                this.mpText.text = v.shift()  + '/' + this.maxMp;
             else if(s == 'ap')
                this.apText.text = v.shift()  + '/' + 30;
             //else if(s == 'atk')
             //   this.atkText.text = v.shift();
             //else if(s == 'speed')
             //   this.speed.text = v.shift();

         }
        if(b == false)
        {
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onValueChange,this)
        }
    }


}
