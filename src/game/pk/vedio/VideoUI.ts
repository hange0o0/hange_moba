class VideoUI extends game.BaseUI {
    private static instance: VideoUI;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoUI();
        return this.instance;
    }

    private bg: eui.Image;
    private topUI: TopUI;
    private enemyItem: VideoItem;
    private selfItem: VideoItem;
    private itemGroup: eui.Group;



    private enemyItems = []
    private selfItems = []

    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;
    private itemY1 = 380
    private itemY2 = 120


    private currentAction;
    private mvList;
    private timer;

    public constructor() {
        super();
        this.skinName = "VideoUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.addEventListener('hide',this.onClose,this);

        for(var i=0;i<3;i++)
        {
            var item = this.newItem(i)
            this.selfItems.push(item)
            if(i == 0)
            {
                item.scaleX = item.scaleY = 1.2;
                item.y = this.itemY1;
            }
            else
                item.y = 450;

            var item = this.newItem(i)
            this.enemyItems.push(item)
            if(i == 0)
            {
                item.scaleX = item.scaleY = 1.2;
                item.y = this.itemY2;
            }
            else
                item.y = 50;
        }

    }

    private newItem(index){
        var item = new PKItem();
        item.anchorOffsetX = this.itemWidth/2;
        item.anchorOffsetY = this.itemHeight/2;
        if(index == 0)
            item.x = 320;
        else if(index == 1)
            item.x = 190;
        else
            item.x = 450;
        this.itemGroup.addChild(item);

        return item;
    }


    private onClose(){
        this.hide();
        egret.Tween.removeAllTweens();
        egret.clearTimeout(this.timer);
    }

    public show(){
        super.show();
    }

    public onShow(){
        var VM = VideoManager.getInstance();
        this.topUI.setTitle('第'+(VM.index + 1)+'轮')
        var scene = PKManager.getInstance().getPKBG(VM.type);
        this.bg.source = scene;

        this.stageHeight = this.stage.stageHeight;
        this.itemGroup.y = ((this.stageHeight - 250-180)-500)/2 + 250

        var VC = VideoCode.getInstance()
        VC.initData(VM.baseData);
        VC.play(VM.type == 'test');

        this.selfItem.data = VC.player1
        this.enemyItem.data = VC.player2



        //if(VM.type == 'test')
        //    this.hide();
    }

    //取关联的显示对象
    public getRelateMC(team,index):any{
        if(team == 1)
        {
            if(index < 3)
                return this.selfItems[index]
            if(index == 3)
                return this.selfItem.getPlayer();
        }
        else
        {
            if(index < 3)
                return this.enemyItems[index]
            if(index == 3)
                return this.enemyItem.getPlayer();
        }
        return null;
    }

    public getPlayer(id){
        return null;
    }

    private onActionOver(){
        var VC = VideoCode.getInstance();
        if(!VC.isDebug)
        {
            this.selfItem.showValueChange()
            this.enemyItem.showValueChange()
        }
        VC.onMovieOver();
    }

    //根据数据刷新画面
    public renewView(){

    }

    //播放动画序列
    public playSkill(list){
        this.mvList = list;
        this.playOneSkill();
    }

    //播放单个动画
    public playOneSkill(){
        if(this.mvList.length == 0)
        {
            this.onActionOver();
        }
        else
        {
            var VC = VideoCode.getInstance();
             var data = this.mvList.pop();
            if(data.atker != 1 && data.atker != 2)
                data.atker = data.atker+'['+VC.getPlayerByID(data.atker).mvo.id+']'+(VC.getPlayerByID(data.atker).isPKing?'*':'');
            for(var i=0;i<data.defender.length;i++)
            {
                data.defender[i] = data.defender[i] + '[' + VC.getPlayerByID(data.defender[i]).mvo.id+']'+(VC.getPlayerByID(data.defender[i]).isPKing?'*':'');
            }

            if(VC.isDebug)
            {
                this.debugShow(data);
                return;
            }
            this.playOneSkill();
        }
    }

    private debugShow(data){
        var VC = VideoCode.getInstance();
        if(data.skillID == 50)
        {
            var str = data.atker + ' 攻击 ' + data.defender[0];
        }
        else if(data.skillID == 51)
        {
            var str = data.atker + ' 秒杀 ' + data.defender[0];
        }
        else if(data.skillID == 52)
        {
            var str = data.atker + ' 回合结束时血量改变';
        }
        else if(data.skillID == 53)
        {
            var str = data.atker +  ' 对 ' + data.defender.join(',') + ' 进行加成';
        }
        else
        {
            var str = data.atker + '对' + data.defender.join(',') + '使用技能' + data.skillID ;
        }
        str += '   ->  hp1 : '+VC.player1.hp + '/' + VC.player1.maxHp+'    hp2 : '+VC.player2.hp + '/' + VC.player2.maxHp
        console.log(str);
        this.playOneSkill();
    }

}
