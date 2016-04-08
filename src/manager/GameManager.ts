class GameManager {
    private static _instance:GameManager;
    public static getInstance():GameManager {
        if (!this._instance)
            this._instance = new GameManager();
        return this._instance;
    }

    private timeID: egret.Timer;
    private lastTime: number;
	public constructor() {
        this.timeID = new egret.Timer(1000);
        this.timeID.addEventListener(egret.TimerEvent.TIMER,this.timerun,this);
        this.timeID.start();
	}
	
    public static stage:egret.Stage;
    public static container:egret.DisplayObjectContainer;

    private timerun(): void {
        var now = TM.now();
        if(!this.lastTime) {
            this.lastTime = now;
            return;
        }
        if(!DateUtil.isSameDay(this.lastTime,now))//跨0点
        {
            EM.dispatch(GameEvent.client.energy_change);

        }

    }

    //取现在到晚上12点还差的时间
    public getZeroCD(){
        var d= DateUtil.timeToChineseDate(TM.now());
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        d.setHours(24);

        return Math.floor(d.getTime()/1000) - TM.now();
    }
}


class App {
    public static touchEvent: string = egret.TouchEvent.TOUCH_TAP;
    
    public constructor() {
    }
    	
    public static get isMobile():boolean{
        return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
    }
    public static get isAndroid():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return ua.indexOf('android') != -1;
    }
    public static get isIOS():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return /ip(ad|hone|od)/.test(ua);
    }
}

var _get = {};
var url = location.hash || location.search;
var splitStr = location.hash ? '#' : '?';
if (url.indexOf(splitStr) != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
        var a = strs[i].split("=");
        var k = a[0];
        var v = a[1];
        _get[k] = v;
    }
}