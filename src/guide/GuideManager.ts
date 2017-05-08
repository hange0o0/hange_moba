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

    public enableScrollV(scroller){
        scroller.scrollPolicyV = this.isGuiding? eui.ScrollPolicy.OFF:eui.ScrollPolicy.AUTO
    }

    public showGuide(ui?){
        if(!this.isGuiding)
            return;
        if(ui)
            ui.validateNow();
        MyTool.stopClick(500);
        egret.callLater(this.guideFun,this,ui);
    }

    private init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){
                MainPageUI.getInstance().onGuide0()
                self.showGuide()
            },
            text:'亲爱的'+UM.nick+'，欢迎来到卡士世界！你想成为世界上最强大的卡士吗？你想成为那万众瞩目的唯一吗？那么，现在就让卡卡来带领你，踏上这成为至强王者之路吧！',
        })


        this.addGuideObj({
            mc:"MainPageUI.getInstance()['mainGame']['startBtn']",
            text:'我们先来卡士公会作个实力认证吧。他们是卡士世界最权威的认证机构，他们的认证结果能反映每位卡士的真实能力！',
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"this.getMainGameRect()",
            text:'现在我们已经得到系统发牌员派发的卡组了，感觉还不错。我们也观察一下对手的卡组，方便我们制定合适的战术',
            fun:function(){
                MainGameUI.getInstance().scrollToEnd();
                self.showGuide(MainGameUI.getInstance())
            }
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"MainGameUI.getInstance()['chooseBtn0']",
            text:'看来对手的实力不怎么样嘛，就让我们去打败它吧！点击[挑战]按钮，进入布阵环节！',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'卡卡觉得【人鱼战士】是一张不错的卡牌，我们就选它出战吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'虽然重复出战会花费更多的符文，但卡卡觉得这张卡牌值这个价',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['sortBtn']",
            text:'卡卡觉得我们还需要一张张大的肉盾，看看有啥合适的？点击排序按钮，调整为按血量排序',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'这个肉盾血量够多，那就选它吧。',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['h3']",
            text:'肉盾当然要站在前排才能发挥最大价值，让我们为它来调整一下出场顺序吧。',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['a1']",
            text:'点这里可以把它移到最前面，当然你也可以通过拖动来完成这个操作。',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(1)['useBtn']",
            text:'虽然卡卡觉得这样的阵型足以打败对手了，但既然还有符文剩余，那就保险一点多出战一张牌吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['pkBtn']",
            text:'好了，是时候让对手见识一下我们的厉害了，GO！GO！GO！',
        })

        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            mc:"new egret.Rectangle(0,600+(GameManager.stage.stageHeight - 960)/2,640,360)",
            text:'是不是很简单？如果想了解更多的PK信息，可以多关注一下下方的内容，里面可是包罗万有的哦~',
            fun:function(){
                PKResultUI.getInstance().guideScroll();
                //self.showGuide(PKWinUI.getInstance())
            }
        })

        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            mc:"PKResultUI.getInstance().list.getChildAt(0)",
            text:'我对第一轮的PK结果不是很满意耶，明明我比对手强那么多！让我们看看在这轮PK过程中，到底发生了什么',
        })

        this.addGuideObj({
            ui:"PKWinUI.getInstance()",
            mc:"PKWinUI.getInstance()['backBtn']",
            text:'哦，原来如此，虽然没有想像中的大胜，但我们至少还是赢了，对不对？那么，现在请跟随卡卡回到世界首页，了解一下其它功能吧',
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"MainPageUI.getInstance().videoBtn",
            text:'刚才我们的对战是可以在这个地方再重温一下的，如果有需要的话你可以再进去看一下。但现在，请让你用最神圣的态度来面对我们将要进行的事情，就是--',
            fun:function(){
                self.showGuide(MainPageUI.getInstance())
            }
        })


        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"MainPageUI.getInstance()['collectBtn']",
            text:'花钱！！！刚才我们在PK中不是获得了一些卡牌碎片和金币吗，我们可以用它来在【收集】中对卡牌进行升级。卡卡想想都有点小兴奋呢~',   //只有战力上去了，你才能在试练场和竞技场中走得更远！
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['list'].getChildAt(1)",
            text:'卡卡觉得【人鱼战士】真的挺厉害的，我强烈建议我们要把第一次送给了它，让它变得更厉害一点吧',
        })

        this.addGuideObj({
            ui:"MonsterList.getInstance()",
            mc:"MonsterList.getInstance()['info']['levelUpBtn']",
            text:'卡卡告诉你一个小秘密，升级单张卡牌的时候，我们的总战力也会得到同步提升，这可是会增强所有卡牌的对战实力的哦',
        })

        this.addGuideObj({
            ui:"MonsterList.getInstance()",
            mc:"MonsterList.getInstance()['topUI']['closeBtn']",
            text:'升完级是不是觉得自己牛X了很多呢，想再去挑战一下其它卡士吧？没问题让我们再看看其它的对战功能吧',
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['topUI']['closeBtn']",
            text:'我们可是要回到世界首页哦',
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"this.getMainRect()",
            text:'究极研究院的老怪物们最喜欢挑战高难度的事情了，他们每天都会发布10个题目让全世界玩家共同挑战。经常参与他们的活动，会获得永久的战力奖励哦！',
            hideHand:true,
            toBottom:true,
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
            text:'在天梯竞技场中，系统会为你匹配实力相当真实玩家作为对手！你的选择是战力碾压还是智慧征服？卡卡是比较喜欢碾压带来的快感的..',
            hideHand:true,
            toBottom:true,
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
            text:'虚空修正场要挑选出最有天赋的卡士，在里面的PK将不会受到卡士真实战力的影响，只要有能力，卡士一样能打败卡皇！',
            hideHand:true,
            toBottom:true,
            fun:function(){
                self.showGuide(MainPageUI.getInstance())
            }
        })

        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"MainPageUI.getInstance().mapBtn",
            text:'野外世界布满的卡士世界黑暗势力的据点，他们的存在严重威胁了卡士世界的和平与稳定，作为正义的一方，我们有义务把他消灭掉！卡卡希望你在以后的日子中也能为我们的世界多出点力',
            fun:function(){
                self.showGuide()
            }
        })



        this.addGuideObj({
            text:'好了，现在你对这个世界已有了一定的了解了吧，但其实还有更多未知的领域需要你在世界中慢慢去探索哦。卡卡我现在还要去引领下一位极有天赋的卡士，就此别过，88~',
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
        var guideData:any = {};
        guideData.mc = data.mc;
        if(guideData.mc && typeof guideData.mc == 'string')
            guideData.mc = eval(guideData.mc);
        guideData.fun = data.fun;
        guideData.text = data.text;
        guideData.toBottom = data.toBottom;
        guideData.hideHand = data.hideHand || false;

        var testUI = data.ui
        if(testUI && typeof testUI == 'string')
            testUI = eval(testUI);

        if(testUI && ui != testUI)
            return;
        this.guideStep ++;
        GuideUI.getInstance().show(guideData)
    }

    private getMainRect(){
        var h = Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = (GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }

    private getMainGameRect(){
        return new egret.Rectangle(0,80,640,390);
    }

}
