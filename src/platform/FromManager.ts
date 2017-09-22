class FromManager {
    private static _instance:FromManager;
    public static getInstance():FromManager {
        if (!this._instance)
            this._instance = new FromManager();
        return this._instance;
    }

    public from = 'abs'

    public get isTapTap(){
        return _get['from'] == 'taptap';
    }

    public get isQunHei(){
        return this.from == 'qunhei';
    }

    public initData(){
       if(this.isQunHei)
       {
            QunHeiManager.getInstance().initData()
       }
    }

    public login(){
        if(this.isQunHei)
        {
            QunHeiManager.getInstance().login()
            return true;
        }
        return false;
    }
}