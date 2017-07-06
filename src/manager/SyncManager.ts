class SyncManager{
    private static _instance:SyncManager;
    public static getInstance():SyncManager {
        if (!this._instance)
            this._instance = new SyncManager();
        return this._instance;
    }

    public snyc(data){
        var ss;
        for(var s  in  data)
        {
            var value = data[s];
            switch(s)
            {
                case 'sync_energy':
                    UM.energy = value;
                    EM.dispatch(GameEvent.client.energy_change);
                    break;
                case 'sync_coin':
                    UM.coin = value;
                    EM.dispatch(GameEvent.client.coin_change);
                    break;
                case 'sync_diamond':
                    UM.diamond = value;
                    EM.dispatch(GameEvent.client.diamond_change);
                    break;
                case 'sync_friends':
                    UM.friends = value;
                    EM.dispatch(GameEvent.client.friend_change);
                    break;
                case 'sync_level':
                    UM.level = value;
                    EM.dispatch(GameEvent.client.level_change);
                    break;
                case 'sync_exp':
                    UM.exp = value;
                    EM.dispatch(GameEvent.client.exp_change);
                    break;
                case 'sync_next_exp':
                    UM.next_exp = value;
                    break;
                case 'sync_prop':
                    for(ss in value)
                    {
                        UM.prop[ss] = value[ss] || {num:0};
                    }
                    EM.dispatch(GameEvent.client.prop_change);
                    break;
                case 'sync_tec_main':
                    for(ss in value)
                    {
                        UM.tec.main[ss] = value[ss];
                    }
                    break;
                case 'sync_tec_ring':
                    for(ss in value)
                    {
                        UM.tec.ring[ss] = value[ss];
                    }
                    break;
                case 'sync_tec_monster':
                    for(ss in value)
                    {
                        UM.tec.monster[ss] = value[ss];
                    }
                    EM.dispatch(GameEvent.client.monster_level_change);
                    break;
                case 'sync_collect_num':
                    if(!UM.collect.num)
                        break;
                    for(ss in value)
                    {
                        UM.collect.num[ss] = value[ss];
                    }
                    EM.dispatch(GameEvent.client.card_change);
                    break;
                case 'sync_collect_level':
                    for(ss in value)
                    {
                        UM.collect.level[ss] = value[ss];
                    }
                    EM.dispatch(GameEvent.client.collect_change);
                    break;
                case 'sync_honor_ring':
                    if(!UM.honor.ring)
                        break;
                    for(ss in value)
                    {
                        UM.honor.ring[ss] = value[ss];
                    }
                    break;
                case 'sync_honor_monster':
                    if(!UM.honor.monster)
                        break;
                    for(ss in value)
                    {
                        UM.honor.monster[ss] = value[ss];
                    }
                    EM.dispatch(GameEvent.client.honor_change);
                    break;
                case 'sync_active_task':
                    UM.active.task = value;
                    EM.dispatch(GameEvent.client.task_change);
                    break;
                case 'sync_award_force':
                    UM.award_force = value;
                    EM.dispatch(GameEvent.client.force_change);
                    break;
                case 'sync_tec_force':
                    UM.tec_force = value;
                    EM.dispatch(GameEvent.client.force_change);
                    break;
                case 'sync_server_game':
                    var lastLevel = ServerGameManager.getInstance().getPKTableLevel(UM.server_game.exp)
                    for(ss in value)
                    {
                        UM.server_game[ss] = value[ss];
                    }
                    var nowLevel = ServerGameManager.getInstance().getPKTableLevel(UM.server_game.exp)
                    if(nowLevel > lastLevel)
                        data.g_level_up = nowLevel;
                    break;
                case 'sync_server_game_equal':
                    var lastLevel = ServerGameEqualManager.getInstance().getPKTableLevel(UM.server_game_equal.exp)
                    for(ss in value)
                    {
                        UM.server_game_equal[ss] = value[ss];
                    }
                    var nowLevel = ServerGameEqualManager.getInstance().getPKTableLevel(UM.server_game_equal.exp)
                    if(nowLevel > lastLevel)
                        data.g_level_up = nowLevel;
                    break;
                case 'sync_main_game':
                    var lastLevel = MainGameManager.getInstance().getMainStep()
                    for(ss in value)
                    {
                        UM.main_game[ss] = value[ss];
                    }
                    var nowLevel = MainGameManager.getInstance().getMainStep()
                    if(nowLevel > lastLevel)
                        data.g_level_up = nowLevel;
                    break;
                case 'sync_day_game':
                    for(ss in value)
                    {
                        UM.day_game[ss] = value[ss];
                    }
                    break;
                case 'sync_my_card':
                    if(UM.pk_common)
                    {
                        UM.pk_common.my_card = value;
                        EM.dispatch(GameEvent.client.my_card_change);
                    }
                    break;
                case 'sync_active':
                    for(ss in value)
                    {
                        UM.active[ss] = value[ss];
                    }
                    break;
            }
        }
    }
}
