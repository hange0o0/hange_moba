
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

    private groupData = {}

    private static instance:LoadingFile;
    public static getInstance() {
        if (!this.instance) this.instance = new LoadingFile();
        return this.instance;
    }

    public constructor() {
        this.loadingView = new LoadingUI();
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

        this.loadingView.show();
        
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);

        this.groupData = {};
        for(var i = 0;i < array.length; i++){

            this.groupData[array[i]] = {
                current:0,
                total:RES.getGroupByName(array[i]).length
            }
            RES.loadGroup(array[i]);
        }
        
    }


    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(this.loadFiles.indexOf(event.groupName) == -1)
            return;
        this.loadCount--;
        
        if (this.loadCount == 0) {

            this.loadingView.hide();
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
        if(this.loadFiles.indexOf(event.groupName) == -1)
            return;
        this.groupData[event.groupName].current = event.itemsLoaded;
        var current = 0
        var total = 0
        for(var s in this.groupData)
        {
            current += this.groupData[s].current
            total += this.groupData[s].total
        }

        this.loadingView.setProgress(current, total);
    }

}


