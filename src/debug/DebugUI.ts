class DebugUI extends game.BaseUI {
	private static instance: DebugUI;
	public static getInstance() {
		if(!this.instance) this.instance = new DebugUI();
		return this.instance;
	}

	public constructor() {
		super();
		this.skinName = "DebugUISkin";
	}
	private  btn0: eui.Button;
	private  btn1: eui.Button;
	private  btn2: eui.Button;
	private  btn3: eui.Button;
	private  btn4: eui.Button;
	private  btn5: eui.Button;
	private  btn6: eui.Button;
	private  btn7: eui.Button;
	private  btn8: eui.Button;
	private  btn9: eui.Button;
	private  btn10: eui.Button;
	private  btn11: eui.Button;
	private  btn12: eui.Button;
	private  btn13: eui.Button;
	private  btn14: eui.Button;
	private  btn15: eui.Button;
	private  btn16: eui.Button;
	private  btn17: eui.Button;
	private  btn18: eui.Button;
	private  btn19: eui.Button;

	private pkData;

	public childrenCreated() {
		super.childrenCreated();
		this.addBtnEvent(this,this.onClick);
		this.btn0.label = 'close';
		this.btn1.label = 'P';
		this.btn2.label = 'r1';
		this.btn3.label = 'start';
		this.btn4.label = 'stop';

		this.btn5.label = 'get_server_card';
		this.btn6.label = 'pkServer';
		this.btn7.label = 'talk';
		this.btn8.label = 'agree';
		this.btn9.label = 'refuse';
		this.btn10.label = 'delete';

		this.btn11.label = 'getCard';
		this.btn12.label = 'ask';
		this.btn13.label = 'answer';

	   //默认登录
		LoginManager.getInstance().login(_get['openid'],'111111',function(){
			LoginManager.getInstance().loginServer(1);
		});
	}

	private onClick(e){
		var self = this;
		switch(e.target)
		{
			case this.btn0:
			{
				this.hide();
				break;
			}
			case this.btn1:
			{
				//CM.loadCache('main_game1_json',function(){
				//	console.log(CM.table)
				//})
				ScrollTest.getInstance().show();
				//{"team1":{"list":"107","ring":{"id":"4","level":0},"fight":-8,"force":1,"stec":{},"tec":{"1":{"hp":1,"atk":1,"spd":1}},"index":{"1":null}}
				//,"team2":{"list":"107","ring":{"id":"4","level":0},"fight":-8,"force":3,"stec":{},"tec":{"1":{"hp":3,"atk":3,"spd":3}},"index":{"1":null}},"isequal":null}
				//Net.send('pk_result',{"team1":{"list":[107],"ring":{"id":1},"fight":3},"isequal":true,"team2":{"list":[107],"ring":{"id":1},"fight":3}},function(data){
				//	var msg = data.msg;
				//	self.pkData = msg.pkdata;
				//});
				break;
			}
			case this.btn2:
			{
				CM.loadCache('main_game2_json',function(){
					console.log(CM.table)
				})
				//VideoCode.getInstance().initData(PKManager.getInstance().pkData[0]);
				//Net.send('pk_vedio',PKManager.getInstance().pkData[0],function(data){
				//	var msg = data.msg;
				//	VideoManager.getInstance().initVideo(msg.pkdata);
				//	//console.log(VideoManager.getInstance().dataArray);
				//});

				break;
			}
			case this.btn3:
			{
				VideoCode.getInstance().play();
				break;
			}
			case this.btn4:
			{
				VideoCode.getInstance().stop();
				break;
			}
			case this.btn5:
			{
				//DebugInput.getInstance().show(function(arr){
				//	var list = arr[0];
				//	var ring = arr[1];
				//	var level = arr[2];
				//	var o = {list:list.split(','),ring:ring};
				//	DayGameManager.getInstance().pk(level,o,function(){
                //
				//	})
				//},'list#ring#level');
				//CollectManager.getInstance().getCollectMore(function(){
				//	console.log(JSON.stringify(UM.collect));
				//})
				//HonorManager.getInstance().getHonorMore(function(){
				//	console.log(JSON.stringify(UM.honor));
				//})

				//DebugInput.getInstance().show(function(arr){
				//	var type = arr[0];
				//	var id = arr[1];
				//	TecManager.getInstance().levelUp(type,id,function(){
				//		console.log(UM.tec);
				//	})
				//},'type#id');
				//RankManager.getInstance().getRank(1,function(){
				//	console.log(RankManager.getInstance().rankData[1]);
				//});



				MainGameManager.getInstance().getCard(function(){
					//console.log(JSON.stringify(FriendManager.getInstance()))
				})
				//FriendManager.getInstance().getList(function(){
				//	console.log(JSON.stringify(FriendManager.getInstance()))
				//})
				break;
			}
			case this.btn6:
			{
				DebugInput.getInstance().show(function(arr){
					var list = arr[0].split(',');
					var ring = arr[1];
					var index = arr[2];
					ServerGameEqualManager.getInstance().pk({list:list,ring:ring,index:index},function(){
						//console.log(JSON.stringify(FriendPKManager.getInstance()))
					})
				},'list#ring#index');
				//FriendManager.getInstance().getLog(function(){
				//	//console.log(JSON.stringify(FriendManager.getInstance()))
				//})
				//DayGameManager.getInstance().getDayGame(function(){
				//	  console.log(JSON.stringify(DayGameManager.getInstance().data));
				//})
				//CollectManager.getInstance().split({101:10},function(){
				//	console.log(JSON.stringify(UM.collect));
				//})

				//DebugInput.getInstance().show(function(arr){
				//	var id = arr[0];
				//	FriendManager.getInstance().getOtherInfoByNick(id,function(){
				//		console.log(FriendManager.getInstance().otherInfoNick[id]);
				//	})
				//},'nick');

				//DebugInput.getInstance().show(function(arr){
				//	var type = arr[0];
				//	var id = arr[1];
				//	var step = arr[2];
				//	HonorManager.getInstance().award(type,id,step,function(){
				//		console.log(JSON.stringify(UM.honor));
				//	})
				//},'type#id#step');
				break;
			}
			case this.btn7:
			{
				DebugInput.getInstance().show(function(arr){
					var otherid = arr[0];
					var talk = arr[1];
					FriendManager.getInstance().talk(otherid,talk,function(){
						console.log(JSON.stringify(FriendManager.getInstance()))
					})
				},'otherid#talk');

				//CollectManager.getInstance().draw(1,function(){
                //
				//})
				//MainGameManager.getInstance().playBack();
				break;
			}
			case this.btn8:
			{
				DebugInput.getInstance().show(function(arr){
					var logid = arr[0];
					FriendManager.getInstance().agree(logid,function(){
						console.log(JSON.stringify(FriendManager.getInstance()))
					})
				},'logid');
				break;
			}
			case this.btn9:
			{
				DebugInput.getInstance().show(function(arr){
					var logid = arr[0];
					FriendManager.getInstance().refuse(logid,function(){
						console.log(JSON.stringify(FriendManager.getInstance()))
					})
				},'logid');
				break;
			}
			case this.btn10:
			{
				DebugInput.getInstance().show(function(arr){
					var otherid = arr[0];
					FriendManager.getInstance().delete(otherid,function(){
						console.log(JSON.stringify(FriendManager.getInstance()))
					})
				},'otherid');
				break;
			}
				//this.btn11.label = 'getCard';
				//this.btn12.label = 'ask';
				//this.btn13.label = 'answer';
			case this.btn11:
			{
				DebugInput.getInstance().show(function(arr){
					var otherid = arr[0];
					FriendPKManager.getInstance().getCard(otherid,function(){
						console.log(JSON.stringify(FriendPKManager.getInstance()))
					})
				},'otherid');
				break;
			}
			case this.btn12:
			{
				DebugInput.getInstance().show(function(arr){
						var list = arr[0];
						var ring = arr[1];
						var index = arr[2];
					var otherid = arr[3];
					var isequal = arr[4];
					FriendPKManager.getInstance().ask(otherid,{list:[list],ring:ring,index:index},isequal,function(){
						console.log(JSON.stringify(FriendPKManager.getInstance()))
					})
				},'list#ring#index#otherid#isequal');
				break;
			}
			case this.btn13:
			{
				//FriendPKManager.getInstance().playBack(6);
				DebugInput.getInstance().show(function(arr){
					var list = arr[0];
					var ring = arr[1];
					var index = arr[2];
					var logid = arr[3];
					FriendPKManager.getInstance().answer(logid,{list:[list],ring:ring,index:index},function(){
						console.log(JSON.stringify(FriendPKManager.getInstance()))
					})
				},'list#ring#index#logid');
				break;
			}
		}
	}

}
