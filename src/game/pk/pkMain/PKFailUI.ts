class PKFailUI extends PKResultBase {
    private static instance:PKFailUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKFailUI();
        return this.instance;
    }
    
    private desText: eui.Label;
    private list: eui.List;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private okBtn: eui.Button;


    public timer;
    public constructor() {
        super();
        this.skinName = "PKFailUISkin";
    }


    public childrenCreated() {
        this._desText = this.desText;
        this._list = this.list;
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.onBack);
        this.addBtnEvent(this.okBtn, this.onRestart);
    }

    private onBack(){
        PKResultUI.getInstance().hide();
    }
    private onRestart(){
         Confirm('再次挑战需要耗费2点体力，是否继续？',function(type){
              if(type == 1)
              {

              }
         });
    }

    public renew(){

        this.desText.text = ''
        this.list.visible = false;
        this.btnGroup.visible = false;


        this.step = 0;
        this.stepOne();
    }

    protected onStepOver(){
        this.btnGroup.visible = true;
    }

}