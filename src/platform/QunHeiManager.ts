class QunHeiManager {
    private static _instance:QunHeiManager;
    public static getInstance():QunHeiManager {
        if (!this._instance)
        {
            this._instance = new QunHeiManager();
            this._instance.sdk = window['qhsdk'];
        }
        return this._instance;
    }

    public sdk

    public initData(){
        var initdata = {
            "username":_get['username'],//用户id，群黑登录接口里面username参数
            "gid":'3697',//群黑游戏id，可以在后台游戏列表查询
        };
        this.sdk.init(initdata);
    }

    public login(){
        _get['serverid']
        var LM = LoginManager.getInstance();
    }
}