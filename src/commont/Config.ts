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
    public static version: number = 15;
    public static m_version: number = 1;
    public static pk_version: number = 4;
    public static cdn: string = "";
    public static localResRoot:string = "resource2/";



    public static friendLevel = 3;
    public static gambleLevel = 20;


    public static mapLevel = 5;
    public static dayLevel = 15;
    public static serverLevel = 25;//卡士二阶
    public static serverEqualLevel = 45;  //卡士五阶
    public static leaderLevel = 95;  //
    public static leaderSkillLevel = 145;  //


    public static platform = '';
    public static equalValue = 1000;
}
