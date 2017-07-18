class PKPosManager {
    private static _instance:PKPosManager;

    public static getInstance():PKPosManager {
        if (!this._instance)
            this._instance = new PKPosManager();
        return this._instance;
    }

    public controller;

    //在PK区内找一空位置
    public findFightEmpty(startPoint,mapData,enemy?,enemyDis?){
        var startX = 60  + 60
        var startY = 100  + 60
        var endX = 640-60 -60
        var endY = this.controller.fightHeight -60 -120 - 80
        var step = 10;
        while(true)
        {
            var ok = true;
            var x = startPoint.x -step + this.controller.random()*step*2
            var y = startPoint.y -step + this.controller.random()*step*2
            if(x < startX)
                x = startX;
            else if(x > endX)
                x = endX;

            if(y < startY)
                y = startY;
            else if(y > endY)
                y = endY;
            var xy = {x:x,y:y}
            for(var s in mapData){
                var dis =MyTool.getDis(xy,mapData[s])
                if(enemy && enemy.id == s && dis <enemyDis)
                {
                    ok = false;
                    break;
                }
                if(dis < 120)
                {
                    ok = false;
                    break;
                }
            }

            if(ok)//找到
            {
                return xy;
            }

            step+= 10;
            if(step > 320 + 160)
            {
                enemy = null
            }
            if(step >1000)//找了100次都找不到
            {
                return null;//原地不动了
            }
        }
        return null

    }

    //目标周周有重叠
    public isHitTestOther(item,len=120){
        for(var s in this.controller.itemArray){
            if(item == this.controller.itemArray[s])
                continue;
            if(this.controller.itemArray[s].out)
                continue
            var dis =MyTool.getDis(item,this.controller.itemArray[s])
            if(dis < len)
            {
                return true;
            }
        }
        return false;
    }

    //是否不在PK区内
    public testOut(item,fun?){//,enemy?,enemyDis?,testEnemy?
        if(item.x < 60 || item.x > 640 - 60 || item.y < 100 || item.y > this.controller.fightHeight-60-120 || this.isHitTestOther(item))// (testEnemy && MyTool.getDis(item,enemy)<enemyDis))
        {
            var startPoint = item;
            if(!item.action)
                startPoint = item.team == 1?{x:160,y:480} :{x:480,y:480}
            var newPos = this.findFightEmpty(startPoint,this.getCurrentMap(),item.enemy,200) //,enemy,enemyDis
            if(!newPos)
                return false;
            //console.log(newPos)
            var VM = PKMainMV.getInstance();
            VM.jumpToXY(item,newPos,fun,this.controller,100);
            item.action = true;
            return true
        }
        return false;
    }

    //A跳向B附近，随机的
    public randomJump(atker,fun,enemyDis = 150){
        if(!atker || !atker.isPKing)
            return false;
        if(this.controller.random() < 0.7)
            return false;
        var startPoint = atker;
        var newPos = this.findFightEmpty(startPoint,this.getCurrentMap(),atker.enemy,enemyDis)
        if(!newPos)
            return false;
        var VM = PKMainMV.getInstance();
        VM.jumpToXY(atker,newPos,fun,this.controller,100);
        return true;
    }

    public getCurrentMap(){
        var map = {}
        var arr = this.controller.itemArray
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(!oo.out)
            {
                map[oo.id] = {x:oo.x,y:oo.y}
            }
        }
        return map;
    }

    //在目标附近的都跳开
    public jumpOut(item,toXY,noMove?){
        noMove = noMove || []
        var arr = this.controller.itemArray
        var map = this.getCurrentMap();
        map[item.id + '_'] = map[item.id];
        map[item.id] = toXY
        var jumpArr = [];
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.out)
                continue;
            if(noMove.length && noMove.indexOf(oo) != -1)
                continue;
            var nowXY = map[oo.id]
            if(oo != item && MyTool.getDis(toXY,nowXY) < 120)
            {
                delete map[oo.id];
                var newPos = this.findRoundPos(oo,map,30)
                if(!newPos)
                    newPos = this.findRoundPos(oo,map,60)
                if(!newPos)
                    newPos = this.findRoundPos(oo,map,90)
                if(!newPos)
                    newPos = this.findRoundPos(oo,map,120)

                if(newPos)
                    jumpArr.push({item:oo,newPos:newPos});
                else
                {
                    newPos = this.findEmptyPos(oo,map,160)
                    jumpArr.push({item:oo,newPos:newPos,jump:true});
                }

                map[oo.id] = newPos;
            }
        }

        var VM = PKMainMV.getInstance();
        for(var i=0;i<jumpArr.length;i++)
        {
            var oo = jumpArr[i];
            if(oo.jump)
                VM.jumpToXY(oo.item,oo.newPos)
            else
                VM.moveToXY(oo.item,oo.newPos)
        }
        return jumpArr.length > 0;
    }

    //找自己附近的位置
    public findRoundPos(item,mapData,limit):any{
        var ok = true;
        var startX = Math.max(60,item.x - limit);
        var startY = Math.max(100,item.y - limit);
        var endX = Math.min(640-60, startX + limit*2);
        var endY = Math.min(this.controller.fightHeight-80, startY + limit*2);

        if(!item.isPKing)
        {
            startX += 50;
            //startY -= 50;
            endX -= 50;
            endY -= 100;
        }
        var step = 30;
        while(step--)
        {
            var ok = true;
            var x = startX + this.controller.random()*(endX - startX);
            var y = startY + this.controller.random()*(endY - startY)
            var xy = {x:x,y:y}
            for(var s in mapData){
                var dis =MyTool.getDis(xy,mapData[s])
                if(dis < 120)
                {
                    ok = false;
                    break;
                }
            }

            if(ok)//找到
            {
                return xy;
            }
        }
        return this.findRoundPos(item,mapData,limit + 50);

    }

    //找自己附近的位置外，查找最近的空位置
    public findEmptyPos(item,mapData,limit):any{
        var step = 10;//10次后会变成全屏
        var x1 = Math.max(60,item.x - limit)
        var x2 = Math.min(640-60,item.x + limit)
        var y1 = Math.max(80,item.y - limit)
        var y2 = Math.min(this.controller.fightHeight-80,item.y + limit);
        var stepX1 = (x1-60)/5
        var stepX2 = (640-60 - x2)/5
        var stepY1 = (y1-80)/10
        var stepY2 = (this.controller.fightHeight-80 - y2)/10;

        while(step--)
        {
            var tryTime = 40;//试20次
            if(step < 6)
            {
                tryTime = 20
            }
            while(true)
            {
                var error = false
                if(step < 6)
                {
                    var startX = x1;
                    var startY = y1 - stepY1;
                    var endX = x2;
                    var endY = y2 + stepY2;
                    var type = tryTime%2;
                    if(item.y < this.controller.fightHeight/2)  //在上半地图由下开始找
                        type = 1-type;

                    if(type == 0)
                    {

                        if(y1 - startY == 0)
                            error = true;
                        else
                            var y = startY + this.controller.random()*(y1 - startY);
                    }
                    else
                    {

                        if(endY - y2 == 0)
                            error = true;
                        else
                            var y = y2 + this.controller.random()*(endY - y2);
                    }
                    if(!error)
                        var x = x1 + this.controller.random()*(x2 - x1);
                }
                else
                {

                    var startX = x1 - stepX1;
                    var startY = y1 - stepY1;
                    var endX = x2 + stepX2;
                    var endY = y2 + stepY2;
                    var type = tryTime%4
                    if(item.y < this.controller.fightHeight/2)  //在上半地图由下开始找
                        type = 3-type;
                    if(type == 0)
                    {
                        if(x1 - startX == 0)
                            error = true;
                        else
                        {
                            var x = startX + this.controller.random()*(x1 - startX);
                            var y = startY + this.controller.random()*(y2 - startY)
                        }


                    }
                    else if(type == 1)
                    {
                        if(y1 - startY == 0)
                            error = true;
                        else
                        {
                            var x = x1 + this.controller.random()*(endX - x1);
                            var y = startY + this.controller.random()*(y1 - startY)
                        }


                    }
                    else if(type == 2)
                    {
                        if(endX - x2 == 0)
                            error = true;
                        else
                        {
                            var x = x2 + this.controller.random()*(endX - x2);
                            var y = y1 + this.controller.random()*(endY - y1)
                        }
                    }
                    else
                    {
                        if(endY - y2 == 0)
                            error = true;
                        else {
                            var x = startX + this.controller.random() * (x2 - startX);
                            var y = y2 + this.controller.random() * (endY - y2)
                        }
                    }
                }


                if(!error)
                {
                    var ok = true;
                    var xy = {x:x,y:y}
                    for(var s in mapData){
                        var dis =MyTool.getDis(xy,mapData[s])
                        if(dis < 120)
                        {
                            ok = false;
                            break;
                        }
                    }

                    if(ok)//找到
                    {
                        return xy;
                    }
                }

                tryTime --;
                if(tryTime == 0)
                    break;
            }
            //向加大一圈的地方找
            x1 = startX
            x2 = endX
            y1 = startY
            y2 = endY
        }
        return {x:item.x,y:item.y};//找不到就不动了
    }
}