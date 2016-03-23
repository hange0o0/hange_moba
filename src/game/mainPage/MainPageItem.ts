class MainPageItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {

    }

    public dataChange() {
        if(this.data)
            this.currentState = 'choose';
        else
            this.currentState = 'normal';

    }
}