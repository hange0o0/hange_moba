class FromManager {
    private static _instance:FromManager;
    public static getInstance():FromManager {
        if (!this._instance)
            this._instance = new FromManager();
        return this._instance;
    }

    public get isTapTap(){
        return _get['from'] == 'taptap';
    }
}