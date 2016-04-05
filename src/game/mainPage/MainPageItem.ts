class MainPageItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {

    }

    public dataChanged() {
        if(this.data)
            this.currentState = 'choose';
        else
            this.currentState = 'normal';

    }
}