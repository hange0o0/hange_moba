/**
 *
 * @author 
 *
 */
class PopUpManager {
    public static shape:eui.Rect;
	public constructor() {
	}

    public static movieChange(oldWindow,newWindow,rota){
        this.removeShape();
        //MyTool.upMC(oldWindow)
        //MyTool.upMC(newWindow)
        newWindow.x = rota*640;
        oldWindow.visible = true
        newWindow.visible = true;
        egret.Tween.removeTweens(oldWindow);
        egret.Tween.removeTweens(newWindow);
        var tw:egret.Tween = egret.Tween.get(oldWindow);
        tw.to({x:-rota*640},300).call(function(){
            oldWindow.hide();
        },this)
        var tw:egret.Tween = egret.Tween.get(newWindow);
        tw.to({x:0},300)
    }

    public static removeShape(){
        MyTool.removeMC(this.shape);
    }
	
    public static addPopUp(display: egret.DisplayObject,isWindow:boolean){
        var ww = GameManager.container.width;
        var hh = GameManager.container.height;
        if(!this.shape)
        {

            this.shape = new eui.Rect();
            this.shape.width = 640;
            this.shape.fillColor = 0;
            this.shape.fillAlpha = 0.7;

            this.shape.top = 0
            this.shape.bottom = 0
            this.shape.touchEnabled = true;
            this.shape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this)
        }
        var shape = this.shape;
        GameManager.container.addChild(shape);
        GameManager.container.addChild(display);
        if(isWindow) {
//            console.log(display.width,display.height);
            display.x = (ww - display.width) / 2;
            display.y = (hh - display.height) / 2;
            
            display.addEventListener(egret.Event.ENTER_FRAME,onEnterFrame,this);
        }
        
        function onEnterFrame() {
            display.removeEventListener(egret.Event.ENTER_FRAME,onEnterFrame,this);
            
//            console.log(display.width,display.height);
            display.x = (ww - display.width) / 2;
            display.y = (hh - display.height) / 2;
        }

        this.testVisible();
    }

    private static onTap(){
         var ui:game.BaseUI = <game.BaseUI>this.shape.parent.getChildAt(this.shape.parent.numChildren-1);
        if(ui.canBGClose)
        {
            ui.hide();
        }
    }

    public static removePopUp(display: egret.DisplayObject) {
        if(display.parent) {
            var index = display.parent.getChildIndex(display);
            //GameManager.container.removeChildAt(index - 1);
            display.parent.removeChild(display);
            this.testShape();
            this.testVisible();
        }
    }

    public static testShape(){
        if(this.shape.parent)
        {
            MyTool.removeMC(this.shape)
            //找到最上一个BaseUI,放到其下方
            for(var i=GameManager.container.numChildren-1 ;i>=0;i--)
            {
                var ui = GameManager.container.getChildAt(i);
                if(ui instanceof game.BaseWindow)
                {
                    GameManager.container.addChildAt(this.shape,i)
                    return
                }
            }

        }
    }

    public static testVisible(){
        var setVisible = false;
        for(var i=GameManager.container.numChildren-1 ;i>=0;i--)
        {
            var ui = GameManager.container.getChildAt(i);
            if(ui instanceof game.BaseUI)
            {
                if(!setVisible)
                {
                    ui.visible = true;
                    if(!ui.isWindow)
                        setVisible = true;
                }
                else if(ui.hideVisible)
                    ui.visible = true;
                else
                    ui.visible = false;
            }
        }
    }

    public static showToMain(){
        while(true)
        {
            for(var i=GameManager.container.numChildren-1 ;i>=0;i--)
            {
                var ui = GameManager.container.getChildAt(i);
                if(ui instanceof game.BaseUI)
                {
                    if(ui == MainPageUI.getInstance())
                    {
                        return;
                    }
                    ui.hide();
                    break;
                }
            }
        }
    }


    public static hideAll(){
        while(true)
        {
            var isHide = false
            for(var i=GameManager.container.numChildren-1 ;i>=0;i--)
            {
                var ui = GameManager.container.getChildAt(i);
                if(ui instanceof game.BaseUI)
                {
                    isHide = true;
                    ui.hide();
                    break;
                }
            }
            if(!isHide)
                return;
        }
    }
}
