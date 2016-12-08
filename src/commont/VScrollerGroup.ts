class VScrollerGroup extends eui.Group{

    public itemRenderer;
    public scroller:eui.Scroller;
    public desTop = 10;

    private dataArr;
    private pool = [];
    private itemArr = [];
    private heightObj = {};
    public constructor() {
        super();
    }

    public childrenCreated() {

    }

    private getItem():any{
        var item = this.pool.pop();
        if(!item)
            item = new this.itemRenderer();
        this.addChild(item);
        return item;
    }

    private feeItem(item){
        this.pool.push(item)
        MyTool.removeMC(item);
    }

    public getFirstItem(v):any{
        var chooseItem:any = null;
        for(var i=0;i<this.itemArr.length;i++)
        {
            if(this.itemArr[i].y >= v)
            {
                if(!chooseItem || this.itemArr[i].y < chooseItem.y)
                    chooseItem = this.itemArr[i];
            }
        }
        return chooseItem;
    }

    public setData(arr){
        while(this.itemArr.length > 0)
            this.feeItem(this.itemArr.pop());
        this.heightObj = {};
        this.dataArr = arr;
        this.height = 100;
    }

    public scrollToItem(data){
        var index = this.dataArr.indexOf(data);
        if(index == -1)
            return;
        if(index == 0)
        {
            this.scrollTo(0)
            return;
        }

        var count = 0;
        for(var i=0;i<index;i++)
        {
            if(!this.heightObj[i])
            {
                this.heightObj[i] = this.getHeight(this.dataArr[i]);
            }
            count +=this.heightObj[i];
        }
        this.scrollTo(count)
    }

    public scrollTo(v){
        this.scroller.viewport.scrollV = v;
        this.onScroll(v);
        if(this.scroller.viewport.scrollV + this.scroller.height > this.height)
            this.scroller.viewport.scrollV = Math.max(0,this.height - this.scroller.height);
    }

    public onScroll(v){
        var vh = this.scroller.height;
        var change = false;
        var resetHeight = false;
        var hcount = this.desTop;
        var startIndex=0
        var endIndex=0;

        //计算开始的y 和 item
        while(hcount < v - 50)
        {
            if(!this.heightObj[startIndex])
            {
                if(!this.dataArr[startIndex])
                    break
                this.heightObj[startIndex] = this.getHeight(this.dataArr[startIndex]);
                resetHeight = true;
            }
            hcount += this.heightObj[startIndex];
            startIndex ++
        }
        startIndex--;
        if(startIndex < 0)
            startIndex = 0;
        else
            hcount -= this.heightObj[startIndex];

        //将过小的清掉
        for(var i=0;i<this.itemArr.length;i++)
        {
            if(this.itemArr[i].y < hcount)
            {
                this.feeItem(this.itemArr[i]);
                this.itemArr.splice(i,1);
                i--;
                change = true;
            }
        }

        //列出显示中的内容
        while(hcount < v + vh + 50)
        {
            if(!this.dataArr[startIndex])
                break;
            if(!this.isItemShow(this.dataArr[startIndex]))
            {
                var item = this.getItem();
                this.itemArr.push(item);
                this.addChild(item);
                item.data = this.dataArr[startIndex];
                item.y = hcount;

                if(!this.heightObj[startIndex])
                {
                    //item.validateNow();
                    this.heightObj[startIndex] = item.height + 10
                    resetHeight = true;
                }
                change = true
            }

            hcount += this.heightObj[startIndex];
            startIndex ++;
        }

        //将超过的清除
        for(var i=0;i<this.itemArr.length;i++)
        {
            if(this.itemArr[i].y>hcount)
            {
                this.feeItem(this.itemArr[i]);
                this.itemArr.splice(i,1);
                i--;
                change = true
            }
        }
        //重设列表高度
        if(resetHeight)
        {
            this.resetHeight();
        }
    }

    private isItemShow(data){
        for(var i=0;i<this.itemArr.length;i++)
        {
            if(this.itemArr[i].data == data)
            {
                return true;
            }
        }
        return false;
    }

    private getHeight(data){
        var item = this.getItem();
        this.addChild(item);
        item.data = data;
        //item.validateNow();
        var h = item.height + 10;
        this.feeItem(item);
        return h;
    }

    private resetHeight(){
        var len = this.dataArr.length;
        var count = 0;
        for(var i=0;i<len;i++)
        {
             if(this.heightObj[i])
                count +=this.heightObj[i];
            else
                break;
        }
        this.height = count + count/i*(len - i) + this.desTop;
    }
}