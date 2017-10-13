
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
        main_level_change:'main_level_change',
        card_change:'card_change',
        talk_change:'talk_change',
        friend_log_change:'friend_log_change',
        friend_pk_change:'friend_pk_change',
        friend_list_change:'friend_list_change',
        level_change:'level_change',
        honor_change:'honor_change',
        main_kill:'main_kill',
        change_head:'change_head',
        word_change:'word_change',
        pk_end:'pk_end',
        get_card:'get_card', //获得对战卡组
        monster_level_change:'monster_level_change',

        friend_red_change:'friend_red_change',
        my_card_change:'my_card_change',
        map_value_change:'map_value_change',
        map_change:'map_change',

        PVE_CHANGE:'PVE_CHANGE',

        leader_skill_change:'leader_skill_change',
        leader_skill_copy:'leader_skill_copy',



        pass_day:'pass_day',
        timer:'timer'
    };

    public static sys = {
        client_error:'client_error',
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
        friend_stop:'friend_stop',
        friend_refuse:'friend_refuse'
    }

    public static pkCore = {
        buy_pk_jump:'buy_pk_jump',
        pk_jump:'pk_jump',
        pk_result:'pk_result',
        pk_result_type:'pk_result_type',
        get_my_card:'get_my_card',
        pk_vedio:'pk_vedio'
    }

    public static tec = {
        levelup_tec:'levelup_tec',

        leader_skill_compose:'leader_skill_compose',
        leader_skill_draw:'leader_skill_draw',
        leader_skill_draw_log:'leader_skill_draw_log',
        leader_skill_set:'leader_skill_set',
        leader_skill_view:'leader_skill_view',
        leader_skill_view_list:'leader_skill_view_list',
        leader_skill_copy:'leader_skill_copy',
        leader_skill_copy_award:'leader_skill_copy_award',

        leader_get:'leader_get',
        leader_award:'leader_award'
    }

    public static guess = {
        guess_answer:'guess_answer',
        get_guess:'get_guess'
    }


    public static team = {
        team_dungeon_info:'team_dungeon_info',

        team_agree:'team_agree',
        team_create:'team_create',
        team_invite:'team_invite',
        team_refuse:'team_refuse',
        team_info:'team_info',

        team_pve_add:'team_pve_add',
        team_pve_award:'team_pve_award',
        team_pve_info:'team_pve_info',
        team_pve_list:'team_pve_list',
        team_pve_pk:'team_pve_pk',

    }
    public static pay = {
        buy_local:'buy_local',
        pay_confirm:'pay_confirm',
        buy_rmb:'buy_rmb'
    }

    public static user = {
        get_other_info:'get_other_info',
        change_word:'change_word',
        change_head:'change_head'
    }

    public static rank = {
        get_rank:'get_rank',
        create_rank:'create_rank'
    }

    public static dayGame = {
        get_day_game:'get_day_game',
        get_day_pass:'get_day_pass',
        pk_day_game:'pk_day_game'
    }

    public static mainGame = {
        get_main_card:'get_main_card',
        main_award:'main_award',
        get_main_pass:'get_main_pass',
        main_kill:'main_kill',
        pk_main:'pk_main'
    }

    public static mapGame = {
        map_fight_get:'map_fight_get',
        map_fight_pk:'map_fight_pk',
        map_fight_pk_back:'map_fight_pk_back',
        map_fight_pk_log:'map_fight_pk_log',


        get_map_enemy:'get_map_enemy',
        sweep:'map_sweep',
        exchange:'map_exchange',
        pk_map:'pk_map',
        map_start:'map_start',
        map_sync:'map_sync',
        map_award:'map_award',
        map_change_level:'map_change_level',
        pk_map_again:'pk_map_again'
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

    public static monster_talk = {
        get:'monster_talk_get',
        star:'monster_talk_star',
        comment:'monster_talk_comment',
        add:'monster_talk_add'
    }

    public static collect = {
        collect_more:'collect_more',
        collect_draw:'collect_draw',
        collect_up:'collect_up',
        collect_lock:'collect_lock',
        collect_split:'collect_split'
    }

    public static active = {
        diamond_draw:'diamond_draw',
        get_task_award:'get_task_award'
    }














}