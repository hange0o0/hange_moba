class TypeInfoUI extends game.BaseWindow {
    private static instance:TypeInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TypeInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "TypeInfoUISkin";
    }

    private closeBtn: eui.Button;
    private titleText: eui.Label;
    private list2: eui.List;
    private list1: eui.List;



    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);

    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        //var mkvo = MonsterKindVO.getObject(this.data);
        //
        //this.titleText.text = mkvo.word +  '属性'
        //
        //if(mkvo.restrain.length > 0)
        //    this.list1.dataProvider = new eui.ArrayCollection(this.changeWord(mkvo.restrain));
        //else
        //    this.list1.dataProvider = new eui.ArrayCollection([{label:'无'}]);
        //
        //var beRestrain = mkvo.getBeRestrain();
        //if(beRestrain.length > 0)
        //    this.list2.dataProvider = new eui.ArrayCollection(this.changeWord(beRestrain));
        //else
        //    this.list2.dataProvider = new eui.ArrayCollection([{label:'无'}]);
    }

    private changeWord(arr){
        var temp = [];
        //for(var i=0;i<arr.length;i++)
        //{
        //    temp.push({label:MonsterKindVO.getObject(arr[i]).word})
        //}
        return temp;
    }
}