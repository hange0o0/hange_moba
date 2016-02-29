/**
 *
 * @author 
 *
 */
class ObjectUtil {
	public constructor() {
	}
		
	public static arrayToObj(array:Array<any>, key:string, value:any):any{
    	key = key || "key";
    	value = value || "value";
    	var o: any = {};
    	for(var s in array){
        	var o2 = array[s];
        	if(value == '@whole')
            	o[o2[key]] = o2;
            	else
            	o[o2[key]] = o2[value];
    	}
    	return o;
	}
    	
    public static objToArray(obj:any):Array<any>{
        var list = [];
        for(var key in obj)
            list.push(obj[key]);
        return list;
    }
    
        	
    public static objLength(obj: any): number {
        var count = 0;
        for(var key in obj)
            count++;
        return count;
    }

	public static clone (source) {
		return JSON.parse(JSON.stringify(source))    //++add   临时
	}

	public static addClickEvent(btn: egret.DisplayObject, fun:any, thisObject:any):void{
        if(btn) {
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,touchBegin,thisObject);
            btn["clickFun_touchBegin"] = touchBegin;
            btn["clickFun_touchEnd"] = touchEnd;

            var startX: number,startY: number;
            function touchBegin(e: egret.TouchEvent) {
                startX = e.stageX;
                startY = e.stageY;
                btn.addEventListener(egret.TouchEvent.TOUCH_END,touchEnd,thisObject);
            }
            function touchEnd(e: egret.TouchEvent) {
                btn.removeEventListener(egret.TouchEvent.TOUCH_END,touchEnd,thisObject);

                var endX: number,endY: number;
                endX = e.stageX;
                endY = e.stageY;
                //10px以内不响应
                if(Math.abs(endY - startY) > 10 || Math.abs(endX - startX) > 10) return;
                if(fun) fun.apply(thisObject,[e]);
            }
        }
		
	}
    public static removeClickEvent(btn: egret.DisplayObject,fun: any,thisObject: any): void {
        if(btn) {
            btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,btn["clickFun_touchBegin"],thisObject);
            btn.removeEventListener(egret.TouchEvent.TOUCH_END,btn["clickFun_touchEnd"],thisObject);
        }
    }
}
