class HelpManager {
    private static _instance:HelpManager;

    public static getInstance():HelpManager {
        if (!this._instance)
            this._instance = new HelpManager();
        return this._instance;
    }

    public mainHelp(){
        HelpUI.getInstance().show({
            title:'试练场说明',
            list:[
                'adfadfasdf',
                'adfadfasdf'
            ]
        });
    }

    public dayHelp(){
        HelpUI.getInstance().show({
            title:'今日挑战说明',
            list:[
                'adfadfasdf',
                'adfadfasdf'
            ]
        });
    }

    public serverHelp(){
        HelpUI.getInstance().show({
            title:'竞技场说明',
            list:[
                'adfadfasdf',
                'adfadfasdf'
            ]
        });
    }

    public serverEqualHelp(){
        HelpUI.getInstance().show({
            title:'修正场说明',
            list:[
                'adfadfasdf',
                'adfadfasdf'
            ]
        });
    }
}