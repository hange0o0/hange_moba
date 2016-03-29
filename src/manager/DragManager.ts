class DragManager {
    public constructor() {
    }

    private static _instance: DragManager;

    public static getInstance():DragManager{
        if(!this._instance)
            this._instance = new DragManager();
        return this._instance;
    }

    private startPos;
    private currentDrag;
    private dragDes;
    //设置该MC可拖动
    public setDrag(mc,lockCenter=true){
        mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        mc.lockCenter = lockCenter;
    }

    private onBegin(e:egret.TouchEvent){

        this.currentDrag = e.currentTarget;
        this.currentDrag.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.currentDrag.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)

        console.log(e.localX)
        this.startPos = {x:e.stageX,y:e.stageY};
        this.dragDes = {x:this.currentDrag.x,y:this.currentDrag.y}
        if(this.currentDrag.lockCenter)
            this.dragDes = {x:this.currentDrag.x + (e.localX -this.currentDrag.width/2),y:this.currentDrag.y + e.localY - this.currentDrag.height/2}
    }

    private onMove(e:egret.TouchEvent){
        if(!this.startPos.drag)
        {
            if(Math.abs(e.stageX - this.startPos.x) > 10 || Math.abs(e.stageY - this.startPos.y) > 10)
            {
                this.startPos.drag = true;
                this.currentDrag.dispatchEventWith('start_drag',false,{x:e.stageX,y:e.stageY});
            }
        }
        if(this.startPos.drag)
        {
            if(!this.currentDrag.stopMove)
            {
                this.currentDrag.x = e.stageX-this.startPos.x + this.dragDes.x;
                this.currentDrag.y = e.stageY-this.startPos.y + this.dragDes.y;
            }
            this.currentDrag.dispatchEventWith('move_drag',false,{x:e.stageX,y:e.stageY});
        }
    }

    private onEnd(e:egret.TouchEvent){
         if(this.startPos.drag)
         {
             this.currentDrag.dispatchEventWith('end_drag');
         }
        this.endDrag();
    }

    private endDrag(){
       if(this.currentDrag)
       {
           this.currentDrag.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
           this.currentDrag.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
           this.currentDrag = null;
       }
    }
}
