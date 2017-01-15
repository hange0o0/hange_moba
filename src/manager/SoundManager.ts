/**
 *
 * @author 
 *
 */
class SoundManager {
    private static instance: SoundManager;

    public constructor() {
        this.init();
    }

    public static getInstance(): SoundManager {
        if(!this.instance)
            this.instance = new SoundManager();
        return this.instance;
    }
    //默认关闭音乐
    private _soundPlaying: boolean = false;
    private _bgPlaying: boolean = false;
    private _openShake: boolean = true;
    private _isPlayMovie: boolean = true;
    private _isMessage: boolean = true;

    private currentChannel:egret.SoundChannel;
    private currentKey :string;
    private isLoad:boolean=false;

    public pkKey = [];
    // private tween:egret.Tween
    
    private init(){
        if(!App.isMobile){//pc上默认开音乐
            this._soundPlaying = true;
            this._bgPlaying = true;
        }

        if(Config.isDebug)
        {
            this._soundPlaying = true;
            this._bgPlaying = true;
        }

        var som = SharedObjectManager.instance;
        if(som.getValue("sound") != undefined)
            this._soundPlaying = som.getValue("sound");
        if(som.getValue("bgsound") != undefined)
            this._bgPlaying = som.getValue("bgsound");

        if(som.getValue("openShake") != undefined)
            this._openShake = som.getValue("openShake");
        if(som.getValue("playMovie") != undefined)
            this._isPlayMovie = som.getValue("playMovie");
        if(som.getValue("showMessage") != undefined)
            this._isMessage = som.getValue("showMessage");

        this.isLoad=this._soundPlaying;
    }

    public get soundPlaying(){
        // if(!Config.isDebug && !Config.testSound) return false;
        return this._soundPlaying
    }
    public get bgPlaying(){
        // if(!Config.isDebug && !Config.testSound) return false;
        return this._bgPlaying
    }
    public get openShake(){
        return this._openShake
    }
    public get isPlayMovie(){
        return this._isPlayMovie
    }
    public get isMessage(){
        return this._isMessage
    }

    public set soundPlaying(v){
        if(this._soundPlaying!=v)
            SharedObjectManager.instance.setValue("sound",v)
        if(!this.isLoad && v){
            RES.loadGroup("musicEffect");
            this.isLoad  = true;
        }
        this._soundPlaying = v;
    }
    public set bgPlaying(v){
        if(this._bgPlaying!=v){
            SharedObjectManager.instance.setValue("bgsound",v);
        }
        this._bgPlaying= v;

        if(!v ){
            this.stopBgSound();
        }
        else{
            this.playSound(SoundConfig.b101);
        }
    }
    public set openShake(v){
        if(this._openShake!=v)
            SharedObjectManager.instance.setValue("openShake",v)
        this._openShake= v;
    }
    public set isPlayMovie(v){
        if(this._isPlayMovie!=v)
            SharedObjectManager.instance.setValue("playMovie",v)
        this._isPlayMovie= v;
    }
    public set isMessage(v){
        if(this._isMessage!=v)
            SharedObjectManager.instance.setValue("showMessage",v)
        this._isMessage= v;
    }

