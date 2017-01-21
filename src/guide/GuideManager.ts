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
    private guideArr = [];
    public constructor() {
        this.init();
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

    private init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){self.showGuide()},
            text:'欢迎来到卡斗士的乐园，在这里你会感受到不一样的卡牌对决的乐趣！现在，就让我们进入这趟神奇之旅吧！',
        })

        this.addGuideObj({
            mc:"MainPageUI.getInstance()['mainGame']['startBtn']",
            text:'试练场是检测玩家实力的地方，玩家实力越强，将会走得越远。\n现在，我们开始第一次PK',
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"this.getMainGameRect()",
            text:'我们已经得到系统给的卡组了，先观察一下对手的卡组，以方便我们制定合适的战术',
            fun:function(){self.showGuide(MainGameUI.getInstance())}
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"MainGameUI.getInstance()['chooseBtn0']",
            text:'来，我们去布阵吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'【人鱼战士】是一张不错的卡，我们就选它出战吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'虽然多次出战会花费更多的符文，但我觉得这张卡值这个价',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(6)['useBtn']",
            text:'我觉得我们还需要一张肉盾，就选它吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['h3']",
            text:'我肉盾当然要站在前排才能发挥最大价值，让我们为它来调整一下出场顺序吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['a1']",
            text:'点这里把它插到最前面',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(7)['useBtn']",
            text:'虽然我觉得这样的阵型足以打败对手了，但既然还有符文剩余，就多上张牌保险一点吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['pkBtn']",
            text:'好了，是时候让对手见识一下我们的厉害了，GO！GO！GO！',
        })

        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            mc:"PKResultUI.getInstance()['list']",
            text:'是不是很简单？如果想了解更详尽的PK过程，可以点击下方的对战信息进行查看',
            fun:function(){self.showGuide(PKWinUI.getInstance())}
        })

        this.addGuideObj({
            ui:"PKWinUI.getInstance()",
            mc:"PKWinUI.getInstance()['okBtn']",
            text:'复盘还是先放一放，反正首页那里还有回放按钮，现在还是先退回首页了解一下其它功能吧',
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"MainPageUI.getInstance()['collectBtn']",
            text:'你可以在【收集】中，利用你获得的资源对你的卡牌进行提升。只有战力上去了，你才能在试练场和竞技场中走得更远！',
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['list'].getChildAt(1)",
            text:'你刚才是不是觉得【人鱼战士】挺厉害的？我们就让它更厉害一点吧',
        })

        this.addGuideObj({
            ui:"MonsterList.getInstance()",
            mc:"MonsterList.getInstance()['info']['levelUpBtn']",
            text:'升级【人鱼战士】的时候，我们的其它卡牌也会有一定的提升哦',
        })

        this.addGuideObj({
            ui:"MonsterList.getInstance()",
            mc:"MonsterList.getInstance()['topUI']['closeBtn']",
            text:'升完级是不是觉得自己害很多呢，想再去挑战一下其它玩家吧？让我们再看看游戏的其它对战功能吧',
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['topUI']['closeBtn']",
            text:'别急，再点一下',
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"this.getMainRect()",
            text:'每日任务每天会刷出10关让玩家进行挑战，通过积累任务积分会获得永久的战力加成奖励，是每天绝不能错过的玩法！',
            hideHand:true,
            fun:function(){
                self.showGuide(MainPageUI.getInstance())
                MainPageUI.getInstance()['currentPage'] = 2;
                MainPageUI.getInstance().scrollToCurrentPage();
                MainPageUI.getInstance().renewPage();
            }
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"this.getMainRect()",
            text:'在竞技场中，系统会为你匹配实力相当对手！\n你的选择是战力碾压还是智慧征服？',
            hideHand:true,
            fun:function(){
                self.showGuide(MainPageUI.getInstance())
                MainPageUI.getInstance()['currentPage'] = 3;
                MainPageUI.getInstance().scrollToCurrentPage();
                MainPageUI.getInstance().renewPage();
            }
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"this.getMainRect()",
            text:'修正场中的PK将不会受玩家战力高低的影响，只要你有实力，新手一样能打败老鸟！',
            hideHand:true,
            fun:function(){
                self.showGuide()
            }
        })



        this.addGuideObj({
            text:'好了，游戏的基础功能就介绍到这里，但还有更多有趣玩法需要你在游戏中慢慢发掘，88~',
            fun:function(){
                self.isGuiding = false;
                GuideUI.getInstance().hide();

                MainPageUI.getInstance()['currentPage'] = 0;
                MainPageUI.getInstance().scrollToCurrentPage();
                MainPageUI.getInstance().renewPage();
            }
        })

    }

    private addGuideObj(obj){
        this.guideArr.push(obj);
    }

    private guideFun(ui){
        var self = this;
        var data = this.guideArr[this.guideStep];
        var mc = data.mc;
        if(mc && typeof mc == 'string')
            mc = eval(mc);
        var fun = data.fun;
        var text = data.text;
        var hideHand = data.hideHand || false;

        var testUI = data.ui
        if(testUI && typeof testUI == 'string')
            testUI = eval(testUI);

        if(testUI && ui != testUI)
            return;
        this.guideStep ++;
        GuideUI.getInstance().show(mc,text,fun,hideHand)
    }

    private getMainRect(){
        var h = Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = (GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }

    private getMainGameRect(){
        return new egret.Rectangle(0,80,640,340);
    }

}
