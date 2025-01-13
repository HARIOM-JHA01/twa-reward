export interface Reward {
    id: number;
    poster_id: number;
    reward_name: string;
    reward_image: string;
    country: string;
    start_date: string;
    end_date: string;
    reward_detail: string;
    status: string;
    reward_status: number;
    verifiaction_link_0: string;
    repeat: string;
    max_user: number;
    join_user: number;
    draw_detail_link: string | null;
    created_at: string;
    updated_at: string;
}

export interface Draw {
    id: number;
    poster_id: number;
    draw_name: string;
    draw_image: string;
    country: string;
    start_date: string;
    end_date: string;
    draw_detail: string;
    status: string;
    draw_status: number;
    verifiaction_link_0: string;
    repeat: string;
    max_user: number;
    join_user: number;
    prize_detail_link: string | null;
    draw_detail_link: string | null;
    created_at: string;
    updated_at: string;
}