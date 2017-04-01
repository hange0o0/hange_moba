class AppManager {
    private static _instance:AppManager;
    public static getInstance():AppManager {
        if (!this._instance)
            this._instance = new AppManager();
        return this._instance;
    }
    private list = [];
    public dealFinish = true;

    public playBG(mp3){
         this.callFun('playBG,'+mp3);
    }
    public stopBG(){
        this.callFun('stopBG');
    }
    public playEffect(mp3){
        this.callFun('playEffect,'+mp3);
    }

    //改得太快，APP响应不及时
    public callFun(fun){
        this.list.push(fun);
        if(this.dealFinish)
            this.actionApp();
    }

    public actionApp(){
        var fun = this.list.shift();
        if(fun)
        {
            this.dealFinish = false;
            window.location.href = 'jsbridge://' + fun;
        }
    }
}

function onAppResume(){
    SoundManager.getInstance().resumeSound();
}

function onAppPause(){
    SoundManager.getInstance().stopBgSound();
}

function onAppDealFinish(){
    AppManager.getInstance().dealFinish = true;
    AppManager.getInstance().actionApp();
}


