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


    public static dayLevel = 2;
    public static serverLevel = 3;
    public static serverEqualLevel = 5;
    public static friendLevel = 5;
    public static gambleLevel = 20;

    public static platform = '';
    public static equalValue = 300;
}
