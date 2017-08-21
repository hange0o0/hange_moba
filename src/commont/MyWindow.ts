function Alert(msg,fun?,btnLabel?){

    if(_get['debug'] == 100)
    {
        document.body.style.background='#000000'
        return;
    }

    var panel = new AlertUI();
    panel.show(msg,fun,btnLabel);
}

//fun(type){type:1确定，2：取消，3右上角关闭}
function Confirm(msg,fun?,btnWord=['取消','确定'],sp?){
    var panel = new ConfirmUI();
    panel.show(msg,fun,btnWord,sp)
}

function ShowTips(msg,cd=1000){
    TipsUI.getInstance().show(msg,cd);
}

function addBtnTips(mc,str){
    var timer;
    mc.touchEnabled = true;

    mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,onTouchStart,mc.thisObj || mc);
    function onTouchStart(e){
        var stageX = e.stageX
        var stageY = e.stageY
        mc.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,mc.thisObj || mc);
        mc.stage.once(egret.TouchEvent.TOUCH_END,onTouchEnd,mc.thisObj || mc);
        mc.stage.once(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,mc.thisObj || mc);
        egret.clearTimeout(timer);
        timer = egret.setTimeout(function(){
            if( Math.abs(GameManager.stageX - stageX) > 20 ||  Math.abs(GameManager.stageY - stageY) > 20)
            {
                mc.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,mc.thisObj || mc);
                mc.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,mc.thisObj || mc);
                return;
            }
            if(typeof str == 'string')
                TouchTipsUI.getInstance().show(e,str);
            else
                TouchTipsUI.getInstance().show(e,str.apply(mc.thisObj || mc));
        },this,100)

    }
    function onTouchEnd(){
        mc.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,mc.thisObj || mc);
        mc.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,mc.thisObj || mc);
        if(TouchTipsUI.getInstance().stage)
            mc.stopClickTimer = egret.getTimer();
        egret.clearTimeout(timer);
        TouchTipsUI.getInstance().hide();
    }

}

//使用钻石相关前的提示  type:1都提示，2：RMB才提示
function AlertDiamondUse(num,type,fun)
{
    if(num > UM.diamond.free)
    {
        var rmb = num - UM.diamond.free;
        if(type == 1)
        {
            Confirm('本次操作需要花费\n点券：'+UM.diamond.free+'\n钻石：' + rmb + '\n是否继续？',fun);
        }
        else
        {
            Confirm('本次操作需要花费钻石：' + rmb + '\n是否继续？',fun);
        }
    }
    else
    {
        if(type == 1)
        {
            Confirm('本次操作需要花费点券：'+UM.diamond.free+'\n是否继续？',fun);
        }
        else
        {
            if(fun)
                fun();
        }
    }
}