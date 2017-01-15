/**
 *
 * @author 
 *
 */
class StringUtil {
	public constructor() {
	}
		
	/**
		 * 获取指定宽度的字符串
		 * @param str 源字符串
		 * @param textfield 宽度
		 * @param showPoint 是否把最后两位换成"..."符号
		 * @return 
		 */
    public static getString(str: string,label:eui.Label,showPoint: boolean = true):string {
        if(str && label) {
    //        textfield.defaultTextFormat = new TextFormat("SimSun",size);
            var textfield = new eui.Label();
            textfield.size = label.size;
            var width = label.width;
            textfield.text = str;
            if(textfield.textWidth > width) {
                textfield.text = "";
                for(var i: number = 0,j: number = str.length;i < j;i++) {
                    var d: string = str.substr(i,1);
                    textfield.appendText(d);
                    if(textfield.textWidth > width) {
                        if(showPoint == false)
                            return str.substr(0,i);
                        else {
                            if(i >= 2)
                                return str.substr(0,i - 2) + "...";
                            else
                                return str;
                        }
                    }
                }
            }
        }
        return str;
    }

    public static  getStringLength(char){
        return char.replace(/[^\x00-\xff]/g,"aa").length;
    }

    public static getStringByLength(str,len){
        len = len*2;
        for(var i=1;i<=str.length;i++)
        {
            var rs = str.substr(0,i);
            if(StringUtil.getStringLength(rs) > len)
                return   str.substr(0,i-1);
        }
        return str;
    }
}
