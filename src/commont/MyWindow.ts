function Alert(msg,title?,fun?){
    var panel = new eui.Panel();
    panel.title = msg;
    panel.horizontalCenter = 0;
    panel.verticalCenter = 0;
    GameManager.container.addChild(panel);
}

//fun(type){type:1确定，2：取消，3右上角关闭}
function Confirm(msg,title?,funOK?,btnWord=['取消','确定']){
    var panel = new eui.Panel();
    panel.title = msg;
    panel.horizontalCenter = 0;
    panel.verticalCenter = 0;
    GameManager.container.addChild(panel);
}

function ShowTips(msg,cd=1000){
    var panel = new eui.Panel();
    panel.title = msg;
    panel.horizontalCenter = 0;
    panel.verticalCenter = 0;
    GameManager.container.addChild(panel);
}

//使用钻石相关前的提示  type:1都提示，2：RMB才提示
function AlertDiamondUse(num,type,fun)
{
    if(num > UM.diamond.free)
    {
        var rmb = num - UM.diamond.free;
        if(type == 1)
        {
            Confirm('本次操作需要花费\n点券：'+UM.diamond.free+'\n钻石：' + rmb + '\n是否继续？','消费确认',fun);
        }
        else
        {
            Confirm('本次操作需要花费钻石：' + rmb + '\n是否继续？','消费确认',fun);
        }
    }
    else
    {
        if(type == 1)
        {
            Confirm('本次操作需要花费点券：'+UM.diamond.free+'\n是否继续？','消费确认',fun);
        }
        else
        {
            if(fun)
                fun();
        }
    }
}