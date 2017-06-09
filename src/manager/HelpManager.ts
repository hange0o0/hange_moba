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
                '卡士公会是检测玩家职业能力的地方，玩家实力越强，将获得越高称号',
                '卡士的积业称号依次为' + MainGameManager.getInstance().stepName.join('，'),
                '每次在卡士公会进行挑战会花费[1点]体力',
                '在卡士公会进行挑战，使用的是公共手牌',
                '随着公会的评分提升，每天可领的补助会越来越丰富',
                '领取公会补助时，会以[当前评分等级]来作为衡量标准，而且每天只能领取[一次]',
                '玩家可在公会中使用贿赂技能去除当前关卡的指定单位，被贿赂单位在该关卡中将[永久]消失，不再上场。',
                '玩家可在公会中多次使用贿赂技能，直到只剩最后一个单位，但每次价格会越来越贵',
                '当玩家通过评分关卡后，贿赂价格就会被重置'
            ]
        }

        this.helpObj['day'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡牌的终极力量，试图开发出每张卡牌以弱胜强的能力',
                '研究院每天会推出10个关卡让玩家进行挑战，难度和奖励会逐渐递增',
                '在研究院中，每次挑战都需花费[1点]体力',
                '玩家在研究院的挑战中能获得大量奖励，性价比远高于其它PK玩法',
                '在同一服务器的所有玩家，研究院中推出的手牌和所遇到的关卡是一样的，跟同服的其它玩家交流通关心得会让你在通关的过程中少走弯路',
                '研究院中玩家每赢得一场挑战，就会获得[1点]研究分。每当集满5点研究分后，将[永久]得到[1点]战力奖励',
                '研究分永久保留，不会被清零',
                '研究院挑战中玩家使用的是修正场规则（玩家的手牌战力固定为1000，与玩家的实际战力无关）'
            ]
        }
        this.helpObj['server'] = {
            title:'天梯竞技场说明',
            list:[
                '参加竞技场是获得[卡牌碎片]和[修正币]的主要途径',
                '天梯竞技场的段位依次为' + ServerGameManager.getInstance().stepName.join('，'),
                '竞技场会自动匹配与玩家实力相当的其它玩家作为对手',
                '在竞技场中进行挑战，使用的是公共手牌',
                '在竞技场中，匹配不会消耗任何东西，但挑战会花费[1点]体力',
                '在竞技场中，你必须与匹配到的对手进行一次战斗后，才能重新匹配其它对手',
                '如果玩家在竞技场中挑战失败，可以选择再次挑战相同的玩家',
                '玩家在竞技场中的称号越高，获胜后得到的奖励越丰厚'

            ]
        }
        this.helpObj['serverequal'] = {
            title:'虚空修正场说明',
            list:[
                '虚空修正场是考量卡士天赋的重要地方',
                '修正场中所有玩家的挑战都不受等级和战力的影响，会在一个相对公平的环境下进行对战（玩家的手牌战力固定为1000）',
                '虚空修正场的天赋评级依次为' + ServerGameEqualManager.getInstance().stepName.join('，') + '，每一级中又分为上，中，下三品',
                '进入修正场需要消耗1个[修正币]作为门票',
                '如果玩家挑战修正场失败，可支付1个[修正币]再次进场，并选择该玩家作为对手，但连胜次数不会得到延续',
                '在修正场中进行挑战，使用的是公共手牌',
                '在修正场中，玩家会匹配到积分相近的玩家作为对手',
                '修正场称号越高，每次胜利获得的奖励也越高',
                '修正场会记录你当前的连胜次数，连胜次数越高，奖励越丰富。当玩家挑战失败时，连胜次数会被清0',
                '如果你的技术够强，参加修正场将是得到大量的[卡牌碎片]的最佳途径',
            ]
        }

        this.helpObj['map'] = {
            title:'野外清剿说明',
            list:[
                '野外世界布满的卡士世界黑暗势力的据点，他们的存在严重威胁了卡士世界的和平与稳定，作为正义的一方，我们有义务把他消灭掉',
                '野外的多个据点中会存在战力不一的敌人，只有消灭低等战力的敌人，才能向更高据点出发',
                '春风吹又生，即使你今天清剿完这个野外剧点，明天又会有新的敌人出现了，你需要不停的努力才能维护世界的和平',
                '你在野外每消灭掉一波敌人，都会得到相应的军功积分，你可以使用积分在兑换处兑换你需要的物资'
            ]
        }

        this.helpObj['friendPK'] = {
            title:'好友PK说明',
            list:[
                '玩家可以对任意好友发起PK，每天最多只有[10]次机会。',
                '好友PK应战不会占用挑战机会，但如果超过2天不应战，该PK请求就会过时失效。',
                '选择发起好友挑战后，玩家会得到两组手牌，需选择其中一组进行布阵后，就可以把你的PK请求发给对方',
                '对方收到请求后，会在相同的两组手牌选择一组进行应战',
                '好友PK分为[竞技场]和[修正场]两种模式，玩家可以在发请求前进行选择',
                '在玩家的好友信息中，会记录双方的历史胜负关系，玩家可以在好友的信息中看到你和Ta的PK胜负情况'
            ]
        }
        this.helpObj['friend'] = {
            title:'好友说明',
            list:[
                '添加好友后，你可以更方便的查看你的好友的游戏信息，也能与好友进行聊天，PK',
                '玩家可以通过查找面板，输入玩家名字后添加好友，也可以在它人信息面板中找到添加好友接钮',
                '向其它玩家发出添加好友请求后，需对方同意才能建立好友关系',
                '成为好友后，玩家就可以对方信息面板中查看到与该好友的好友PK成绩了',
                '如果想解除好友关系，只需在好友详情中点击删除好友就可以了，同时你也会从对方的好友列表中移除掉',
                '每个玩家最多可拥有10个好友，每天最多能发出10次PK请求'
            ]
        }

        this.helpObj['pk'] = {
            title:'PK说明',
            list:[
                '玩家每次PK时，可以从系统给出的8张手牌中选出最多6个进行出战',
                '玩家布阵时共拥有88个符文，每个手牌需花费一定数量的符文才能召唤出阵',
                '每个手牌不限出战次数，但重复上阵时，召唤所需要的符文会更多',
                'PK过程采用的是[车轮战]方式，召唤单位按照布阵顺序依次上阵，只要将对方所有出战单位消灭，就能取得PK胜利',
                'PK时，排在出战单位后面的2个单位会对出战单位会进行辅助，使用的是其对应的[辅助技能]',
                '如果出战单位血量为0，则会输掉本轮战斗，由下一单位顶替上阵。继续战斗时，对方单位血量不会得到回复，但其它状态属性会被重置为出战前（永久性效果除外）',
                '如果某一出战单位已取得了[3]次连胜，即使该单位的血量不为0，也会强制下阵由下一单位顶替',
                '只有出战单位才能使用绝招，而绝招需要满怒气才能释放。每张卡牌需要的怒气上限不同，可在卡牌详情页中进行查看',
                '在出战阵容中点击上阵单位会有弹出更多选项，可进行[移动]，[插入]和[下阵]等操作。也可以拖动目标单位进行相应操作，得到的结果是一样的',
                '合理地选择出战单位，安排合适的出战顺序，是取得胜利的关键',
                '在PK结束界面的下方会列出每轮PK的详细信息，点击进去可看到更详尽的PK过程',
                '在[战斗回放]界面中，点击最上方的头部区域，可查看该回合结束后双方的状态信息。双击下方的回合数据区域，效果也是一样的',
                '在[结算]界面中，会对取胜方打出一个评分，评分越高，说明对战双方的实力差距越大'
            ]
        }

        this.helpObj['tec'] = {
            title:'升级说明',
            list:[
                '当收集到足够的卡牌碎片和金币后，玩家就可以对该卡牌进成升级',
                '升级卡牌后，该卡牌的单兵战力就会得到极大提升。同时，玩家的总战力也会得到相应的提升',
                '由于卡牌的出战战力是由玩家战力和卡牌单兵战力共同构成的，所以每次升级卡牌，其它卡牌的出战战力也会有所提升，只是被升级的那张卡牌能得到双重的提升'
            ]
        }

        var name = TeamDungeonManager.DungeonName.pve + '副本';
        this.helpObj['pve'] = {
            title:name + '说明',
            list:[
                name + '需要玩家组成一支[3人]队伍后才能参加',
                '在' + name + '中，玩家可选择不同难度进行挑战，难度越高，获得的奖励越丰厚',
                '在' + name + '中，不同难度对应的战力和卡牌等级上限是不一样的，如果玩家属性高于难度要求，则会把玩家属性[降至对应值]进行PK',
                '在' + name + '中，共有25个关卡让玩家进行挑战，每战胜[5个]关卡，队伍中的成员都可领取一次奖励，奖励最多可领取[5次]',
                '在' + name + '中进行挑战，每个成员使用的是各自的公共手牌，每次挑战都需消耗[1点]体力',
                '' + name + '会有时间限制，在副本结束后，奖励和副本数据都会被清空，玩家将无法在继续未完成的挑战或领取奖励'
            ]
        }


        this.helpObj['temp'] = {
            list:[
                '当前服务器的卡牌等级上限是'+TecManager.getInstance().maxLevel+'级，玩家的等级上限是'+UM.maxLevel+'级',
                '卡牌升级的最优化选择是：[平衡发展]，只有在所有卡牌等级一致时，才优先选择自己擅长的',
                '玩家的体力上限是'+UM.maxEnergy+',每['+30+'分钟]回复1点体力。购买体力回复回成后，回复时间将缩短为[24分钟]'
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
        return text.replace(/\[/g,'<font color="#FFFF00">').replace(/\]/g,'<\/font>')
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

    public mapHelp(){
        HelpUI.getInstance().show(this.helpObj['map']);
    }
    public pveHelp(){
        HelpUI.getInstance().show(this.helpObj['pve']);
    }
}