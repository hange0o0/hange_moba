class CreateTeamUI extends game.BaseWindow {
    private static instance:CreateTeamUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CreateTeamUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "CreateTeamUISkin";
    }

    private nameText: eui.TextInput;
    private randomBtn: eui.Group;
    private cancleBtn: eui.Button;
    private okBtn: eui.Button;
    private hardText: eui.Label;
    private forceText: eui.Label;
    private levelText: eui.Label;
    private sortBtn: eui.Image;
    private sortText: eui.Label;
    private sortGroup: eui.Group;
    private sortList: eui.List;







    private data

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('创建队伍')
        this.addBtnEvent(this.cancleBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onOK);
        this.addBtnEvent(this.randomBtn, this.onRandom);
        this.addBtnEvent(this.sortBtn, this.onOpen);
        this.addBtnEvent(this.sortText, this.onOpen);

        this.sortList.selectedIndex = SharedObjectManager.instance.getValue('team_hard') || 0;
        this.sortList.addEventListener(egret.Event.CHANGE,this.onSelect,this)
        this.nameText.restrict = "a-zA-Z0-9_\u0391-\uFFE5";
        this.nameText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);
        this.sortList.itemRenderer = HonorSortItem;
        this.sortList.dataProvider = new eui.ArrayCollection(TeamDungeonManager.getInstance().hardData)
    }

    private onChange(){
        this.nameText.text = MyTool.replaceEmoji(this.nameText.text);
        var len = StringUtil.getStringLength(this.nameText.text);
        if(len > 14)
        {
            this.nameText.text = StringUtil.getStringByLength(this.nameText.text,7);
        }
    }

    private onSelect(){
        SharedObjectManager.instance.setValue('team_hard',this.sortList.selectedIndex)
        this.renewSelect()
        this.sortGroup.visible = false;
    }
    private onOpen(){
        GameManager.stage.once(egret.TouchEvent.TOUCH_TAP,this.onHideSort,this,true);
        this.sortGroup.visible = true;
    }

    private onHideSort(e?){
        if(e)
            e.stopImmediatePropagation()
        this.sortGroup.visible = false;
    }

    private onOK(){
        if(this.nameText.text == '系统菜刀队')
        {
            Alert('该队伍名称已被注册')
            return;
        }
        if(!this.nameText.text || BadWordsFilter.validateName(this.nameText.text))
        {
            Alert('队伍名字中含有非法字符');
            return;
        }

        var self = this;
        var name = this.nameText.text;
        var hard = this.sortList.selectedIndex+1;
        var type = this.data;

        var fun = function(){
            TeamDungeonManager.getInstance().createTeam(name,hard,type,function(){
                self.hide();
                InviteTeamUI.getInstance().show(type)
            })
        }
        var hardData:any = TeamDungeonManager.getInstance().hardData[this.sortList.selectedIndex];
        if(hard > 1 && UM.getForce() / hardData.force < 0.9)
        {
            Confirm('当前所选挑战难度大于你的能力，是否继续？',function(type){
                if(type == 1)
                {
                    fun();
                }
            });
        }
        else
        {
            fun();
        }



    }

    private onRandom(){
         this.nameText.text = MyTool.randomName() + '队';
    }

    public hide(){
        super.hide();
    }



    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.nameText.text = SharedObjectManager.instance.getValue('team_name') || '';
        this.onHideSort();
        this.renewSelect();


        if(TaskManager.getInstance().nowAction == 'friend_dungeon')
        {
            TaskManager.getInstance().showGuideMC(this.okBtn)
            this.nameText.text = '菜刀队' + UM.uid
        }

    }

    private renewSelect(){
        var hardData:any = TeamDungeonManager.getInstance().hardData[this.sortList.selectedIndex];
        this.setHtml(this.forceText,this.createHtml('卡士战力上限：',0xE0A44A) + hardData.force);
        this.setHtml(this.levelText,this.createHtml('卡兵等级上限：',0xE0A44A) + hardData.level + '级');
        this.sortText.text = hardData.label;
        this.hardText.text = '【' + hardData.name + '】限制：';
    }
}