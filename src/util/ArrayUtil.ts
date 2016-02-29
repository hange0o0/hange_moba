class ArrayUtil {
	public constructor() {
	}
		
    /**
    * 数组排序（只支持数值大小比较）
    * 例子：sortByField(ff, ["score","level","exp"], [1,1,1]);
    * @param data 源数组
    * @param fields 字段名
    * @param type 字段排序规则[0,0,0....] 0表示从小到大,其他任何值都是从大到小
    */
    public static sortByField(data:Array<any>, fields:Array<any>, type:Array<any>):Array<any>
    {
        if(data && fields && type && fields.length == type.length)
        {
            var copy:Array<any> = fields.slice();//复制一份
            var copy2:Array<any> = type.slice();//复制一份
            data.sort(listSort);
        }
        
        function listSort(a:Object, b:Object):number
        {
            if(a != null && b != null)
            {
                fields = copy.slice();
                type = copy2.slice();
                while(fields.length > 0)
                {
                    if(<number>(a[fields[0]]) < <number>(b[fields[0]]))
                    {
                        return (type[0] == 0 || type[0] == -1 ? -1 : 1);
                        break;
                    }
                    else if(<number>(a[fields[0]]) > <number>(b[fields[0]]))
                    {
                        return (type[0] == 0 || type[0] == -1 ? 1 : -1);
                        break;
                    }
                    else
                    {
                        fields.shift();
                        type.shift();
                    }
                }
            }
            return 0;
        }
        return data;
    }
    
    public static randomOne(arr:Array<any>):any{
        return arr[Math.floor(arr.length * Math.random())];
    }
    
    public static disposeList(itemList: Array<any>):void{
        if(itemList) {
            for(var i = 0;i < itemList.length;i++) {
                var item:any = itemList[i];
                if(item.parent)
                    item.parent.removeChild(item);
                item.dispose();
            }
        }
        itemList = [];
    }
}
