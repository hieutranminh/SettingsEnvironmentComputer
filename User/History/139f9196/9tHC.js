import vue from 'vue'
import vue_router from 'vue-router'
import store from '../store/store.js'

vue.use(vue_router)

export const route = {
  // login
  login:  { group: 'login', name: 'login' },
  logout: { group: 'login', name: 'logout' },

  // common
  home:      { group: 'common', name: 'home' },
  not_found: { project: 'common', group: 'not-found', name: 'not-found' },

  // system
  //system_login:     { group: 'system', name: 'login' },
  solution_ad:      { group: 'system', name: 'solution-ad' },
  solution_menu_ad: { group: 'system', name: 'solution-menu-ad' },
  admin_master_ad:  { group: 'system', name: 'admin-master-ad' },
  common_code_ad:   { group: 'system', name: 'common-code-ad' },

  // admin
  // login
  //login: { project: 'admin', group: 'login', name: 'login' },

  // shop
  shop:                         { group: 'shop', name: 'shop' },
  migration_history:            { group: 'shop', name: 'migration-history' },
  migration_ahaold_2:           { group: 'shop', name: 'migration-ahaold-2' },
  migration_ahaold_oldsys:      { group: 'shop', name: 'migration-ahaold-oldsys' },
  unregister_message:           { group: 'shop', name: 'unregister-message' },
  message_send_multi:           { group: 'shop', name: 'message-send-multi' },
  auto_send:                    { group: 'shop', name: 'auto-send' },
  message_history:              { group: 'shop', name: 'message-history' },
  message_sender:               { group: 'shop', name: 'message-sender' },
  consult_history:              { group: 'shop', name: 'consult-history' },
  education_history:            { group: 'shop', name: 'education-history' },
  migration_aha_old:            { group: 'shop', name: 'migration-ahaold' },
  migration_history_management: { group: 'shop', name: 'migration-history-management' },

  // payment
  sales_history:                { group: 'payment', name: 'sales-history' },
  all_sales_history:            { group: 'payment', name: 'all-sales-history' },
  bank_transfer_notice_history: { group: 'payment', name: 'bank-transfer-notice-history' },
  netmoney_history:             { group: 'payment', name: 'netmoney-history' },
  online_history:               { group: 'payment', name: 'online-history' },
  online_virtual_account:       { group: 'payment', name: 'online-virtual-account' },
  //online_order:               { group: 'payment', name: 'online-order' },
  tax_invoice_info_histories:   { group: 'payment', name: 'tax-invoice-info-histories' },
  auto_transfer_ars:            { group: 'payment', name: 'auto-transfer-ars' },
  cms:                          { group: 'payment', name: 'cms' },
  cms_payer:                    { group: 'payment', name: 'cms-payer' },
  cms_result:                   { group: 'payment', name: 'cms-result' },

  // chain
  chains:               { group: 'chain', name: 'chains' },
  branches:             { group: 'chain', name: 'branches' },
  resellers:            { group: 'chain', name: 'resellers' },
  reseller_subscribers: { group: 'chain', name: 'reseller-subscribers' },
  reseller_settlement:  { group: 'chain', name: 'reseller-settlement' },
  agency_look2:         { group: 'chain', name: 'agency-look2' },

  // solution
  soluion_ad:             { group: 'solution', name: 'soluion-ad' },
  solution_ad_master:     { group: 'solution', name: 'solution-ad-master' },
  //user_manage:          { group: 'solution', name: 'user-manage' },
  admin_master:           { group: 'solution', name: 'admin_-aster' },
  grade_ad:               { group: 'solution', name: 'grade-ad' },
  account_ad:             { group: 'solution', name: 'account-ad' },
  connect_ad:             { group: 'solution', name: 'access-control' },
  caller_ad:              { group: 'solution', name: 'cid-account-management' },
  cid_receiving_history:  { group: 'solution', name: 'cid-receiving-history' },
  misc_codes:             { group: 'solution', name: 'misc-codes' },
  cid_receive_call_popup: { group: 'solution', name: 'cid-receive-call-popup' },

  event_management:                { group: 'solution', name: 'event-management' },
  event_backup:                    { group: 'solution', name: 'event-backup' },
  integration_event_logs:          { group: 'solution', name: 'published-integration-event-logs' },
  integration_event_backup_logs:   { group: 'solution', name: 'published-integration-event-backup-log'},
  received_integration_event_logs: { group: 'solution', name: 'received-integration-event-logs' },
  system_logs:                     { group: 'solution', name: 'system-logs' },
  message_autos_logs:              { group: 'solution', name: 'message-autos-logs' },
  user_command_history:            { group: 'solution', name: 'user-command-history' },

  // community
  board_management:   { group: 'board', name: 'board-management' },
  board:              { group: 'board', name: 'board' },
  board_action:       { group: 'board', name: 'board-action' },
  board_view:         { group: 'board', name: 'board-view' },
  notice_see:         { group: 'board', name: 'notice-see' },
  qna_create:         { group: 'board', name: 'qna-create' },
  qna_see:            { group: 'board', name: 'qna-see' },
  popups:             { group: 'board', name: 'popups' },
  popup_preview:      { group: 'board', name: 'popup-preview' },
  popup_view:         { group: 'board', name: 'popup-view' },
  popup_action:       { group: 'board', name: 'popup-action' },
  banners:            { group: 'board', name: 'banners' },
  banner_action:      { group: 'board', name: 'banner-action' },
  manual_managements: { group: 'board', name: 'manual-managements' },
  // industry_popup:     { group: 'board', name: 'industry-popup' },

  // statistics
  join_statistics: { group: 'statistics', name: 'join-statistics' },
  join_sales:      { group: 'statistics', name: 'join-sales' },
  join_send:       { group: 'statistics', name: 'join-send' },
  new_sales:       { group: 'statistics', name: 'new-sales' },
  netmoney_sum:    { group: 'statistics', name: 'netmoney-sum' },

  // hms
  day_message_statistics: { group: 'hms', name: 'day-message-statistics' },
  day_cus_statis:         { group: 'hms', name: 'day-cus-statis' },
  send_history:           { group: 'hms', name: 'send-history' },
  search_receiver:        { group: 'hms', name: 'search-receiver' },
  success_rate_by_shops:  { group: 'hms', name: 'success-rate-by-shops' },
  result_dropout:         { group: 'hms', name: 'result-dropout' },
  businesstype_classifi:  { group: 'hms', name: 'businesstype-classifi' },
  businesstype_sample:    { group: 'hms', name: 'businesstype-sample' },
  area_classifi:          { group: 'hms', name: 'area-classifi' },
  area_sample:            { group: 'hms', name: 'area-sample' },
  unsubscribe:            { group: 'hms', name: 'unsubscribe' },

  // homepage
  join_consults:    { group: 'homepage', name: 'join-consults'},
  receiver_mobiles: { group: 'homepage', name: 'receiver-mobiles'},
  join_chat:        { group: 'homepage', name: 'join-chat'},
}

