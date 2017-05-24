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
    public static user_version: number = 1;
    public static version: number = 2;
    public static m_version: number = 0;
    public static pk_version: number = 2;
    public static cdn: string = "";
    public static localResRoot:string = "resource/";


    public static dayLevel = 2;
    public static friendLevel = 3;
    public static gambleLevel = 20;

    public static serverLevel = 5;//试练场10级开放
    public static mapLevel = 5;
    public static serverEqualLevel = 45;  //试练场50级开放


    public static platform = '';
    public static equalValue = 1000;
}