    public addBtnClickEffect(btn:egret.DisplayObject){
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            this.playBtn();
        },this)
    }

    public playBtn(){
        this.playEffect(SoundConfig.f207);
    }

    public stopBgSound(){
        try{
            // if(this.tween){
            //     this.tween.pause();
            //     this.tween = null;
            // }
            if(this.isQzonePlay){
                window["QZAppExternal"].stopBackSound();
                this.onSoundComplete();
                return;
            }
            egret.clearTimeout(this.playTime);
            if(this.currentChannel){
                egret.Tween.removeTweens(this.currentChannel);
                this.currentChannel.stop();
            }
            this.onSoundComplete();
        }catch(e){}
    }

    public playEffect(v:string, delay:number = 0){
        if(!this.soundPlaying) return;

        try{
            if(this.isQzonePlay){
                window["QZAppExternal"].playLocalSound(this.getSoundObject(v));
                return;
            }
            v += "_mp3"
            var sound:egret.Sound = RES.getRes(v);
            if(sound) sound.play(0,1);
            else
            {
                RES.createGroup('sound', [v], true);
                RES.loadGroup("sound");
            }
        }
        catch(e){
        }
    }

    private tempLoop:number;
    public playSound(key:string, loop:number = 5999){
        if(!this.bgPlaying) return;

        var url = Config.localResRoot + "music/" + key +".mp3"
        if(this.currentKey == url) return;
        this.currentKey=url;
        
        try{
            if(this.isQzonePlay){
                window["QZAppExternal"].playLocalBackSound(this.getMusicObject(key));
                return;
            }
            this.tempLoop = loop;
            /*if(this.currentChannel && this.currentKey == url){
                return;
            }

            this.currentKey=url*/

            var loader: egret.URLLoader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            loader.addEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
            loader.load(new egret.URLRequest(url));
        }
        catch(e){
        }
    }

    /************************************************************************************************** */
    /* 测试QQ空间 播放音乐 注意必必须预加载才能播放
    private testQzonePay(){
        var op = {
            'id':'bg_01_index',
            'url': 'http://space2.flash8f.com/resource/music1/12_treasure_ten.mp3',
            'bid': 0,
            'loop':2,
            'refresh': false
        }
        window["QZAppExternal"].preloadSound(function(evt){
            window["QZAppExternal"].playLocalSound(op);
            //window["QZAppExternal"].playLocalBackSound(op);
            //alert(evt.code + "---"+ op.bid);
        }, op);
    }*/

    private getSoundObject(soundID){
        var baseUrl = Config.localResRoot + "music/"
        return{
            'id':soundID,
            'url': baseUrl +  soundID +'.mp3',
            'bid': 0,
            'refresh': false,
            'loop': 0
        }
    }
    private getMusicObject(soundID){
        var oo:any = this.getSoundObject(soundID);
        oo.loop = -1;
        return oo;
    }

    public get isQzonePlay(){
        return false;
        // return Config.openQzonSound && !Config.isTouch && (getQzoneVerCode()>=40600);//qzone 4.6支持
        //return !Config.isTouch && (getQzoneVerCode()>=40600);//qzone 4.6支持
    }
    
    public preLoad(){
        var self = this;
        var index = 0;
        var nameList = ["b101","b102","b103","b104",
            "f201","f202","f203","f204","f205","f206","f207","f208","f209","f210","f211","f212","f213","f214","f215","f216",
            "f301","f302","f303","f304","f305","f306","f307","f308","f309","f310","f311","f312","f313","f314","f315","f316",
            "f317","f318","f319","f320","f321","f322","f323"];


        var data = {groups:[],resources:[]}
        var arr = data.resources;
        var keysArr = this.pkKey = [];
        var addResources = function(name,path){
            arr.push({
                "name":name + "_mp3",
                "type":"sound",
                "url": path
            })
            keysArr.push(name + "_mp3");
        }

        this.pkKey.push('f211_mp3');
        for(var i=0;i<nameList.length;i++){
            var op = this.getSoundObject(nameList[i]);
            if(nameList[i].indexOf('f') == 0)       {
                addResources(nameList[i], "music/" + nameList[i]+'.mp3')
                if(nameList[i].indexOf('f3') == 0)
                    this.pkKey.push(nameList[i] + "_mp3")
            }

            index ++;
            (function(op){
                egret.setTimeout(function(){
                    self.preLoadOne(op);
                }, this,100*index)
            })(op)
        }
        if(!this.isQzonePlay) {
            RES.parseConfig(data, Config.localResRoot);
            //RES.createGroup('sound', keysArr, true);
            //RES.loadGroup("sound");
        }




    }
    private preLoadOne(op){
        try{
            var self = this;
            if(this.isQzonePlay){
                window["QZAppExternal"].preloadSound(function(evt){
                    var url = Config.localResRoot + "music/" + op.id + ".mp3";
                    if(self.currentKey == url){
                        self.playSound(op.id);
                    }
                }, op);
                return;
            }
        }
        catch(e){}
    }
    /************************************************************************************************** */
    
    private playTime:number;
    private onLoadComplete(event: egret.Event): void {
        egret.clearTimeout(this.playTime);

        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        var self = this;
        try{
            this.onLoadError(event);
            if((this.currentKey && loader.data.url != this.currentKey) || !this._bgPlaying)
                return;
            if(this.currentChannel){
                // if(self.tween){//正在开始播
                //     egret.Tween.removeTweens(self.currentChannel);
                //     self.currentChannel.stop();
                //     self.tween = null;
                // }
                // self.tween = egret.Tween.get(this.currentChannel).to({volume:0},500).call(()=>{
                //     try{
                //         self.tween = null;
                //         if(self.currentChannel)
                            self.currentChannel.stop();
                            self.currentChannel=null;

                            if(!self._bgPlaying)return;
                            this.playTime = egret.setTimeout(fun, this, 150);
                            // fun();
                    // }
                    // catch(e){
                    // }
                // })
            }
            else
                fun();
        }
        catch(e){
        }

        function fun(){
            var sound: egret.Sound = <egret.Sound>loader.data;
            var channel: egret.SoundChannel = sound.play(0,self.tempLoop);
            // channel.volume =0;
            self.currentChannel = channel;
            // self.tween = egret.Tween.get(channel).to({volume:1},500).call(
            //     ()=>{
            //         self.tween = null;
            //     }
            // )
            channel.addEventListener(egret.Event.SOUND_COMPLETE, self.onSoundComplete, self);
        }

    }

    private onSoundComplete(event?:egret.Event):void {
        this.currentChannel = null;
        this.currentKey = null;
    }

    private onLoadError(event: egret.Event): void {
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        loader.removeEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
        loader.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
    }
    
    public fillData(d:Array<any>):void{
        if(d) {
            for(var i:number = 0;i < d.length;i++) {
                switch(d[i]["id"]) {
                    case 1:
                        this.soundPlaying = d[i]["num"] == 1;
                        break;
                    case 2:
                        this.bgPlaying = d[i]["num"] == 1;
                        break;
                    case 3:
                        this.openShake = d[i]["num"] == 1;
                        break;
                    case 4:
                        this.isPlayMovie = d[i]["num"] == 1;
                        break;
                    case 5:
                        this.isMessage = d[i]["num"] == 1;
                        break;
                }
            }
        }
    }
    /*public updateSetting(ids: Array<any>){
        var o:Array<any> =[];
        if(ids){
            for(var i = 0 ; i < ids.length;i++){
                switch(ids[i]){
                    case 1:
                        o.push({id:1,num:this.soundPlaying?1:0});
                        break;
                    case 2:
                        o.push({id:2,num:this.bgPlaying?1:0});
                        break;
                    case 3:
                        o.push({id:3,num:this.openShake?1:0});
                        break;
                    case 4:
                        o.push({id:4,num:this.isPlayMovie?1:0});
                        break;
                    case 5:
                        o.push({id:5,num:this.isMessage?1:0});
                        break;
                }
            }
        }
        else{
            o.push({id:1,num:this.soundPlaying?1:0});
            o.push({id:2,num:this.bgPlaying?1:0});
            o.push({id:3,num:this.openShake?1:0});
            o.push({id:4,num:this.isPlayMovie?1:0});
//            o.push({id:6,num:this.isLover?1:0});
            o.push({id:5,num:this.isMessage?1:0});
        }
        Net.instance.sendData(ServerEvent.sys.setting,{ data: o },null,false);
    }*/
}

