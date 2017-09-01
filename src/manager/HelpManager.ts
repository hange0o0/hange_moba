class HelpManager {
    private static _instance:HelpManager;

    public static getInstance():HelpManager {
        if (!this._instance)
            this._instance = new HelpManager();
        return this._instance;
    }

    private helpObj = {};
    private infoList = [];
    public constructor() {
        this.helpObj['main'] = {
            title:'卡士公会说明',
            list:[
                '卡士公会是检测玩家职业能力的地方，玩家实力[越强]，将获得[越高]称号',
                '卡士的积业称号依次为' + MainGameManager.getInstance().stepName.join('，'),
                '每次在卡士公会进行挑战会花费[1点]体力',
                '在卡士公会进行挑战，使用的是[公共手牌]',
                '随着公会的评分提升，每天可领的补助会[越来越丰富]',
                '领取公会补助时，会以[当前评分等级]来作为衡量标准，而且每天只能领取[一次]',
                '玩家可在公会中使用[贿赂技能]去除当前关卡的指定单位，被贿赂单位在该关卡中将[永久]消失，不再上场。',
                '玩家可在公会中[多次]使用贿赂技能，直到只剩最后一个单位，但每次价格会[越来越贵]',
                '当玩家通过评分关卡后，贿赂价格就会被[重置]'
            ]
        }

        this.helpObj['day'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力',
                '研究院每天会推出[10个]关卡让玩家进行挑战，[难度]和[奖励]会逐渐[递增]',
                '在研究院中，每次挑战都需花费[1点]体力',
                '玩家在研究院的挑战中能获得[大量奖励]，[性价比]远高于其它PK玩法',
                '在[同一服务器]的所有玩家，研究院中推出的手牌和所遇到的关卡是[一样]的，跟同服的其它玩家交流通关心得会让你在通关的过程中少走弯路',
                '研究院中玩家每赢得一场挑战，就会获得[1点]研究分。每当集满[2点]研究分后，将[永久]得到[1点]战力奖励',
                '研究分[永久保留]，不会被清零',
                '研究院挑战中玩家使用的是[修正场规则]（玩家的手牌战力固定为1000，与玩家的实际战力[无关]）'
            ]
        }
        this.helpObj['server'] = {
            title:'天梯竞技场说明',
            list:[
                '参加竞技场是获得[卡兵碎片]和[修正币]的主要途径',
                '天梯竞技场的段位依次为' + ServerGameManager.getInstance().stepName.join('，'),
                '竞技场会自动匹配与玩家[实力相当]的其它玩家作为对手',
                '在竞技场中进行挑战，使用的是[公共手牌]',
                '在竞技场中，匹配不会消耗任何东西，但挑战会花费[1点]体力',
                '在竞技场中，你[必须]与匹配到的对手进行一次战斗后，才能重新匹配其它对手',
                '如果玩家在竞技场中挑战失败，可以选择[再次挑战]相同的玩家',
                '玩家在竞技场中的[称号越高]，获胜后得到的[奖励越丰厚]'

            ]
        }
        this.helpObj['serverequal'] = {
            title:'虚空修正场说明',
            list:[
                '虚空修正场是考量卡士[天赋]的重要地方',
                '修正场中所有玩家的挑战都[不受等级和战力的影响]，会在一个相对公平的环境下进行对战（玩家的手牌战力固定为1000）',
                '虚空修正场的天赋评级依次为' + ServerGameEqualManager.getInstance().stepName.join('，') + '，每一级中又分为上，中，下三品',
                '进入修正场需要消耗1个[修正币]作为门票',
                '如果玩家挑战修正场失败，可支付[1个修正币]再次进场，并选择该玩家作为对手，但[连胜]次数已被[重置]',
                '在修正场中进行挑战，使用的是[公共手牌]',
                '在修正场中，玩家会匹配到[积分相近]的玩家作为对手',
                '修正场称号[越高]，每次胜利获得的奖励也[越高]',
                '修正场会记录你当前的[连胜次数]，连胜次数[越高]，奖励[越丰富]。当玩家挑战失败时，连胜次数会被清0',
                '如果你的技术够强，参加修正场将是得到大量的[卡兵碎片]的最佳途径',
            ]
        }

        this.helpObj['map'] = {
            title:'野外清剿说明',
            list:[
                '野外世界布满的卡士世界黑暗势力的据点，他们的存在严重威胁了卡士世界的和平与稳定，作为正义的一方，我们有义务把他消灭掉',
                '玩家手下的卡兵会在野外[不断]地进行扫荡，当卡兵的实力得到[提升]后，扫荡效率会得到相应的[提高]',
                '卡兵在扫荡野外据点时，起作用的只是三围属性（[攻]，[血]，[速]），[不会]触发卡兵技能',
                '高级据点的敌人会[更强]，但消灭后得到的[功勋也会越多]',
                '在野外扫荡时，每消灭一个敌人，都会获得一定的[功勋]并得到[一张该据点的通辑令]。功勋会收集到[功勋背包]中，需要玩家点击[获取]才会放进功勋仓库。',
                '如果功勋背包[已满]，消灭敌人时将[不会]得到功勋，但[通辑令]仍在[继续]收集',
                '玩家可以使用功勋仓库中的功勋[兑换金币和卡兵碎片]',
                '玩家如果要进入[高一级]据点，需[完成]前一据点的挑战任务：消灭指定数量的[通辑令BOSS]',
                '玩家使用通辑令可搜寻到一组敌人，玩家可花费[1点]体力进行挑战，也可使用[1张]通辑令搜寻[新的敌人]',
                '即使玩家进入了更高级的据点，还是可以回到前[2]个据点进行扫荡的，但切换据点时，当前据点的通辑令会被[丢弃]',
                '玩家每天可在野外掠夺其它玩家的功勋，可获得其所在据点[背包上限]功勋值的[1/6]，每天有[10次]掠夺机会',
                '玩家也有可能被其它玩家掠夺功勋，被掠夺后会在功背包中[扣除]对应的值，并有可能扣成[负资产]！',
                '玩家可在[掠夺日志]中看到被其它玩家掠夺的[记录]，并有一次[报复]的机会，但该次报复也[会]计算在每天的掠夺次数中'
            ]
        }

        this.helpObj['friendPK'] = {
            title:'好友PK说明',
            list:[
                '玩家可以对任意好友发起PK，每天最多只有[10]次机会。',
                '好友PK应战不会占用挑战机会，但如果超过[2天]不应战，该PK请求就会过时[失效]。',
                '选择发起好友挑战后，玩家会得到[两组手牌]，需选择其中一组进行布阵后，就可以把你的[PK请求]发给对方',
                '对方收到请求后，会在[相同的两组手牌]选择一组进行应战',
                '好友PK分为[竞技场]和[修正场]两种模式，玩家可以在发请求前进行选择',
                '在玩家的好友信息中，会记录双方的历史胜负关系，玩家可以在好友的信息中看到你和Ta的[PK胜负情况]'
            ]
        }
        this.helpObj['friend'] = {
            title:'好友说明',
            list:[
                '添加好友后，你可以更方便的查看你的好友的游戏信息，也能与好友进行[聊天]，[PK]',
                '玩家可以通过查找面板，输入玩家名字后添加好友，也可以在它人信息面板中找到[添加好友]接钮(对方等级)',
                '向其它玩家发出添加好友请求后，需[对方同意]才能建立好友关系',
                '成为好友后，玩家就可以对方信息面板中查看到[与该好友的好友PK战绩]了',
                '如果想解除好友关系，只需在好友详情中点击[删除好友]就可以了，同时你也会从对方的好友列表中移除掉',
                '每个玩家最多可拥有[30个]好友，每天最多能发出[10次]PK请求'
            ]
        }

        this.helpObj['pk'] = {
            title:'PK说明',
            list:[
                '玩家每次PK时，可以从系统给出的[8位]卡兵中选出最多[6个]进行出战',
                '玩家布阵时共拥有[88个]符文，每个卡兵需[花费]一定数量的符文才能[召唤出阵]',
                '每个卡兵[不限出战次数]，但[重复上阵]时，召唤所需要的符文会[更多]',
                '卡兵的统帅技能，会在出战时对队伍中[所有卡兵]进行[最终的属性]加成，卡兵的[类型]不同，加成的[属性]也会不一样 。如果有[相同类型]卡兵出战，则加成值[最高]的生效',
                '统帅技能中，[【攻】]类型卡兵加成的是[攻击力]，[【盾】]类型卡兵加成的是[血量]，[【辅】]类型卡兵加成的是[速度]。',
                '卡兵的统帅技能,在[修正场规则]中[不起作用]',
                'PK过程采用的是[车轮战]方式，召唤单位按照布阵顺序[依次上阵]，只要将对方[所有出战单位消灭]，就能取得PK胜利',
                'PK时，排在出战单位后面的[2个]单位会对[出战单位]会进行[辅助]，使用的是其对应的[辅助技能]',
                '如果出战单位血量为[0]，则会[输掉]本轮战斗，由下一单位[顶替上阵]。继续战斗时，对方单位血量[不会得到回复]，但其它状态属性会被[重置]为出战前（永久性效果除外）',
                '如果某一出战单位已取得了[3]次连胜，即使该单位的血量不为0，也会[强制下阵]由下一单位顶替',
                '只有[出战单位]才能使用[绝招]，而绝招需要[满怒气]才能释放。每个卡兵需要的怒气上限[不同]，可在卡兵详情页中进行查看',
                '在出战阵容中点击上阵单位会有弹出更多选项，可进行[移动]，[插入]和[下阵]等操作。也可以拖动目标单位进行相应操作，得到的结果是一样的',
                '[合理]地选择出战单位，安排[合适]的出战顺序，是取得胜利的[关键]',
                '在PK结束界面的[下方]会列出每轮PK的[详细信息]，点击进去可看到[更详尽]的PK过程',
                '在[战斗回放]界面中，点击最上方的头部区域，可查看该回合结束后双方的[状态信息]。双击下方的回合数据区域，效果也是一样的',
                '在[结算]界面中，会对取胜方打出一个评分，[评分越高]，说明对战双方的实力[差距越大]'
            ]
        }

        this.helpObj['tec'] = {
            title:'升级说明',
            list:[
                '当收集到足够的卡兵[碎片]和[金币]后，玩家就可以对该卡兵进行[升级]',
                '升级卡兵后，该卡兵的单兵战力就会得到极大提升。同时，玩家的[总战力]也会得到相应的[提升]',
                '由于卡兵的出战战力是由玩家战力和卡兵单兵战力[共同构成的]，所以每次升级卡兵，[所有卡兵]的出战战力也会有所提升，只是被升级的那个卡兵能得到更多的提升'
            ]
        }

        this.helpObj['leader'] = {
            title:'统帅技能',
            list:[
                '统帅技能学习分为[高级学习]和[低级学习]两种',
                '玩家每天会有一次[免费]的低级统帅技能学习机会，学习后玩家可从随机到的[两个]卡兵中[选择一个]进行提高，每次增加[50]经验',
                '玩家也可以花费[500钻石]进行一次[高级学习]，学习后可从随机到的[六个]卡兵中[选择两个]进行提高，每个增加[150-300]经验',
                '玩家也可以使用[初习学习卡]和[高级学习卡]进行统帅技能学习，这两个道具会在游戏中掉落',
                '卡兵的统帅技能，会在出战时对队伍中[所有卡兵]进行[最终的属性]加成，卡兵的[类型]不同，加成的[属性]也会不一样 。如果有[相同类型]卡兵出战，则该类型加成值[最高]的生效',
                '统帅技能中，[【攻】]类型卡兵加成的是[攻击力]，[【盾】]类型卡兵加成的是[血量]，[【辅】]类型卡兵加成的是[速度]。',
                '卡兵的统帅技能,在[修正场规则]中[不起作用]'
            ]
        }

        var name = TeamDungeonManager.DungeonName.pve + '副本';
        this.helpObj['pve'] = {
            title:name + '说明',
            list:[
                name + '需要玩家组成一支[3人]队伍后才能参加',
                '在' + name + '中，玩家可选择不同难度进行挑战，难度[越高]，获得的奖励[越丰厚]',
                '在' + name + '中，不同难度对应的战力和卡兵等级上限是不一样的，如果玩家属性[高于难度要求]，则会把玩家属性[降至对应值]进行PK',
                '在' + name + '中，共有[25个]关卡让玩家进行挑战，每战胜[5个]关卡，队伍中的成员都可领取一次[奖励]，奖励最多可领取[5次]',
                '在' + name + '中进行挑战，每个成员使用的是各自的[公共手牌]，每次挑战都需消耗[1点]体力',
                '' + name + '会有时间限制，在副本结束后，奖励和副本数据都会被清空，玩家将[无法]在继续未完成的[挑战]或[领取奖励]'
            ]
        }


        this.helpObj['guess'] = {
            title:'竞猜说明',
            list:[
                '在竞猜系统中，玩家需从两组卡兵队伍中，选择你认为胜利的那一组进行下注',
                '在竞猜系统中，玩家可使用[金币]或[碎片]进行下注，猜中胜利方后会得到双倍返还，猜错则失去所有本金',
                '在竞猜系统中，玩家可调节投注的金额，金额上限与玩家等级挂钩',
                '在竞猜系统中，玩家每天可进行多次竞猜，竞猜次数与玩家等级挂钩，跨天次数会被重置'
            ]
        }

        this.helpObj['temp'] = {
            list:[
                '当前服务器的卡兵等级上限是['+TecManager.getInstance().maxLevel+'级]，玩家的等级上限是['+UM.maxLevel+'级]',
                '卡兵升级的最优化选择是：[平衡发展]，只有在所有卡兵等级一致时，才优先选择自己擅长的',
                '玩家的体力上限是'+UM.maxEnergy+',每['+30+'分钟]回复1点体力。购买体力回复加速后，回复时间将缩短为[24分钟]'
            ]
        }

        for(var s in this.helpObj)
        {
            var oo = this.helpObj[s];
            for(var ss in oo.list)
            {
                var text = oo.list[ss];
                this.infoList.push(text);
            }
        }
    }




    public getInfoText(){
        var text = ArrayUtil.randomOne(this.infoList);
        return text.replace(/\[/g,'<font color="#E0A44A">').replace(/\]/g,'<\/font>')
    }

    public mainHelp(){
        HelpUI.getInstance().show(this.helpObj['main']);
    }

    public dayHelp(){
        HelpUI.getInstance().show(this.helpObj['day']);
    }

    public serverHelp(){
        HelpUI.getInstance().show(this.helpObj['server']);
    }

    public serverEqualHelp(){
        HelpUI.getInstance().show(this.helpObj['serverequal']);
    }

    public friendPKHelp(){
        HelpUI.getInstance().show(this.helpObj['friendPK']);
    }

    public friendHelp(){
        HelpUI.getInstance().show(this.helpObj['friend']);
    }

    public pkPosHelp(){
        HelpUI.getInstance().show(this.helpObj['pk']);
    }

    public tecHelp(){
        HelpUI.getInstance().show(this.helpObj['tec']);
    }

    public guessHelp(){
        HelpUI.getInstance().show(this.helpObj['guess']);
    }
    public mapHelp(){
        HelpUI.getInstance().show(this.helpObj['map']);
    }
    public pveHelp(){
        HelpUI.getInstance().show(this.helpObj['pve']);
    }
    public leaderHelp(){
        HelpUI.getInstance().show(this.helpObj['leader']);
    }
}