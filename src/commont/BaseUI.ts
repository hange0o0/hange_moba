
module game {

    /**
    *  界面基类
    */
    export class BaseContainer extends eui.Component {
        
        
        public constructor(skinName?:string) {
            super();
            
            if(skinName)
                this.skinName = skinName;
        }
                    
        public childrenCreated() {
        }
                    
        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
        }
        
        public getImg(name:string):eui.Image{
            return <eui.Image>this[name];
        }

        public getLabel(name: string): eui.Label {
            return <eui.Label>this[name];
        }

        public getText(name: string): egret.TextField {
            return <egret.TextField>this[name];
        }

        public getButton(name: string): eui.Button {
            return <eui.Button>this[name];
        }

        public getItem(name: string): game.BaseItem {
            return <game.BaseItem>this[name];
        }

                
        /*
        * 设置html  
        * this.setHtml(this.txt,"<font color=0xff0000>五23424</font>");
        */ 
        public setHtml(txt:eui.Label, str:string):void{
            txt.textFlow = new egret.HtmlTextParser().parser(str);
        }  
                
        /*
        * 给按钮添加事件  
        * this.addBtnEvent(this.btn, this.btnClick);
        */ 
        public addBtnEvent(btn: egret.DisplayObject, fun:any, thisObject?:any):void{
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,fun,thisObject || this);
        }

        /*
        * 给按钮移除事件  
        * this.removeBtnEvent(this.btn, this.btnClick);
        */ 
        public removeBtnEvent(btn: egret.DisplayObject, fun:any, thisObject?:any):void{
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, fun, thisObject || this);
        }
        
    }
    
    
    /**
    *  界面基类
    */
    export class BaseUI extends game.BaseContainer {
        
        public LoadFiles: Array<string>;//加载文件配置['party', 'js_xxxxx'];
        private isStartLoad: boolean = false;
        
        private static UIshowList: any = {};
        public BaseTypeList: Array<number> = [];//页面模块配置，主要用来控制全局调用
        public isInitUI: boolean = true;//是否已经初始化完皮肤
        
        private _arguments: Array<any>;
        private sizeList: Array<any> = [];

        private isWindow: boolean = false;
        public isHideFlag:boolean = true;
                
        public constructor(isWindow?:boolean) {
            super();
            this.isWindow = isWindow;
            if(!this.isWindow)
                GameManager.stage.addEventListener(egret.Event.RESIZE,this.onResize,this);
        }
                    
                    
        public childrenCreated() {
            this.isInitUI = true;
            
            if(!this.isWindow)
                this.onResize(null);
            
//            if(this.parent){
//                this.addEventListener(egret.Event.ENTER_FRAME,this.createComplete,this);
//            }
        }
        private createComplete(e:egret.Event){
            this.removeEventListener(egret.Event.ENTER_FRAME,this.createComplete,this);
            if(this._arguments)
                this.onShow.apply(this,this._arguments);
            else
                this.onShow();
        }
                    
        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
        }
                    
        /*public show(){
        eui.PopUpManager.addPopUp(this,true);
        this.verticalCenter = -700;
        egret.Tween.get(this).to({verticalCenter:0} , 500 , egret.Ease.backOut);
                            
        }*/
        
        
            
        public addListenerSizeY(list:Array<any>):void{
            while(list.length > 0){
                this.sizeList.push({ui:list.pop(), type:"y"});
            }
        }
        public addListenerSizeH(list:Array<any>):void{
            while(list.length > 0){
                this.sizeList.push({ui:list.pop(), type:"h"});
            }
        }

        public resizeFun(){

        }
        
        public onResize(e:Event):void{
//            console.log(GameManager.stage.stageWidth, GameManager.stage.stageHeight)
//            console.log(GameManager.stage.width, GameManager.stage.height)
            this.height = GameManager.stage.stageHeight;
            var item: any;
            for(var i = 0;i < this.sizeList.length; i++){
                /*
                item = this.sizeList[i];
                if(item.type == "h"){
                    item.ui.height = GameManager.stage.stageHeight - item.ui.y;
                }
                else if(item.type == "y"){
                    item.ui.y = GameManager.stage.stageHeight - item.ui.height;
                }*/
            }
            if(this.parent)
                this.resizeFun();
        }
            
        public cacheFunArguments(...argument:any[]):void{
            this._arguments = argument;
        }
                            
        public onShow(...argument:any[]):any{
            return this;      
        }
                        
                        		
        public show():any{
            if(this.LoadFiles && this.LoadFiles.length > 0){
                if(this.isStartLoad) return;
                this.isStartLoad = true;
                new LoadingFile().load(this.LoadFiles, this.showFun, this);
                this.LoadFiles = [];
                return;
            }
            this.showFun();
            
            return this;
        }
        
        private showFun():void{
            this.isStartLoad = false;
            
            if(this.BaseTypeList){
                for(var i=0; i<this.BaseTypeList.length; i++){
                    var _type = this.BaseTypeList[i];
                    if( !BaseUI.UIshowList[ _type ]){
                        BaseUI.UIshowList[ _type ] = [];
                    }
                    if(BaseUI.UIshowList[ _type ].indexOf(this) == -1)
                        BaseUI.UIshowList[ _type ].push(this);
                }
            }
            //1102
//            this.invalidateSkinState();
//            eui.PopUpManager.addPopUp(this,true);
            PopUpManager.addPopUp(this,this.isWindow);
            
            if(this.isInitUI){
                this.isHideFlag = false
                if(this._arguments)
                    this.onShow.apply(this,this._arguments);
                else
                    this.onShow();
            }
            BaseUI.setStopEevent();
        }

        public isHide():boolean{
            return this.isHideFlag
        }
                    
        public hide():any{
            if(this.BaseTypeList){
                for(var i=0; i<this.BaseTypeList.length; i++){
                    var _type = this.BaseTypeList[i];
                    var list = BaseUI.UIshowList[ _type ];
                    if( list ){
                        for(var j=list.length - 1; j>=0; j--){
                            if(list[j] == self)
                                list.splice(j, 1);
                        }
                    }
                }
            }

            this.isHideFlag = true;
            //1102
//            eui.PopUpManager.removePopUp(this);
//            this.validateSkinState();
            PopUpManager.removePopUp(this);
            
            return this;
        }
        
        private onAddToStage(event:egret.Event) {
            console.log(222);
        }
        
        // 批量关闭UI， 用法：this.BaseTypeList = [1, 2];
        // 1xxxx 2xxxx
        public static hideType = function(type){
            var list = BaseUI.UIshowList[type];
            if(list){
                for(var i=list.length-1; i>=0; i--){
                    list[i].hide();
                }
            }
        }
        
        //用来记录和判断一个界面打开后 禁止马上响应交互事件（最常见的是触摸屏幕关闭界面）
        private static openTime: number;
        public static get isStopEevent():boolean{
            return (Date.now() - BaseUI.openTime < 400); //面板打开后500秒内不响应交互事件（触摸、单击） 
        }
        
        public static setStopEevent() {
            BaseUI.openTime = Date.now();
        }
        
        public paySound(key:string, delay?:number):void{
            
        }
                
    }
    
    /**
    *  界面基类
    */
    export class BaseWindow extends game.BaseUI {

        public constructor() {
            super(true);
        }
    }
    
    export class BaseItem extends eui.ItemRenderer {
        public constructor() {
            super();

        }
        
        /*
        * 设置html  
        * this.setHtml(this.txt,"<font color=0xff0000>五23424</font>");
        */ 
        public setHtml(txt:eui.Label, str:string):void{
            txt.textFlow = new egret.HtmlTextParser().parser(str);
        }
                        
        /*
        * 给按钮添加事件  
        * this.addBtnEvent(this.btn, this.btnClick);
        */ 
        public addBtnEvent(btn:eui.UIComponent, fun:any, thisObject?:any):void{
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, fun, thisObject || this);
        }

                                
        /*
        * 给按钮移除事件  
        * this.removeBtnEvent(this.btn, this.btnClick);
        */ 
        public removeBtnEvent(btn:eui.UIComponent, fun:any, thisObject?:any):void{
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, fun, thisObject || this);
        }
                
    }

}