class SoundConfig {
    public static b101: string = "b101";
    public static b102: string = "b102";
    public static b103: string = "b103";
    public static b104: string = "b104";
    public static f201: string = "f201";
    public static f202: string = "f202";
    public static f203: string = "f203";
    public static f204: string = "f204";
    public static f205: string = "f205";
    public static f206: string = "f206";
    public static f207: string = "f207";
    public static f208: string = "f208";
    public static f209: string = "f209";
    public static f210: string = "f210";
    public static f211: string = "f211";
    public static f212: string = "f212";
    public static f213: string = "f213";
    public static f214: string = "f214";
    public static f215: string = "f215";
    public static f216: string = "f216";
    public static f301: string = "f301";
    public static f302: string = "f302";
    public static f303: string = "f303";
    public static f304: string = "f304";
    public static f305: string = "f305";
    public static f306: string = "f306";
    public static f307: string = "f307";
    public static f308: string = "f308";
    public static f309: string = "f309";
    public static f310: string = "f310";
    public static f311: string = "f311";
    public static f312: string = "f312";
    public static f313: string = "f313";
    public static f314: string = "f314";
    public static f315: string = "f315";
    public static f316: string = "f316";
    public static f317: string = "f317";
    public static f318: string = "f318";
    public static f319: string = "f319";
    public static f320: string = "f320";
    public static f321: string = "f321";
    public static f322: string = "f322";
    public static f323: string = "f323";
}
