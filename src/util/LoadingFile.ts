
class LoadingFile {

    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView:LoadingUI;
    private loadFiles:Array<string>;
    private callBack: any;
    private callBackTarget: any;
    private loadCount: number;

    public constructor() {
    }

    /*
     * array ['party', 'js_xxxxx'];
     */ 
    public loadGroup(array:Array<string>, callBack:any, callBackTarget:any):void {
        
        this.loadFiles = array;
        this.callBack = callBack;
        this.loadCount = array.length;
        this.callBack = callBack;
        this.callBackTarget = callBackTarget;
        
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        GameManager.stage.addChild(this.loadingView);
        
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        
        for(var i = 0;i < array.length; i++){
                RES.loadGroup(array[i]);
        }
        
    }


    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        this.loadCount--;
        
        if (this.loadCount == 0) {
            GameManager.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            
            this.callBack.call(this.callBackTarget);
        }
    }

    private onResourceLoadError(event:RES.ResourceEvent):void {
        console.warn("Group:" + event.groupName + " has failed to load");
    }

    private onResourceProgress(event:RES.ResourceEvent):void {
        this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
    }

}


