/**
 *
 * @author 
 *
 */
class PopUpManager {
	public constructor() {
	}
	
    public static addPopUp(display: egret.DisplayObject,isWindow:boolean){
        var ww = GameManager.container.width;
        var hh = GameManager.container.height;
        var shape = ShapeObject.createRect(0x000000,0,0,ww,hh);
        shape.alpha = 0.7;
        shape.touchEnabled = true;
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
            GameManager.container.removeChildAt(index - 1);
            display.parent.removeChild(display);
        }
    }
}
