
class GameEvent {
    public static client = {
        energy_change:'energy_change',
        coin_change:'coin_change',
        diamond_change:'diamond_change',
        exp_change:'exp_change',
        friend_change:'friend_change',
        prop_change:'prop_change',
        force_change:'force_change',
        task_change:'task_change',
        collect_change:'collect_change',
        card_change:'card_change',
        talk_change:'talk_change',
        friend_log_change:'friend_log_change',
        friend_pk_change:'friend_pk_change',
        friend_list_change:'friend_list_change',
        level_change:'level_change',
        honor_change:'honor_change',
        main_kill:'main_kill',
        change_head:'change_head',
        pk_start:'pk_start',
        get_card:'get_card',


        timer:'timer'
    };

    public static sys = {
        get_server_list:'get_server_list',
        login:'login',
        login_server:'login_server',
        quick_register:'quick_register',
        re_register:'re_register',
        register:'register',
        add_user_server:'add_user_server',
        register_server:'register_server'
    }

    public static friend = {
        friend_agree:'friend_agree',
        friend_apply:'friend_apply',
        friend_talk:'friend_talk',
        friend_delete:'friend_delete',
        friend_list:'friend_list',
        friend_log:'friend_log',
        friend_pk_answer:'friend_pk_answer',
        friend_pk_ask:'friend_pk_ask',
        friend_pk_get_card:'friend_pk_get_card',
        friend_miss:'friend_miss',
        friend_refuse:'friend_refuse'
    }

    public static pkCore = {
        pk_result:'pk_result',
        pk_result_type:'pk_result_type',
        pk_vedio:'pk_vedio'
    }

    public static tec = {
        levelup_tec:'levelup_tec'
    }
    public static pay = {
        buy_local:'buy_local',
        buy_rmb:'buy_rmb'
    }

    public static user = {
        get_other_info:'get_other_info',
        change_head:'change_head'
    }

    public static rank = {
        get_rank:'get_rank',
        create_rank:'create_rank'
    }

    public static dayGame = {
        get_day_game:'get_day_game',
        pk_day_game:'pk_day_game'
    }

    public static mainGame = {
        get_main_card:'get_main_card',
        main_award:'main_award',
        main_kill:'main_kill',
        pk_main:'pk_main'
    }

    public static serverGame = {
        get_server_card:'get_server_card',
        pk_server:'pk_server'
    }

    public static serverGameEqual = {
        get_server_equal_card:'get_server_equal_card',
        pk_server_equal:'pk_server_equal'
    }

    public static honor = {
        honor_more:'honor_more',
        honor_award:'honor_award'
    }

    public static collect = {
        collect_more:'collect_more',
        collect_draw:'collect_draw',
        collect_up:'collect_up',
        collect_lock:'collect_lock',
        collect_split:'collect_split'
    }














}