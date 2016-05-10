class VideoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private atkText: eui.Label;
    private speedText: eui.Label;
    private headMC: eui.Image;
    private skillText: eui.Label;
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
    public atk
    public speed

    private valueObject;
    private barWidth = 175


    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    public getPlayer(){
        return this.headMC;
    }

    private onClose(){

    }

    //初始化数据
    public dataChanged() {
        var player = this.player;
        var vo = MonsterVO.getObject(this.data.id);

        this.headMC.source = MyTool.getHeadUrl(PKManager.getInstance().otherHead);
        this.skillText.text = ''

        this.stateText.text = player.tag;
        this.nameText.text = vo.name

        this.hpBar.width = player.hp/player.maxHp*this.barWidth
        this.mpBar.width = player.mp/100*this.barWidth
        this.apBar.width = player.actionCount/30*this.barWidth


        this.hpText.text = player.hp + '/' + player.maxHp
        this.mpText.text = player.mp + '/' + 100
        this.apText.text = player.actionCount + '/' + 30


        this.atkText.text = '攻击：' + player.atk
        this.speedText.text = '速度：' + player.speed + ''

        this.hp = player.hp
        this.atk = player.atk
        this.speed = player.speed
        this.maxHp = player.maxHp
        this.mp = player.mp
    }

    //属性改变动画
    public showValueChange()
    {
        var player = this.player;
        if(player.hp != this.hp || player.maxHp != this.maxHp)
        {
            var tw:egret.Tween = egret.Tween.get(this.hpBar);
            tw.to({width:player.hp/player.maxHp*175},100);
        }
        if(player.mp != this.mp)
        {
            var tw:egret.Tween = egret.Tween.get(this.mpBar);
            tw.to({width:Math.min(player.mp/100,1)*175},100);
        }

        var b = false;
        var times = 3;
        var o:any = {};
        if(player.hp != this.hp)
        {
            o.hp = MyTool.getValueChangeArray(this.hp,player.hp,times);
            b = true;
        }
        if(player.atk != this.atk)
        {
            o.atk = MyTool.getValueChangeArray(this.atk,player.atk,times);
            b = true;
        }
        if(player.speed != this.speed)
        {
            o.speed = MyTool.getValueChangeArray(this.speed,player.speed,times);
            b = true;
        }

        if(b) //数值有变化
        {
            this.valueObject = o;
             this.addEventListener(egret.Event.ENTER_FRAME,this.onValueChange,this)
        }

        this.hp = player.hp
        this.atk = player.atk
        this.speed = player.speed
        this.maxHp = player.maxHp
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
                this.hpText.text = v.shift();
             else if(s == 'atk')
                this.atkText.text = v.shift();
             else if(s == 'speed')
                this.speed.text = v.shift();

         }
        if(b == false)
        {
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onValueChange,this)
        }
    }


}
