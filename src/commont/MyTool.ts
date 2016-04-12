class MyTool {
    public constructor() {
    }

    public static randomName(){
        return  'n'+Math.floor(Math.random()*999999);
    }
    public static getHeadUrl(id){
        return   'head_'+1 + '_jpg'
    }
    public static removeMC(mc:any){
        if(mc.parent)
            mc.parent.removeChild(mc)
    }

    //得到最常用的10个怪
    public static getCommonUse(list){
        if(!list)
            return [];
        var obj = {};

        var array = [];
        for(var i=0;i<list.length;i++)
        {
            var temp = list[i].split(',');
            for(var j=0;j<temp.length;j++)
            {
                var id = temp[j];
                obj[id] =  (obj[id] || 0) + 1;
            }
        }

        for(var s in obj)
        {
            array.push({id:s,num:obj})
        }

        ArrayUtil.sortByField(array,['num','id'],[1,0])
        array.length = Math.min(10,array.length);
        for(var i=0;i<array.length;i++)
        {
           array[i] = {vo:MonsterVO.getObject(array[i].id),type:1};
        }

        return array;
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

        var timer = -1;
        function onTouchStart(){
            mc.once(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
            timer = egret.setTimeout(onTouchTimer,thisObj,800);
        }
        function onTouchTimer(){
             fun.apply(thisObj);
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
            if(egret.getTimer() - timer < 200)
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
}



