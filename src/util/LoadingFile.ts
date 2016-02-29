
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
    public load(array:Array<string>, callBack:any, callBackTarget:any):void {
        
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
            if(array[i].indexOf('js_') == -1)
                RES.loadGroup(array[i]);
            else{
                //js加载
            }
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

    private createScene():void {
            
        this.urlloader = new egret.URLLoader();
        this.urlloader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
//        this.urlloader.addEventListener(egret.Event.IO_ERROR, this.onError, this);
        
       // var url: string = Config.resource + "json/data.txt";
        var url: string = Config.cdn + "resource/data/data.js";
        if(Config.isDebug) url += "?m=" + Math.random();
        var urlreq:egret.URLRequest = new egret.URLRequest();
        urlreq.url = url;
        this.urlloader.load( urlreq );
    }
    
    private urlloader: egret.URLLoader;
    
    private onComplete(event:egret.Event):void
    {
//        CacheManager.getInstance().init(JSON.parse(this.urlloader.data));
    }
    
    private onError(event:egret.Event):void {
        console.log( event );
    }

}


