/**
 *
 * @author 
 *
 */
class GuideManager {
    private static _instance: GuideManager;
    public currentStepId: Number;
    public isGuiding:Boolean=true;

    public guideStep = 0;
    
    public constructor() {
    }

    public static getInstance(): GuideManager {
        if(!this._instance)
            this._instance = new GuideManager();
        return this._instance;
    }

    public showGuide(ui?){
        if(!this.isGuiding)
            return;
        if(ui)
            ui.validateNow();
        egret.callLater(this.guideFun,this,ui);
    }

    private guideFun(ui){
        var self = this;
        var mc;
        var fun;
        var text;
        var hideHand = false;
        switch(this.guideStep)
        {
            case 0:
                text = '欢迎来到卡斗士的乐园，在这里你会感受到不一样的卡牌对决的乐趣！现在，就让我们进入这趟神奇之旅吧！'
                fun = function(){self.showGuide()};
                break;
            case 1:
                mc = MainPageUI.getInstance()['mainGame']['startBtn'];
                text = '试练场是检测玩家实力的地方，玩家实力越强，将会走得越远。\n现在，我们开始第一次PK'
                break;
            case 2:
                if(ui != MainGameUI.getInstance())
                    return;
                mc = ui['enemyGroup'];
                text = '我们已经得到系统给的卡组了，选观察一下对手的卡组，以方便我们制定合适的战术'
                fun = function(){self.showGuide(ui)};
                break;
            case 3:
                if(ui != MainGameUI.getInstance())
                    return;
                mc = ui['chooseBtn0'];
                text = '来，我们去布阵吧'
                break;
            case 4:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['list'].getChildAt(0)['useBtn'];
                text = '【人鱼战士】是一张不错的卡，我们就选它出战吧'
                break;
            case 5:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['list'].getChildAt(0)['useBtn'];
                text = '虽然多次出战会花费更多的符文，但我觉得这张卡值这个价'
                break;
            case 6:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['list'].getChildAt(6)['useBtn'];
                text = '我觉得我们还需要一张肉盾，就选它吧'
                break;
            case 7:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['pkDressChooseUI']['h3'];
                text = '肉盾当然要站在前排才能发挥最大价值，让我们为它来调整一下出场顺序吧'
                break;
            case 8:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['pkDressChooseUI']['a1'];
                text = '点这里把它插到最前面'
                break;
            case 9:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['list'].getChildAt(7)['useBtn'];
                text = '虽然我觉得这样的阵型足以打败对手了，但既然还有符文剩余，就多上张牌保险一点吧'
                break;
            case 10:
                if(ui != PKDressUI.getInstance())
                    return;
                mc = ui['pkDressChooseUI']['pkBtn'];
                text = '好了，是时候让对手见识一下我们的智慧了，GO！GO！GO！'
                break;
            case 11:
                if(ui != PKResultUI.getInstance())
                    return;
                mc = ui['list'];
                text = '是不是很简单？如果想了解更详尽的PK过程，可以点击下方的对战信息进行查看'
                fun = function(){self.showGuide(PKWinUI.getInstance())};
                break;
            case 12:
                if(ui != PKWinUI.getInstance())
                    return;
                mc = ui['okBtn'];
                text = '我觉得暂时还没有复盘的需要，还是退回首页再了解一下其它功能吧'
                break;
            case 13:
                if(ui != MainPageUI.getInstance())
                    return;
                mc = this.getMainRect()
                text = '每日任务每天会刷出10关让玩家进行挑战，通过积累任务积分会获得永久的战力加成奖励，是每天绝不能错过的玩法！'
                hideHand = true;
                fun = function(){
                    self.showGuide(MainPageUI.getInstance())
                    MainPageUI.getInstance()['currentPage'] = 2;
                    MainPageUI.getInstance().scrollToCurrentPage();
                    MainPageUI.getInstance().renewPage();
                };
                break;
            case 14:
                if(ui != MainPageUI.getInstance())
                    return;
                mc = this.getMainRect()
                text = '在竞技场中，系统会为你匹配实力相当对手！\n你的选择是战力碾压还是智慧征服？'
                hideHand = true;
                fun = function(){
                    self.showGuide(MainPageUI.getInstance())
                    MainPageUI.getInstance()['currentPage'] = 3;
                    MainPageUI.getInstance().scrollToCurrentPage();
                    MainPageUI.getInstance().renewPage();
                };
                break;
            case 15:
                if(ui != MainPageUI.getInstance())
                    return;
                mc = this.getMainRect()
                text = '修正场中的PK将不会受玩家战力高低的影响，只要你有实力，新手一样能打败老鸟！'
                hideHand = true;
                fun = function(){
                    self.showGuide(MainPageUI.getInstance())
                };
                break;
            case 16:
                if(ui != MainPageUI.getInstance())
                    return;
                mc = ui['collectBtn']
                text = '你可以在【收集】中，利用你获得的资源对你的卡牌进行提升。只有战力上去了，你才能在试练场和竞技场中走得更远！'
                fun = function(){
                    MainPageUI.getInstance()['currentPage'] = 0;
                    MainPageUI.getInstance().scrollToCurrentPage();
                    MainPageUI.getInstance().renewPage();
                    self.showGuide()
                };
                break;
            case 17:
                text = '好了，游戏的基础功能就介绍到这里，但还有更多有趣玩法需要你在游戏中慢慢发掘，88~'
                fun = function(){
                    self.isGuiding = false;
                    GuideUI.getInstance().hide();
                };
                break;
            default:
                return;
        }
        this.guideStep ++;
        GuideUI.getInstance().show(mc,text,fun,hideHand)
    }

    private getMainRect(){
        var h = Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = (GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }

}
