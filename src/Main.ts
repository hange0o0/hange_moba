//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var UM:UserManager,TM:TimeManager,EM:EventManager,CM:CacheManager;
class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
    protected createChildren(): void {
        super.createChildren();
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");


        UM = UserManager.getInstance();
        TM = TimeManager.getInstance();
        EM = EventManager.getInstance();
        CM = CacheManager.getInstance();
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
        if(_get['debug'] == 2)
            RES.loadGroup("gamepreload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;

            CM.initData(RES.getRes("data_json"));


            this.createScene();
        }
    }
    private createScene(){
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        //var button = new eui.Button();
        //button.label = "Click!";
        //button.horizontalCenter = 0;
        //button.verticalCenter = 0;
        //this.addChild(button);
        //button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);




        GameManager.stage = this.stage;
        GameManager.container = this;
        GameManager.getInstance().init();


        UM.openid = _get['openid'];
        //if(UM.openid == '1_10000')
        //    UM.landid = '1449731763';
        //else if(UM.openid == '1_10001')
        //    UM.landid = '1449732148';

        if(Config.isDebug && _get['host'] == 'com')
        {
            Config.host = '172.17.196.195:90';
        }

        if(_get['debug'] == 2)
        {
            LoginUI.getInstance().show();
            return;
        }

        //DebugUI.getInstance().show();
        //var dataIn = {
        //    vedio:1,   //从0开始
        //    team1:{"list":[101,102,101,101,101,101,101,101,101,101],"ring":{"id":1,"level":0}},
        //    team2:{"list":[101,101,101,101,101,101,101,101,101,101],"ring":{"id":1,"level":0}}
        //};

        var dataIn = RES.getRes("test_data_json");
        if(_get['host'] == 'com')
            Net.getInstance().serverHost = 'http://172.17.196.195:90/gameindex.php'
        else
            Net.getInstance().serverHost = 'http://hangegame.com/gameindex.php'

        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            if(dataIn.vedio == -1)
                return;

            PKManager.getInstance().onPK('test',msg) ;
            //var baseData = PKManager.getInstance().getVedioBase(dataIn.vedio - 1);
            VideoManager.getInstance().playVideo('test',dataIn.vedio)

            //console.log(PKManager.getInstance().getVedioBase(dataIn.vedio - 1));

            //VideoCode.getInstance().initData(PKManager.getInstance().pkData[0]);
            //Net.send('pk_vedio',baseData,function(data){
            //	var msg = data.msg;
            //	VideoManager.getInstance().initVideo(msg.pkdata);
            //    VideoCode.getInstance().play();
            //
            //	//console.log(VideoManager.getInstance().dataArray);
            //});
        });
    }

    private onButtonClick(e: egret.TouchEvent) {
        DebugUI.getInstance().show();
        //var panel = new eui.Panel();
        //panel.title = "Title";
        //panel.horizontalCenter = 0;
        //panel.verticalCenter = 0;
        //this.addChild(panel);
    }
}
