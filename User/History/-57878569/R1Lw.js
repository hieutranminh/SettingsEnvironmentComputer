import MenuApi from '../../api/common/menu-api'

const state_default = {
  use_menu_data: {
    data: {
      items: [],
    },
  },
  admin_menu_data: {
    shop: {
      text:    'subscribers', //가입자
      link:    '#',
      code:    'AD_SHP_01',
      submenu: {
        shop: {
          text: 'subscriber-management', //가입자관리
          link: '/admin/shop',
          code: 'AD_SHP_02',
        },
        migration: {
          text: 'data-migration-management', //자료이동관리
          link: '/admin/migration-history',
          code: 'AD_SHP_03',
        },
        unregister_message: {
          text: 'send-text-message', //'미등록 고객 문자발송',
          link: '/admin/unregister-message',
          code: 'AD_SHP_04',
        },
        message_history: {
          text: 'text-message-history-for-admin', //관리자 문자 발송내역',
          link: '/admin/message-history',
          code: 'AD_SHP_06',
        },
        auto_send: {
          text: 'setup-automatic-messaging',
          link: '/admin/auto-send',
          code: 'AD_SHP_05',
        },
        message_ad: {
          text: 'sender-number-management', //문자 발신번호 관리',
          link: '/admin/message-sender',
          code: 'AD_SHP_07',
        },
        consult_history: {
          text: 'counseling-history', //상담내역 관리',
          link: '/admin/consult-history',
          code: 'AD_SHP_08',
        },
        education_history: {
          text: 'education-history', //교육내역 관리',
          link: '/admin/education-history',
          code: 'AD_SHP_09',
        },
        migration_history_management: {
          text: 'migration-history-management',
          link: '/admin/migration-history-management',
          code: 'AD_SHP_10',
        },
      },
    },
    payment: {
      text:    'sales-history', //입출금',
      link:    '#',
      code:    'AD_PAY_01',
      submenu: {
        sales_history: {
          text: 'admin-sales-history', //관리자 등록 매출내역',
          link: '/admin/sales-history',
          code: 'AD_PAY_02',
        },
        all_sales_history: {
          text: 'all-sales-hHistory', //전체 매출내역',
          link: '/admin/all-sales-history',
          code: 'AD_PAY_03',
        },
        bank_transfer_notice_history: {
          text: 'bank-transfer-notice-history', // 무통장입금 통보내역',
          link: '/admin/bank-transfer-notice-history',
          code: 'AD_PAY_04',
        },
        // netmoney_history: {
        //   text: 'netmoney-history', // 넷머니 내역- Not Use(2020-12-02)',
        //   link: '/admin/netmoney-history',
        //   code: 'AD_PAY_05'
        // },
        online_history: {
          text: 'online-payment-history', //온라인 결제내역',
          link: '/admin/online-history',
          code: 'AD_PAY_06',
        },
        online_virtual_account: {
          text: 'online-bank-transfer-virtual-account-history', //온라인 무통장(가상계좌) 결제내역',
          link: '/admin/online-virtual-account',
          code: 'AD_PAY_07',
        },
        // online_order: {
        //   text: 'online-payment-order-attempt-history', //온라인 결제주문(시도)내역- Not Use(2020-12-02)',
        //   link: '/admin/online-order',
        //   code: 'AD_PAY_08'
        // },
        tax_log: {
          text: 'tax-invoice-change-log', //세금계산서 변경로그',
          link: '/admin/tax-invoice-info-histories',
          code: 'AD_PAY_09',
        },
        auto_transfer: {
          text: 'auto-transfer-billing-requests', //자동이체 신청내역',
          link: '/admin/auto-transfer-ars',
          code: 'AD_PAY_10',
        },
        cms: {
          text: 'auto-transfer-billing-cms', //자동이체(CMS)',
          link: '/admin/cms',
          code: 'AD_PAY_11',
        },
      },
    },
    chain: {
      text:    'chain-reseller', //체인/조직',
      link:    '#',
      code:    'AD_CHN_01',
      submenu: {
        chain_ad: {
          text: 'chains', // 체인 관리',
          link: '/chains',
          code: 'AD_CHN_02',
        },
        reseller: {
          text: 'resellers', //대리점 관리',
          link: '/resellers',
          code: 'AD_CHN_03',
        },
      },
    },
    solution: {
      text:    'solution-server', //솔루션/서버',
      link:    '#',
      code:    'AD_SOL_01',
      submenu: {
        solution_ad_master: {
          text: 'solutions', //솔루션 관리',
          link: '/admin/solution-ad-master',
          code: 'AD_SOL_02',
        },
        grade_ad: {
          text: 'manager-permission-levels', //관리자 등급 및 권한 관리',
          link: '/admin/grade-ad',
          code: 'AD_SOL_03',
        },
        account_ad: {
          text: 'admin-account-management',//관리자 계정 관리',
          link: '/admin/account-ad',
          code: 'AD_SOL_04',
        },
        connect_ad: {
          text: 'manager-access-control', //관리자 접속 관리',
          link: '/admin/access-control',
          code: 'AD_SOL_05',
        },
        caller_ad: {
          text: 'cid-account-management',//CID 계정 관리',
          link: '/admin/cid-account-management',
          code: 'AD_SOL_06',
        },
        misc_codes: {
          text: 'miscellaneous-setup', //기타 설정 관리',
          link: '/admin/misc-codes',
          code: 'AD_SOL_07',
        },
        event_management: {
          text: 'event-management', //이벤트 관리,
          link: '/admin/event-management',
          code: 'AD_SOL_08',
        },

        system_logs: {
          text: 'system-logs', //시스템 로그',
          link: '/admin/system-logs',
          code: 'AD_SOL_09',
        },
        message_autos_logs: {
          text: 'message-autos-logs', //자동문자 로그',
          link: '/admin/message-autos-logs',
          code: 'AD_SOL_10',
        },
        backup_event: {
          text: 'event-backup',
          link: '/admin/event-backup',
          code: 'AD_SOL_11',
        },
        user_command_history: {
          text: 'user-command-history', //사용자 명령 로그',
          link: '/admin/user-command-history',
          code: 'AD_SOL_12',
        },
        ai_setup: {
          text: 'ai-setup', //AI 설정',
          link: '/admin/ai-setup',
          code: 'AD_SOL_13',
        },
      },
    },
    community: {
      text:    'community', // 커뮤니티',
      link:    '#',
      code:    'AD_CMT_01',
      submenu: {
        board_ad: {
          text: 'board-management', //게시판 관리',
          link: '/admin/board-management',
          code: 'AD_CMT_02',
        },
        system_notice: {
          text: 'system-notice', //시스템 공지',
          link: '/admin/board/SYSNOTICE',
          code: 'AD_CMT_03',
        },
        system_qna: {
          text: 'system-board', // 시스템 문의',
          link: '/admin/board/SYSBOARD',
          code: 'AD_CMT_04',
        },
        system_popup: {
          text: 'popups', //시스템 팝업',
          link: '/admin/popups',
          code: 'AD_CMT_05',
        },
        system_banner: {
          text: 'banners', //시스템 배너',
          link: '/admin/banners',
          code: 'AD_CMT_06',
        },
        manual_managements: {
          text: 'manual-management', // 메뉴얼 관리',
          link: '/admin/manual-managements',
          code: 'AD_CMT_07',
        },
        // industry_popup: {
        //   text: 'popup-by-business-type', //업종별 팝업 관리 - Not Use(2020-12-02)',
        //   link: '/admin/industry-popup',
        //   code: 'AD_CMT_07'
        // }
      },
    },
    statistics: {
      text:    'report', // 통계자료',
      link:    '#',
      code:    'AD_STT_01',
      submenu: {
        join_statistics: {
          text: 'subscription-report', //가입 통계',
          link: '/admin/join-statistics',
          code: 'AD_STT_02',
        },
        join_sales: {
          text: 'sales-by-subscribers', //가입자별 매출',
          link: '/admin/join-sales',
          code: 'AD_STT_03',
        },
        join_send: {
          text: 'textmessage-by-subscribers', //가입자별 문자발송',
          link: '/admin/join-send',
          code: 'AD_STT_04',
        },
        new_sales: {
          text: 'new-sales-types', //신규 영업 통계',
          link: '/admin/new-sales',
          code: 'AD_STT_05',
        },
        netmoney_sum: {
          text: 'netmoney-total', //넷머니 합계',
          link: '/admin/netmoney-sum',
          code: 'AD_STT_06',
        },
        booking_external: {
          text: 'booking-external-systems', //예약연동현황',
          link: '#',
          code: 'AD_STT_07',
        },
      },
    },
    hms: {
      text:    'HMS',
      link:    '#',
      code:    'AD_HMS_01',
      submenu: {
        day_send_statis: {
          text: 'text-by-dates', // 일별 문자전송 통계',
          link: '/admin/day-message-statistics',
          code: 'AD_HMS_02',
        },
        send_history: {
          text: 'text-send-history', // 문자전송내역',
          link: '/admin/send-history',
          code: 'AD_HMS_03',
        },
        search_receiver: {
          text: 'text-search-receiver', //수신자 검색',
          link: '/admin/search-receiver',
          code: 'AD_HMS_04',
        },
        success_rate_by_shops: {
          text: 'text-search-success-rate', //문자전송 성공률 검색',
          link: '/admin/success-rate-by-shops',
          code: 'AD_HMS_11',
        },
        result_dropout: {
          text: 'text-result-dropout', //전송결과 누락분처리',
          link: '/admin/result-dropout',
          code: 'AD_HMS_05',
        },
        businesstype_classifi: {
          text: 'text-businesstype-sample-categories', //업종별문자샘플분류',
          link: '/admin/businesstype-classifi',
          code: 'AD_HMS_06',
        },
        businesstype_sample: {
          text: 'text-businesstype-samples', //업종별문자샘플관리',
          link: '/admin/businesstype-sample',
          code: 'AD_HMS_07',
        },
        area_classifi: {
          text: 'text-area-sample-caregories', //영역별문자샘플분류',
          link: '/admin/area-classifi',
          code: 'AD_HMS_08',
        },
        area_sample: {
          text: 'text-area-samples', //영역별문자샘플관리',
          link: '/admin/area-sample',
          code: 'AD_HMS_09',
        },
        unsubscribe: {
          text: 'text-unsubscribes', //수신거부내역',
          link: '/admin/unsubscribe',
          code: 'AD_HMS_10',
        },
      },
    },
    homepage: {
      text:    'homepage',
      link:    '#',
      code:    'AD_HPG_01',
      submenu: {
        join_consult: {
          text: 'join-consults', // 신규가입 상담신청
          link: '/admin/join-consults',
          code: 'AD_HPG_02',
        },
        receiver_mobile: {
          text: 'receiver-mobiles', // 수신 휴대폰 관리
          link: '/admin/receiver-mobiles',
          code: 'AD_HPG_03',
        },
        join_chat: {
          text: 'join-chat',
          link: '/admin/join-chat',
          code: 'AD_HPG_04',
        },
      },
    },
  },
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getAdminMenuData: (state) => {
    return state.admin_menu_data
  },
  getUseMenuData: (state) => {
    return state.use_menu_data
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setUseMenuData(state, use_menu_data){
    state.use_menu_data = use_menu_data
  },
}

// actions
const actions = {
  async getUseMenuDataDataAsync({commit}, use_menu_data){
    try {
      let menu_api = new MenuApi()
      let result = await menu_api.getUseMenuDataAsync(use_menu_data)
      commit('setUseMenuData', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
