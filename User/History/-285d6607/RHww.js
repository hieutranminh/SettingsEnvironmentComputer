// Utilities
import i18n from 'Translate'
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('dialog', [
      'addDialogAlert',
      'addDialogPrompt',
      'addDialogConfirm',
      'addDialogEmbedComponentAlert',
    ]),

    $dialog_showDialogAlert({ title, messages = [], dialogClass = '', confirmButtonText = '', onConfirm = null, onHide = null, customId = null, parentId = null }) {
      const messagesString = JSON.stringify(messages)

      if (messages.length === 0) return

      if (messagesString.includes('404') || messagesString.includes('Network Error') || messagesString.includes('undefined') || messagesString.includes('[{}]')) return

      this.addDialogAlert({
        messages,
        title: title ?? i18n.t('general.alert'),

        ...(!!dialogClass && { dialogClass }),
        ...(!!confirmButtonText && { confirmButtonText }),
        ...(!!onHide && { onHide }),
        ...(!!onConfirm && { onConfirm }),
        ...(!!customId && { customId }),
        ...(!!parentId && { parentId }),
      })
    },

    $dialog_showDialogAlertNotCheckOtherErrors({ title, messages = [], dialogClass = '', confirmButtonText = '', onConfirm = null, onHide = null, customId = null }) {
      if (messages.length === 0) return

      this.addDialogAlert({
        messages,
        title: title ?? i18n.t('general.alert'),

        ...(!!dialogClass && { dialogClass }),
        ...(!!confirmButtonText && { confirmButtonText }),
        ...(!!onHide && { onHide }),
        ...(!!onConfirm && { onConfirm }),
        ...(!!customId && { customId }),
      })
    },

    $dialog_showDialogConfirm({
      title = '',
      dialogClass = '',
      confirmBtnText = '',
      confirmBtnColor= 'blue',
      cancelBtnText = '',
      cancelBtnColor = 'blue-light',
      isOnlyConfirmBtn = false,
      messages,
      component,
      hideHeaderClose = false,
      onclose = null,
    }) {
      if (!messages) return

      return new Promise((resolve) => {
        this.addDialogConfirm({
          messages,
          component,
          dialogClass,
          title: title || i18n.t('general.alert'),

          cancelBtnColor: cancelBtnColor || 'blue-light',
          cancelBtnText:  cancelBtnText || i18n.t('general.cancel'),

          confirmBtnColor:  confirmBtnColor || 'blue',
          confirmBtnText:   confirmBtnText || i18n.t('general.confirm'),
          isOnlyConfirmBtn: isOnlyConfirmBtn || false,
          hideHeaderClose:  hideHeaderClose || false,
          ...(typeof onclose === 'function' && { onclose }),
          onConfirm:        resolve,
        })
      })
    },

    $dialog_showDialogEmbedComponentAlert({
      title = '',
      dialogClass = '',
      closeBtnText = '',
      closeBtnColor = 'blue-light',
      component,
    }) {
      return new Promise((resolve) => {
        this.addDialogEmbedComponentAlert({
          component,
          dialogClass,
          title: title || i18n.t('general.alert'),

          closeBtnColor: closeBtnColor || 'blue-light',
          closeBtnText:  closeBtnText || i18n.t('general.close'),

          onConfirm: resolve,
        })
      })
    },

    $dialog_showDialogPrompt({
      title = '',
      confirmBtnText = '',
      confirmBtnColor= 'blue',
      cancelBtnText = '',
      cancelBtnColor = 'blue-light',
      message,
      component,
      hideFooter = false,
    }) {
      if (!message) return

      return new Promise((resolve) => {
        this.addDialogPrompt({
          message,
          component,
          hideFooter,
          title: title ?? i18n.t('general.alert'),

          cancelBtnColor: cancelBtnColor || 'blue-light',
          cancelBtnText:  cancelBtnText || i18n.t('general.cancel'),

          confirmBtnColor: confirmBtnColor || 'blue',
          confirmBtnText:  confirmBtnText || i18n.t('general.confirm'),

          onConfirm: resolve,
        })
      })
    },
  },
}