const router = new vue_router({
  routes: [
    //login
    {
      path:      '/' + route.login.name,
      name:      route.login.name,
      component: loadPage(route.login),
      meta:      {
        preload: true,
        // permission:
      },
    },
    //logout
    {
      path:      '/' + route.logout.name,
      name:      route.logout.name,
      component: loadPage(route.logout),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // home
    {
      path:      '/',
      //redirect: { name: 'shop' },
      name:      route.home.name,
      component: loadPage(route.home),
      meta:      {
        preload: true,
        // permission:
      },
    },
    //not found
    {
      path:      '*',
      name:      route.not_found,
      component: loadPage(route.not_found),
      meta:      {
        preload: true,
        // permission:
      },
    },

    // system
    {
      path:      '/system/' + route.solution_ad.name,
      name:      route.solution_ad.name,
      component: loadPage(route.solution_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/system/' + route.solution_menu_ad.name,
      name:      route.solution_menu_ad.name,
      component: loadPage(route.solution_menu_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/system/' + route.admin_master_ad.name,
      name:      route.admin_master_ad.name,
      component: loadPage(route.admin_master_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/system/' + route.common_code_ad.name,
      name:      route.common_code_ad.name,
      component: loadPage(route.common_code_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },

    // admin
    // shop
    {
      path:      '/admin/' + route.shop.name,
      name:      route.shop.name,
      component: loadPage(route.shop),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.migration_history.name,
      name:      route.migration_history.name,
      component: loadPage(route.migration_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.migration_ahaold_2.name,
      name:      route.migration_ahaold_2.name,
      component: loadPage(route.migration_ahaold_2),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.migration_ahaold_oldsys.name,
      name:      route.migration_ahaold_oldsys.name,
      component: loadPage(route.migration_ahaold_oldsys),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.unregister_message.name,
      name:      route.unregister_message.name,
      component: loadPage(route.unregister_message),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.message_send_multi.name,
      name:      route.message_send_multi.name,
      component: loadPage(route.message_send_multi),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.auto_send.name,
      name:      route.auto_send.name,
      component: loadPage(route.auto_send),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.message_history.name,
      name:      route.message_history.name,
      component: loadPage(route.message_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.message_sender.name,
      name:      route.message_sender.name,
      component: loadPage(route.message_sender),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.consult_history.name,
      name:      route.consult_history.name,
      component: loadPage(route.consult_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.education_history.name,
      name:      route.education_history.name,
      component: loadPage(route.education_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.migration_history_management.name,
      name:      route.migration_history_management.name,
      component: loadPage(route.migration_history_management),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // payment
    {
      path:      '/admin/' + route.sales_history.name,
      name:      route.sales_history.name,
      component: loadPage(route.sales_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.all_sales_history.name,
      name:      route.all_sales_history.name,
      component: loadPage(route.all_sales_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.bank_transfer_notice_history.name,
      name:      route.bank_transfer_notice_history.name,
      component: loadPage(route.bank_transfer_notice_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.netmoney_history.name,
      name:      route.netmoney_history.name,
      component: loadPage(route.netmoney_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.online_history.name,
      name:      route.online_history.name,
      component: loadPage(route.online_history) ,
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.online_virtual_account.name,
      name:      route.online_virtual_account.name,
      component: loadPage(route.online_virtual_account),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // {
    //   path: '/admin/' + route.online_order.name,
    //   name: route.online_order.name,
    //   component: loadPage(route.online_order),
    //   meta: {
    //     preload: true,
    //     // permission:
    //   }
    // },
    {
      path:      '/admin/' + route.tax_invoice_info_histories.name,
      name:      route.tax_invoice_info_histories.name,
      component: loadPage(route.tax_invoice_info_histories),
      meta:      {
        preload: true,
        // permission:
      },
    },

    // clients
    {
      path:      '/admin/' + route.auto_transfer_ars.name,
      name:      route.auto_transfer_ars.name,
      component: loadPage(route.auto_transfer_ars),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.cms.name,
      name:      route.cms.name,
      component: loadPage(route.cms),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.cms_payer.name,
      name:      route.cms_payer.name,
      component: loadPage(route.cms_payer),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.cms_result.name,
      name:      route.cms_result.name,
      component: loadPage(route.cms_result),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // chain
    {
      path:      '/' + route.chains.name,
      name:      route.chains.name,
      component: loadPage(route.chains),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/' + route.branches.name + '/:chain_id',
      name:      route.branches.name,
      component: loadPage(route.branches),
      props:     true,
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/' + route.resellers.name,
      name:      route.resellers.name,
      component: loadPage(route.resellers),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/' + route.reseller_subscribers.name + '/:reseller_id',
      name:      route.reseller_subscribers.name,
      component: loadPage(route.reseller_subscribers),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/' + route.reseller_settlement.name,
      name:      route.reseller_settlement.name,
      component: loadPage(route.reseller_settlement),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/' + route.agency_look2.name,
      name:      route.agency_look2.name,
      component: loadPage(route.agency_look2),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // solution
    {
      path:      '/admin/' + route.soluion_ad.name,
      name:      route.soluion_ad.name,
      component: loadPage(route.soluion_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.solution_ad_master.name,
      name:      route.solution_ad_master.name,
      component: loadPage(route.solution_ad_master),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // {
    //   path: '/admin/' + route.user_manage.name,
    //   name: route.user_manage.name,
    //   component: loadPage(route.user_manage),
    //   meta: {
    //     preload: true,
    //     // permission:
    //   }
    // },
    {
      path:      '/admin/' + route.admin_master.name,
      name:      route.admin_master.name,
      component: loadPage(route.admin_master),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.grade_ad.name,
      name:      route.grade_ad.name,
      component: loadPage(route.grade_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.account_ad.name,
      name:      route.account_ad.name,
      component: loadPage(route.account_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.connect_ad.name,
      name:      route.connect_ad.name,
      component: loadPage(route.connect_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.caller_ad.name,
      name:      route.caller_ad.name,
      component: loadPage(route.caller_ad),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.cid_receiving_history.name,
      name:      route.cid_receiving_history.name,
      component: loadPage(route.cid_receiving_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.cid_receive_call_popup.name,
      name:      route.cid_receive_call_popup.name,
      component: loadPage(route.cid_receive_call_popup),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.misc_codes.name,
      name:      route.misc_codes.name,
      component: loadPage(route.misc_codes),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.event_management.name,
      name:      route.event_management.name,
      component: loadPage(route.event_management),
      meta:      {
        preload: true,
        // permission:
      },
      redirect: '/admin/' + route.event_management.name + '/' + route.integration_event_logs.name,
      children: [
        {
          path:      '/admin/' + route.event_management.name + '/' + route.integration_event_logs.name,
          name:      route.integration_event_logs.name,
          component: loadPage(route.integration_event_logs),
        },
        {
          path:      '/admin/' + route.event_management.name + '/' + route.received_integration_event_logs.name,
          name:      route.received_integration_event_logs.name,
          component: loadPage(route.received_integration_event_logs),
        },
      ],
    },

    {
      path:      '/admin/' + route.event_backup.name,
      name:      route.event_backup.name,
      component: loadPage(route.integration_event_backup_logs),
      meta:      {
        preload: true,
      },
    },

    {
      path:      '/admin/' + route.system_logs.name,
      name:      route.system_logs.name,
      component: loadPage(route.system_logs),
      meta:      {
        preload: true,
      },
    },
    {
      path:      '/admin/' + route.message_autos_logs.name,
      name:      route.message_autos_logs.name,
      component: loadPage(route.message_autos_logs),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // community
    {
      path:      '/admin/' + route.board_management.name,
      name:      route.board_management.name,
      component: loadPage(route.board_management),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.board.name + '/:type',
      name:      route.board.name,
      component: loadPage(route.board),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.board_action.name + '/:board_code',
      name:      route.board_action.name,
      component: loadPage(route.board_action),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.board_view.name + '/:board_code',
      name:      route.board_view.name,
      component: loadPage(route.board_view),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.notice_see.name,
      name:      route.notice_see.name,
      component: loadPage(route.notice_see),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.qna_create.name,
      name:      route.qna_create.name,
      component: loadPage(route.qna_create),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.qna_see.name,
      name:      route.qna_see.name,
      component: loadPage(route.qna_see),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.popups.name,
      name:      route.popups.name,
      component: loadPage(route.popups),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.popup_preview.name,
      name:      route.popup_preview.name,
      component: loadPage(route.popup_preview),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.popup_view.name,
      name:      route.popup_view.name,
      component: loadPage(route.popup_view),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.popup_action.name,
      name:      route.popup_action.name,
      component: loadPage(route.popup_action),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.banners.name,
      name:      route.banners.name,
      component: loadPage(route.banners),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.banner_action.name + '/:id?',
      name:      route.banner_action.name,
      component: loadPage(route.banner_action),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.manual_managements.name,
      name:      route.manual_managements.name,
      component: loadPage(route.manual_managements),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // {
    //   path: '/admin/' + route.industry_popup.name,
    //   name: route.industry_popup.name,
    //   component: loadPage(route.industry_popup),
    //   meta: {
    //     preload: true,
    //     // permission:
    //   }
    // },
    // statis
    {
      path:      '/admin/' + route.join_statistics.name,
      name:      route.join_statistics.name,
      component: loadPage(route.join_statistics),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.join_sales.name,
      name:      route.join_sales.name,
      component: loadPage(route.join_sales),
      meta:      {
        preload: true,
        // permission:
      },
    }, {
      path:      '/admin/' + route.join_send.name,
      name:      route.join_send.name,
      component: loadPage(route.join_send),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.new_sales.name,
      name:      route.new_sales.name,
      component: loadPage(route.new_sales),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.netmoney_sum.name,
      name:      route.netmoney_sum.name,
      component: loadPage(route.netmoney_sum),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // hms
    {
      path:      '/admin/' + route.day_message_statistics.name,
      name:      route.day_message_statistics.name,
      component: loadPage(route.day_message_statistics),
      meta:      {
        preload: true,
        // permission:
      },
    },
    // migration
    {
      path:      '/admin/' + route.migration_aha_old.name,
      name:      route.migration_aha_old.name,
      component: loadPage(route.migration_aha_old),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.day_cus_statis.name,
      name:      route.day_cus_statis.name,
      component: loadPage(route.day_cus_statis),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.send_history.name,
      name:      route.send_history.name,
      component: loadPage(route.send_history),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.search_receiver.name,
      name:      route.search_receiver.name,
      component: loadPage(route.search_receiver),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.success_rate_by_shops.name,
      name:      route.success_rate_by_shops.name,
      component: loadPage(route.success_rate_by_shops),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.result_dropout.name,
      name:      route.result_dropout.name,
      component: loadPage(route.result_dropout),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.businesstype_classifi.name,
      name:      route.businesstype_classifi.name,
      component: loadPage(route.businesstype_classifi),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.businesstype_sample.name,
      name:      route.businesstype_sample.name,
      component: loadPage(route.businesstype_sample),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.area_classifi.name,
      name:      route.area_classifi.name,
      component: loadPage(route.area_classifi),
      meta:      {
        preload: true,
        // permission:
      },
    },

    {
      path:      '/admin/' + route.area_sample.name,
      name:      route.area_sample.name,
      component: loadPage(route.area_sample),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.unsubscribe.name,
      name:      route.unsubscribe.name,
      component: loadPage(route.unsubscribe),
      meta:      {
        preload: true,
        // permission:
      },
    },

    // homepage
    {
      path:      '/admin/' + route.join_consults.name,
      name:      route.join_consults.name,
      component: loadPage(route.join_consults),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.receiver_mobiles.name,
      name:      route.receiver_mobiles.name,
      component: loadPage(route.receiver_mobiles),
      meta:      {
        preload: true,
        // permission:
      },
    },
    {
      path:      '/admin/' + route.join_chat.name,
      name:      route.join_chat.name,
      component: loadPage(route.join_chat),
      meta:      {
        preload: true,
        // permission:
      },
    },
  ],
})

// utils function
function loadPage (route) {
  if(route.project) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../pages/${route.project}/${route.group}/${route.name}`).catch(handleLoadingChunksFailed)
  }
  if(route.group) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../pages/${route.group}/${route.name}`).catch(handleLoadingChunksFailed)
  }
  else{
    return () => import(/* webpackChunkName: "view-[request]" */ `../pages/${route.name}/${route.name}`).catch(handleLoadingChunksFailed)
  }
}

function handleLoadingChunksFailed() {
  store.dispatch('app/checkAppVersionByFile')
}

export default router

// navigation guards
router.beforeEach((to, from, next) => {
  //console.log ('router.beforeEach:', '/',to.path, '/name=', to.name )
  //setIsLoadingInStore(true)

  //check if logged in
  if (to.name != route.login.name && to.name != route.logout.name ) {
    const logged_in= store.getters['user/getLoggedIn']
    if (!logged_in) {
      // setIsLoadingInStore(false)
      return next({ name: route.login.name })
    }
  }
  next()
})
// router.afterEach(() => {
//   setIsLoadingInStore(false)
// })

// function setIsLoadingInStore(is_loading){
//   store.dispatch('alert/setIsLoadingData', is_loading)
// }
