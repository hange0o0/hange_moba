/**
 *
 * @author
 *
 */
class GuideUI extends game.BaseContainer{
    private tipsBg: eui.Rect;
    private tipsGroup: eui.Group;
    private tipTxt: eui.Label;
    private anyClick: eui.Label;
    private handMC: eui.Image;
    private stopClickGroup: eui.Group;
    private topRect: eui.Group;
    private leftRect: eui.Group;
    private rightRect: eui.Group;
    private bottomRect: eui.Group;
    private soundBtn: eui.Image;




    private clickFun
    private textIn
    private textIndex


    private static instance: GuideUI;
    public static getInstance() {
        if(!this.instance) this.instance = new GuideUI();
        return this.instance;
    }
    
    public constructor() {
        super(); 
        this.skinName = "GuideSkin";
        //GameManager.stage.addEventListener(egret.Event.RESIZE,this.resizeFun,this);
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);
        this.addBtnEvent(this.soundBtn,this.onSoundClick);

        this.stopClickGroup.touchEnabled = false;
        this.tipsBg.touchEnabled = false;

        this.handMC.x = this.handMC.y = 0

    }

    private onSoundClick(e){
        e.stopImmediatePropagation()
        SoundManager.getInstance().soundPlaying = SoundManager.getInstance().bgPlaying = !SoundManager.getInstance().bgPlaying
        this.renewSound();
    }


    private onClick(){
        if(this.textIndex < this.textIn.length)
        {
            this.textIndex = this.textIn.length
            this.testAnyClickShow();

             return;
        }
        if(this.clickFun)
        {
            //this.hide();
            this.clickFun();
        }

    }

    private testAnyClickShow(){
        if(this.clickFun != null)
        {
            this.anyClick.visible = true;
            this.anyClick.alpha = 0;
            var tw = egret.Tween.get(this.anyClick,{loop:true});
            tw.to({alpha:1},500).wait(500).to({alpha:0},500)
        }
    }

    private handMove(){
        this.handMC.anchorOffsetX = 70
        this.handMC.anchorOffsetY = 30
        var tw:egret.Tween = egret.Tween.get(this.handMC,{loop:true});
        tw.to({anchorOffsetX:90,anchorOffsetY:-10},500).to({anchorOffsetX:70,anchorOffsetY:30},500)
    }
    private handStop(){
        egret.Tween.removeTweens(this.handMC)
    }

    public showText(text){
        this.textIndex = 1;
        this.textIn = text || '';
        this.tipTxt.removeEventListener(egret.Event.ENTER_FRAME,this.onText,this)
        if(text.length > this.textIndex)
        {
            this.tipTxt.addEventListener(egret.Event.ENTER_FRAME,this.onText,this)
        }
        this.onText();
    }

    public onText(){
        var str =  this.textIn.substr(0,this.textIndex);
        var lastChar = str.substr(-1);
        if(lastChar == '[' || lastChar == ']')
        {
            this.textIndex ++;
            str =  this.textIn.substr(0,this.textIndex);
        }
        str = str.replace(/\[/g,'<font color="#E0A44A">').replace(/\]/g,'<\/font>')
        this.setHtml(this.tipTxt,str);
        this.textIndex ++;
        if(this.textIndex > this.textIn.length)
        {
            this.tipTxt.removeEventListener(egret.Event.ENTER_FRAME,this.onText,this)
            this.testAnyClickShow();
        }
    }

    public hide(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this.anyClick)
        this.handStop();
    }

    public showHand(mc){
        var rect = mc.getBounds();
        var p1 = mc.localToGlobal(rect.x, rect.y);
        var p2 = mc.localToGlobal(rect.x + rect.width, rect.y + rect.height);

        this.handMC.x = p1.x + (p2.x - p1.x) / 2
        this.handMC.y = p2.y//p1.y + (p2.y - p1.y) / 2
        GameManager.container.addChild(this.handMC);
        this.handMC.visible = true;
        this.handMC.rotation = 0;
        this.handMove();
    }
    public hideHand(){
        this.handStop();
        MyTool.removeMC(this.handMC);
    }

    private renewSound(){
        if( SoundManager.getInstance().soundPlaying)
            this.soundBtn.source = 'v18_png'
        else
            this.soundBtn.source = 'v19_png'
    }

    public show(dataIn){
        this.renewSound();





        var mc = dataIn.mc;
        var text = dataIn.text;
        var fun = dataIn.fun;
        var hideHand = dataIn.hideHand;
        var toBottom = dataIn.toBottom;
        this.addChild(this.handMC);
        this.handStop();
        this.tipTxt.text = '';
        this.tipTxt.removeEventListener(egret.Event.ENTER_FRAME,this.onText,this)
        egret.callLater(function(){
            GameManager.container.addChild(this);
            this.height = GameManager.stage.stageHeight;
            this.tipTxt.text = '';
            this.clickFun = fun;

            this.anyClick.visible = false;
            this.anyClick.anchorOffsetX = 0;
            egret.Tween.removeTweens(this.anyClick);
            //this.anyClick.visible = fun != null;

            //if(GuideManager.getInstance().guideStep == 1)
            //{
                this.tipsGroup.alpha = 1;
                this.showText(text);
            //}
            //else
            //{
            //    this.tipsGroup.alpha = 0;
            //    var tw:egret.Tween = egret.Tween.get(this.tipsGroup);
            //    tw.wait(200).to({alpha:1},200).call(function(){
            //        this.showText(text);
            //    },this)
            //}

            if(mc)
            {
                if(mc instanceof egret.Rectangle)
                {
                    //this.setBG(mc.x,mc.y,mc.width,mc.height,fun == null);
                    var p1:any = new egret.Point(mc.x,mc.y)
                    var p2:any = new egret.Point(mc.x + mc.width,mc.y + mc.height)
                }
                else
                {
                    var rect = mc.getBounds();
                    var p1 = mc.localToGlobal(rect.x,rect.y);
                    var p2 = mc.localToGlobal(rect.x + rect.width,rect.y + rect.height);

                }
                //console.log(p1,p2)
                this.setBG(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y,fun == null);
                if(toBottom)
                    this.tipsGroup.y = GameManager.stage.stageHeight - this.tipsGroup.height;
                //if(fun == null)
                //    mc.once(egret.TouchEvent.TOUCH_TAP,this.hide, this);


                this.handMC.visible = !hideHand;
                var toX = p1.x + (p2.x-p1.x)/2;
                var toY = p2.y + 20
                var toRotation = 0
                if(this.tipsGroup.y < toY) //指针在下半屏
                {
                    toRotation = 180
                    toY = p1.y - 20
                }
                if(this.handMC.x == 0 && this.handMC.y == 0)
                {
                    this.handMC.x = toX;
                    this.handMC.y = toY;
                    this.handMC.rotation = toRotation;
                    this.handMove();
                }
                else
                {
                    if(this.handMC.rotation == toRotation && toX == this.handMC.x && toY == this.handMC.y)
                    {
                        toRotation += 360;
                    }
                    var tw:egret.Tween = egret.Tween.get(this.handMC);
                    tw.to({x:toX,y:toY,rotation:toRotation},200).call(this.handMove,this)
                }


            }
            else
            {
                this.setBG(320,GameManager.stage.stageHeight/2,0,0,fun == null);
                this.handMC.visible = false;
            }

            this.addChild(this.soundBtn);
        },this)

    }

    public setBG(x,y,width,height,itemClick?){
        var x2 = 640-x-width;
        var y2 = GameManager.stage.stageHeight - y-height
        var borderWidth = Math.max(x,y,x2,y2)

        this.tipsBg.strokeWeight = borderWidth
        this.tipsBg.width = borderWidth*2 + width;
        this.tipsBg.height = borderWidth*2 + height;
        this.tipsBg.x =  -(borderWidth - x)
        this.tipsBg.y =  -(borderWidth - y)

        if(itemClick)
        {
            this.addChild(this.stopClickGroup);
            this.topRect.height = Math.max(0,y);
            this.leftRect.width = Math.max(0,x);
            this.rightRect.width = Math.max(0,x2);
            this.bottomRect.height = Math.max(0,y2);
            this.touchEnabled = false;
        }
        else
        {
            MyTool.removeMC(this.stopClickGroup)
            this.touchEnabled = true;
        }


        if(height == 0)
        {
            this.tipsGroup.y = (GameManager.stage.stageHeight - this.tipsGroup.height)/5*2
        }
        else if(y2 > y)//点在上方
        {
            this.tipsGroup.y = (y2 - this.tipsGroup.height)/2 + y + height
        }
        else
        {
            this.tipsGroup.y = (y-this.tipsGroup.height)/2
        }


    }

    public setTips(str){

    }


}
