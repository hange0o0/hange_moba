/**
 *
 * @author 
 *
 */
class Config {
	public constructor() {
	}

    public static isDebug: boolean = true;
    public static host: string = 'hangegame.com';
    //public static host: string = '172.17.196.195:90';
    public static version: number = 1;
    public static pk_version: number = 1;
    public static cdn: string = "";
    public static localResRoot:string = "resource/";

    public static serverEqualLevel = 5;
    public static serverLevel = 3;
    public static gambleLevel = 20;

    public static cons = ['','白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','人马','摩羯','水瓶','双鱼']
    public static equalValue = 300;
}
