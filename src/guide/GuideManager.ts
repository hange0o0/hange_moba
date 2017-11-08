/**
 *
 * @author 
 *
 */
class GuideManager {
    private static _instance: GuideManager;
    public currentStepId: Number;
    public isGuiding:boolean=true;

    public temp;


    public guideKey;
    public guideStep = 0;

    public guideRandom = 0;
    public guidePK = 0;


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
        this.guideKey = ''
        if(ui)
            ui.validateNow();
        MyTool.stopClick(300);
        egret.callLater(this.guideFun,this,ui);
    }

    public reInit(){
        this.guideRandom = 0;
        this.guidePK = 0;
        this.guideArr[0].text = '亲爱的['+UM.nick+']，欢迎来到卡士世界！'
    }

    private init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){
                self.showGuide()
            },
            text:'亲爱的['+UM.nick+']，欢迎来到卡士世界！',
        })

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'你想成为世界上最强大的卡士吗？卡卡现在将带领你踏上这成为[至强王者]之路！',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'但在这之前，我们必需得弄清一个问题：[什么是卡士?]',
        //})
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'在卡卡看来，所谓的卡士，可以比作是卡兵中的[司令]。',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'他利用手中有限的卡兵进行[排兵布阵]，制定出战顺序后，就让队伍按照他的计划作战，最终为他取得胜利',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'他[不需要参与]到具体的战斗，但却影响了整个的战斗流程，最考验其[运筹帷幄]的能力了',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'不是每个人都有能力做好这件事情，到底你适不适合这样的工作，卡卡要对你进行一下[考查]',
        //})


        this.addGuideObj({
            mc:"MainPageUI.getInstance()['mainGame']['startBtn']",
            text:'[卡士公会]是卡士世界最权威的认证机构，让我们先在这里作个职业认证吧！',
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"this.getMainGameRect()",
            text:'在上方区域呈现的是我们[对手的卡兵]，了解对方的兵阵能方便我们制定合适的战术',
            fun:function(){
                //MainGameUI.getInstance().scrollToEnd();
                self.showGuide(MainGameUI.getInstance())
            }
        })
        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"this.getMainGameRect2()",
            text:'而下方区域是我们[本轮]所能出战的[兵种]，我们将在其中[挑选合适的]以组成我们的出战部队',
            fun:function(){
                //MainGameUI.getInstance().scrollToEnd();
                self.showGuide(MainGameUI.getInstance())
            }
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"MainGameUI.getInstance()['chooseBtn0']",
            text:'在了解双方的兵力对比后，卡卡觉得我们应该很轻松就能取得胜利了！点击[挑战]按钮，进入布阵环节！',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'卡卡觉得[【人鱼战士】]是一个不错的卡兵，我们就选它出战吧',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'虽然[重复出战]会花费[更多]的符文，但卡卡觉得这卡兵值这个价',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['sortBtn']",
            text:'卡卡觉得我们还需要一位强大的肉盾！点击[排序按钮]，调整为[按血量排序]，看看谁是最肉的？',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['list'].getChildAt(0)['useBtn']",
            text:'这个肉盾血量果然够多，那就选它吧。',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['h3']",
            text:'肉盾当然要站在前面才能发挥最大价值，让我们为它来[调整]一下出场顺序吧。',
        })

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['a1']",
            text:'点这里可以把它移到最前面，当然你也可以通过[拖动]来完成这个操作。',
        })

        //this.addGuideObj({
        //    ui:"PKDressUI.getInstance()",
        //    mc:"PKDressUI.getInstance()['list'].getChildAt(1)['useBtn']",
        //    text:'虽然卡卡觉得这样的阵型足以打败对手了，但既然还有符文剩余，那就保险一点多出召唤一位卡兵吧',
        //})

        this.addGuideObj({
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['pkBtn']",
            text:'好了，是时候让对手见识一下我们的厉害了，GO！GO！GO！',
            guideKey:'pk',
        })

        this.addGuideObj({
            text:'当怒气值满后，将会释放怒气技',
            mc:"PKMainUI.getInstance().mpBar1",
            hideHand:true,
            guideKey:'pk',
            fun:function(){
                PKMainUI.getInstance().continueGuide();
                GuideUI.getInstance().hide()
            }
        })

        this.addGuideObj({
            text:'战斗过程采用的是车轮战方式，当一方出战单位败亡后，由下一单位顶上',
            guideKey:'pk',
            fun:function(){
               PKMainUI.getInstance().continueGuide();
                GuideUI.getInstance().hide()
            }
        })

        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            //mc:"new egret.Rectangle(0,600+(GameManager.stage.stageHeight - 960)/2,640,360)",
            text:'啊啊啊？！！怎么会输了，这对[新人]也太不友好了！这个对决卡卡是很有信心的啊，[为什么]呢？！！',
            fun:function(){
                PKResultUI.getInstance().guideScroll();
                MyTool.stopClick(500);
                //self.showGuide(PKWinUI.getInstance())
            }
        })

        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            mc:"PKResultUI.getInstance().pkResultGroup.list.getChildAt(1)",
            text:'卡卡刚才开了点小差，没看仔细，让我们一起回顾一下在这轮[关键的]PK过程中，到底发生了什么?',
        })

        this.addGuideObj({
            fun:function(){
                self.showGuide(PKFailUI.getInstance())
            },
            text:'哦，原来如此，想不到[堕天使]和[僵尸法师]还能组成这么厉害的COMBO！卡卡又学到一招了！',
        })

        this.addGuideObj({
            ui:"PKFailUI.getInstance()",
            mc:"PKFailUI.getInstance()['backBtn']",
            text:'但我们就这样子认输了吗？不！我们刚才只是大意了而已！我们的目标是成为至强王者，这样的小失败并[不能]阻挡我们的脚步',
        })
            ////////

        this.addGuideObj({
            fun:function(){
                self.showGuide(MainPageUI.getInstance())
            },
            text:'将军的强大固然是取胜的关键，但没有[强大的士兵]，胜利也是遥不可及的',
        })


        this.addGuideObj({
            ui:"MainPageUI.getInstance()",
            mc:"MainPageUI.getInstance()['collectBtn']",
            text:'我们在对战中会获得了一些[卡兵碎片]和[金币]，我们可以用它来对卡兵进行[升级]。',   //只有战力上去了，你才能在试练场和竞技场中走得更远！
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['list'].getChildAt(1)",
            text:'卡卡觉得[【人鱼战士】]真的挺厉害的，我强烈建议我们要把第一次送给了它，让它变得更厉害一点吧',
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['monsterBase']['levelUpBtn']",
            text:'虽然我们只升级单个卡兵，但我们的[总战力]也是会得到同步提升，这可是会增强[所有卡兵]的对战实力的哦',
        })

        this.addGuideObj({
            ui:"CollectUI.getInstance()",
            mc:"CollectUI.getInstance()['topUI']['closeBtn']",
            text:'升完级是不是觉得自己强大了很多呢，让我们再去重新挑战一下吧',
        })


        this.addGuideObj({
            mc:"MainPageUI.getInstance()['mainGame']['startBtn']",
            text:'卡卡相信我们这次必定能通过职业考核的',
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"MainGameUI.getInstance()['chooseBtn0']",
            text:'为了弥补刚才的失误，卡卡现在要把压箱技能都告诉你。点击[挑战]按钮，开始学习卡卡的独门绝招吧！',
        })


        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['randomBtn']",
            text:'看到这个[随机]按钮没，点一下它，系统会给我们随机配置[卡符使用最大化]的队伍，试试看吧',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['randomBtn']",
            text:'卡卡感觉这个布阵组成不咋样的，再点一下看有没更好的选择',
        })

        this.addGuideObj({
            toBottom:true,
            guideKey:'randomBtn',
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['randomBtn']",
            text:'怎么都是[【暗影杀手】]，就没有卡卡喜欢的[【人鱼战士】]呢，我们[【向上拖动】]随机按钮，可以打开自定义面板哦',
        })


        this.addGuideObj({
            fun:function(){
                self.showGuide(PKDressUI.getInstance())
            },
            mc:"PKDressUI.getInstance()['pkDressSettingUI']",
            toBottom:true,
            text:'在这个设置面板中，我们可以告诉系统我们的[布阵需求]，从而能生成[符合]我们[预期]的卡组',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressSettingUI']['h0']['addBtn']",
            text:'[【人鱼战士】]是必须得出战！点击[+]号，可让系统为我们最少出战一个[【人鱼战士】]',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressSettingUI']['h0']['addBtn']",
            text:'一个[【人鱼战士】]怎么够呢，再点一下，让系统为我们出战两个[【人鱼战士】]吧',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressSettingUI']['h3']['decBtn']",
            text:'卡卡觉得[【暗影杀手】]不太适合我们这次战斗，就不要出战了吧。点击[-]号，系统将不会为我们出战[【暗影杀手】]',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressSettingUI']['pkBtn']",
            text:'好了，让我们看看系统能为我们推荐什么阵容呢',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['randomBtn']",
            text:'这个阵容虽然感觉还不错，但卡卡还是想试试有没有更好的',
        })

        this.addGuideObj({
            toBottom:true,
            ui:"PKDressUI.getInstance()",
            mc:"PKDressUI.getInstance()['pkDressChooseUI']['pkBtn']",
            text:'三个[【人鱼战士】]！！漂亮！！这样应该能赢了吧？点击[挑战]试试看吧。。。(心虚ing)',
        })

        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            fun:function(){
                self.showGuide(PKResultUI.getInstance())
            },
            text:'是不是很简单就赢了，[【人鱼战士】]果然是最强大的！',
        })
        this.addGuideObj({
            ui:"PKResultUI.getInstance()",
            mc:"PKWinUI.getInstance()['backBtn']",
            text:'看来你还是挺有本事的，卡卡相信你能成为强大的卡士。',
        })

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"MainPageUI.getInstance().videoBtn",
        //    text:'哎呀，刚才太兴奋忘了看战报数据了！但不用担心，我们还可以在[PK记录]找到刚才的对战记录的。',
        //    hideHand:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //    }
        //})



        //this.addGuideObj({
        //    ui:"CollectUI.getInstance()",
        //    mc:"CollectUI.getInstance()['topUI']['closeBtn']",
        //    text:'我们可是要回到世界首页哦',
        //})

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'参与[究极研究院]的活动，会获得[永久的战力]奖励。',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 2;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    },
        //})

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    mc:"this.getMainRect()",
        //    hideHand:true,
        //    toBottom:true,
        //    text:'因为经常参与他们的活动，会获得[永久的战力]奖励。所以卡卡建议你[每天]都来冲刺一下自己的极限！',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 2;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    },
        //    mc:"this.getMainRect()",
        //    hideHand:true,
        //    toBottom:true,
        //    text:'如果实在打不过，也可以与[其它卡士]交流一下，因为你们的题目是[一样的]！',
        //})

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'你的士兵们会不停地清剿[野外势力]，为你赢取功勋！',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 3;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    }
        //})

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 3;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    },
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    hideHand:true,
        //    toBottom:true,
        //    text:'但这种体力活并[不需要]你来[亲自出手]，交给你的卡兵吧，只要他们足够[强大]，清剿起来速度还是会[很快]的',
        //})

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'在[天梯竞技场]中，系统会为你匹配实力相当[真实玩家]作为对手！你的选择是战力碾压还是智慧征服？卡卡是比较喜欢碾压带来的快感的..',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 4;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    }
        //})
        //
        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'[虚空修正场]要挑选出最有天赋的卡士，在里面的PK将[不会受到]卡士真实战力的影响，只要有能力，卡士一样能打败卡皇！',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //    }
        //})

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'哦，对了，还有一个重要的事情得提醒你一下：[不要]专注于升级某几个卡兵，[全面发展]才是卡士世界的主题！',
        //})
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'这可是很多新手卡士都会犯的错误哦，卡卡希望你能[避开]。',
        //})
        this.addGuideObj({
            fun:function(){
                self.showGuide()
            },
            text:'卡士世界的介绍到这里就暂告一段落了，当然还有很多未知的[区域]和[技巧]需要玩家你来好好探索',
        })

        this.addGuideObj({
            text:'卡卡希望你能在这里找到属于你的快乐，我会想念你的，88~',
            fun:function(){
                self.isGuiding = false;
                GuideUI.getInstance().hide();
                //MainPageUI.getInstance()['currentPage'] = 0;
                MainPageUI.getInstance()['mainTask'].visible = true;
                MainPageUI.getInstance()['helpGroup'].visible = true;
                //MainPageUI.getInstance().scrollToCurrentPage();
                //MainPageUI.getInstance().renewPage();
                GuideUI.getInstance().showHand(MainPageUI.getInstance()['mainTask'])
                MyCardTaskUI.getInstance().testShow();
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

        this.guideKey = data.guideKey

        var testUI = data.ui
        if(testUI && typeof testUI == 'string')
            testUI = eval(testUI);

        if(testUI && ui != testUI)
            return;
        this.guideStep ++;
        GuideUI.getInstance().show(guideData)
    }

    private getMainRect(){
        var h = GameManager.stage.stageHeight - 140 -260//Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = 140//(GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }

    private getMainGameRect(){
        return new egret.Rectangle(0,80,640,390);
    }

    private getMainGameRect2(){
        return new egret.Rectangle(0,80+390,640,GameManager.stage.stageHeight-80-100-390);
    }

}
