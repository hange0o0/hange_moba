/**
 *
 * @author 
 *
 */
class PopUpManager {
    private static shape:egret.Shape;
	public constructor() {
	}
	
    public static addPopUp(display: egret.DisplayObject,isWindow:boolean){
        var ww = GameManager.container.width;
        var hh = GameManager.container.height;
        if(!this.shape)
        {
            this.shape = ShapeObject.createRect(0x000000,0,0,ww,hh);
            this.shape.alpha = 0.7;
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
            if(this.shape.parent)
            {
                index = this.shape.parent.getChildIndex(this.shape);
                if(index == this.shape.parent.numChildren-1)//在最上层
                {
                    this.shape.parent.swapChildrenAt(index,index-1)
                }
            }
        }
    }
}
