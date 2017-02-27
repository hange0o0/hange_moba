class MyTool {
    public constructor() {
    }

    public static maxUserHead = 82;

    public static randomName(){
        var len = Math.floor(Math.random()*3) + 2;
        var s = '';
        var wLen = BadWords.NAME_WORDS.length;
        while(len--)
        {
            s += BadWords.NAME_WORDS.charAt(Math.floor(Math.random()*wLen));
        }
        return  s;
    }
    public static getHeadUrl(id){
        return Config.localResRoot + 'user_head/user_head'+id+'.png';
    }
    public static removeMC(mc:any){
        if(mc.parent)
            mc.parent.removeChild(mc)
    }

    public static getDis(a,b){
        return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5)
    }

    public static changeGray(mc){
        var colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        mc.filters = [colorFlilter];
    }

    //加载时隐藏，加载完显示
    public static setImgSource(img,source){
        img.visible = false;
        img.once(egret.Event.COMPLETE,this.onImgComplete,this); //写在外部，防止重复调用
        img.source = source;
    }
    private static onImgComplete(e){
       e.currentTarget.visible = true;
    }

    public static toFixed(v:any,length){
        var str = v.toFixed(length)
        var char = str.charAt(str.length-1);
        while(char == '0' || char == '.')
        {
            str = str.substr(0,str.length - 1)
            if(char == '.')
                break;
            char = str.charAt(str.length-1);
        }
        return str
    }




    //得到数据变化过程数组
    public static getValueChangeArray(from,to,times,noInt=false){
         var array = [];
        for(var i=0;i<times;i++)
        {
           var v = from + (to - from)/times*(i + 1);
            if(!noInt)
                v = Math.floor(v);
            array.push(v)
        }
        return array;
    }


    //长按监听
    public static addLongTouch(mc:any,fun,thisObj?){
        mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,onTouchStart,thisObj);
        var x,y;
        var timer = -1;
        function onTouchStart(e){
            mc.stage.once(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
            timer = egret.setTimeout(onTouchTimer,thisObj,600);
            x = e.stageX
            y = e.stageY
        }
        function onTouchTimer(){
            if(Math.abs(x - GameManager.stageX) > 10 || Math.abs(y - GameManager.stageY) > 10)
                return;
             fun.apply(thisObj,[mc]);
        }
        function onTouchEnd(){
            egret.clearTimeout(timer);
        }
    }

    //双击监听
    public static addDoubleTouch(mc:any,fun,thisObj?){
        mc.addEventListener(egret.TouchEvent.TOUCH_TAP,onClick,thisObj,false,100);
        var timer = -1;
        function onClick(e){
            if(egret.getTimer() - timer < 500)
            {
                e.stopPropagation();
                fun.apply(thisObj);
            }
            timer = egret.getTimer();
        }
    }

    public static setHtml(txt,str){
        txt.textFlow = new egret.HtmlTextParser().parser(str);
    }

    public static myHitTest(item,x,y){
        var p1 = item.localToGlobal(0,0)
        var p2 = item.localToGlobal(item.width,item.height);
        return p1.x < x && x < p2.x &&  p1.y < y && y < p2.y;
    }

    public static changeToChinese(num){
        var s = String(num);
        var arr1 = ['','一','二','三','四','五','六','七','八','九']
        var arr2 = ['十','百','千','万']

        var ss="";
        var temp = s.split('');
        var index = 0;
        for(var i=temp.length-1;i>=0;i--)
        {
            ss =  arr1[temp[i]] + ss
            if(i != 0)
            {
                ss = arr2[index] + ss
                index++;
            }

        }
        return ss;

    }

    public static addTestBlock(mc){
        var item = new egret.Sprite()
        mc.addChild(item);
        item.graphics.beginFill(0);
        item.graphics.drawRect(0,0,10,10);
        item.graphics.endFill();
    }

    //把单个字符翻译为数字
    public static str2Num(str){
        var code = str.charCodeAt(0);
        if(code < 58)
            return code - 48;
        if(code < 91)//65+26
            return code - 55//code - 65 + 10
        return  code - 61//code-97+10+26
    }


    public static replaceEmoji(str){
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ];
        return str.replace(new RegExp(ranges.join('|'), 'g'), '');
    }
}



