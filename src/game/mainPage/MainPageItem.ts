class MainPageItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainPageItemSkin";
    }


    public childrenCreated() {

    }

    public dataChanged() {
        if(this.data == 'red')
            this.currentState = 'red';
        else if(this.data)
            this.currentState = 'choose';
        else
            this.currentState = 'normal';

    }
}