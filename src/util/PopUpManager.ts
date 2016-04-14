/**
 *
 * @author 
 *
 */
class PopUpManager {
    private static shape:eui.Rect;
	public constructor() {
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
    }

    public static removePopUp(display: egret.DisplayObject) {
        if(display.parent) {
            var index = display.parent.getChildIndex(display);
            //GameManager.container.removeChildAt(index - 1);
            display.parent.removeChild(display);
            this.testShape();
        }
    }

    public static testShape(){
        if(this.shape.parent)
        {
            var index = this.shape.parent.getChildIndex(this.shape);
            if(index == this.shape.parent.numChildren-1 && index >0)//在最上层
            {
                this.shape.parent.swapChildrenAt(index,index-1)
            }
        }
    }
}
