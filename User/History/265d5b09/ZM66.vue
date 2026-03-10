<template>
  <div class="contents send-message-action clearfix">
    <div
      :class=" { 'message-autos-setup-load-modal': isRelatedBookingDeposit || isConsentType }"
      class="bg-back"
    >
      <div
        :class="{ 'image-mms': text_message.fields.message_type == options.messages_enums.message_type.mms }"
        class="phone-message-box box left clearfix"
      >
        <div
          :class="{'alimtalk-inner': text_message.fields.message_type === options.messages_enums.message_type.kao}"
          class="inner"
        >
          <div class="send-type">
            <b v-if="isConsentType">{{ sendTypeText }}</b>
          </div>

          <!-- Content Top -->
          <div class="mb0 top clearfix">
            <template v-if="text_message.fields.message_type !== options.messages_enums.message_type.kao">
              <div class="sms-desktop">
                <aha-button
                  :id="'aha-ai-button-' + randomId"
                  variant="blue"
                  class="aha-ai-button"
                  @click="onShowModalSendMessageAhaAi"
                >
                  {{ $t('aha-ai.aha-ai-button') }}
                </aha-button>

                <aha-tooltip
                  :target="'aha-ai-button-' + randomId"
                  custom-class="aha-ai-tooltip"
                >
                  <div class="aha-ai-tooltip__content">
                    <p>
                      {{ $t('aha-ai.aha-ai-tooltip') }}
                    </p>
                  </div>
                </aha-tooltip>

                <select
                  ref="type_select"
                  v-model="text_message.fields.message_type"
                  :disabled="isConsentType"
                  class="sms-pc"
                  @change="onChangeMessageType(onConfirmChangeMessageTypeLMStoSMS)"
                  @focus="onSaveMessageTypeBeforeChange()"
                >
                  <option :value="options.messages_enums.message_type.sms">
                    {{ $t('messages.sms-full') }}
                  </option>
                  <option :value="options.messages_enums.message_type.lms">
                    {{ $t('messages.lms-full') }}
                  </option>
                  <option :value="options.messages_enums.message_type.mms">
                    {{ $t('messages.mms-full') }}
                  </option>
                </select>

                <span
                  :id="'messages-fee-in-tooltip-' + randomId"
                  class="fail-code-img"
                />
                <aha-tooltip
                  :target="'messages-fee-in-tooltip-' + randomId"
                  :boundary="'messages-fee-in-tooltip-' + randomId"
                  :placement="placement"
                  custom-class="messages-fee-in-tooltip"
                >
                  <div class="messages-fee-in-tooltip__content">
                    <message-fee :data="text_fees" />
                  </div>
                </aha-tooltip>
              </div>

              <div class="sms-m">
                <ul class="sms-tab clearfix">
                  <li class="fll">
                    <aha-button
                      :class="{ 'action': text_message.fields.message_type == options.messages_enums.message_type.sms }"
                      :disabled="isConsentType"
                      @click="onChangeMessageTypeMobile(options.messages_enums.message_type.sms)"
                    >
                      SMS
                    </aha-button>
                  </li>
                  <li class="fll">
                    <aha-button
                      :class="{ 'action': text_message.fields.message_type == options.messages_enums.message_type.lms }"
                      @click="onChangeMessageTypeMobile(options.messages_enums.message_type.lms)"
                    >
                      LMS
                    </aha-button>
                  </li>
                  <li class="fll">
                    <aha-button
                      :class="{ 'action': text_message.fields.message_type == options.messages_enums.message_type.mms }"
                      :disabled="isConsentType"
                      @click="onChangeMessageTypeMobile(options.messages_enums.message_type.mms)"
                    >
                      MMS
                    </aha-button>
                  </li>
                </ul>
              </div>
            </template>
            <template v-else>
              <div class="mb0 clearfix">
                <i class="aha-logo dib" />&nbsp; <span>아하알림</span>
              </div>
            </template>
          </div>
          <!-- Content Top -->

          <!-- Content -->
          <template v-if="text_message.fields.message_type == options.messages_enums.message_type.mms">
            <div class="mms-img-box">
              <img
                v-if="mms_image != ''"
                :src="mms_image"
              >
              <font
                v-else
                v-html="$t('messages.image-area')"
              />
            </div>
            <label
              :for="'mms-image-' + randomId"
              class="btn1 flr"
            >{{ $t('messages.load-image') }}</label>
            <input
              :id="'mms-image-' + randomId"
              type="file"
              class="non-name"
              @change="encodeImageFileAsURL"
            >
            <br>
          </template>

          <template v-if="text_message.fields.message_type !== options.messages_enums.message_type.kao">
            <div
              :class="{ 'mms-content': text_message.fields.message_type == options.messages_enums.message_type.mms }"
              class="bd message-content"
            >
              <textarea
                ref="txArea"
                v-model="contents"
                class="textbox noresize message-content contents-scroll"
                @paste="onPaste($event)"
                @keyup.prevent="onCheckLength(onConfirmChangeMessageType)"
              />

              <span
                class="fix"
                @click="onHideToolTip"
              >
                {{ current_bytes }} / {{ max_bytes }} Bytes
              </span>
            </div>
          </template>
          <template v-else>
            <div class="bd message-content">
              <div class="top-txArea">
                알림톡 도착
              </div>
              <div
                class="textbox noresize alimtalk-text-area"
                disabled
                v-html="replacedAlimtalkContents"
              />
            </div>
          </template>
          <!-- Content -->

          <!-- Content Button -->
          <div
            v-if="!isRelatedBookingDeposit && !isConsentType"
            class="buttonbox"
          >
            <aha-button
              :id="'tooltip-character-' + randomId"
              class="secondary small w50p"
              variant="dark"
              @click="is_show_character = !is_show_character"
              v-html="$t('messages.special-character')"
            />
            <b-tooltip
              :show.sync="is_show_character"
              :noninteractive="false"
              :no-fade="true"
              :target="'tooltip-character-' + randomId"
              placement="bottomright"
              custom-class="tooltip-character"
              triggers="click"
            >
              <table
                class="normal"
                @click="onHideToolTip"
              >
                <tbody>
                  <tr>
                    <td @click="onInsertText('＃')">
                      ＃
                    </td>
                    <td @click="onInsertText('＆')">
                      ＆
                    </td>
                    <td @click="onInsertText('＊')">
                      ＊
                    </td>
                    <td @click="onInsertText('＠')">
                      ＠
                    </td>
                    <td @click="onInsertText('§')">
                      §
                    </td>
                    <td @click="onInsertText('※')">
                      ※
                    </td>
                    <td @click="onInsertText('☆')">
                      ☆
                    </td>
                    <td @click="onInsertText('★')">
                      ★
                    </td>
                    <td @click="onInsertText('○')">
                      ○
                    </td>
                    <td @click="onInsertText('●')">
                      ●
                    </td>
                    <td @click="onInsertText('◎')">
                      ◎
                    </td>
                    <td @click="onInsertText('◇')">
                      ◇
                    </td>
                    <td @click="onInsertText('◆')">
                      ◆
                    </td>
                    <td @click="onInsertText('□')">
                      □
                    </td>
                    <td @click="onInsertText('■')">
                      ■
                    </td>
                    <td @click="onInsertText('△')">
                      △
                    </td>
                    <td @click="onInsertText('▲')">
                      ▲
                    </td>
                    <td @click="onInsertText('▽')">
                      ▽
                    </td>
                    <td @click="onInsertText('▼')">
                      ▼
                    </td>
                    <td @click="onInsertText('→')">
                      →
                    </td>
                    <td @click="onInsertText('←')">
                      ←
                    </td>
                    <td @click="onInsertText('↑')">
                      ↑
                    </td>
                    <td @click="onInsertText('↓')">
                      ↓
                    </td>
                    <td @click="onInsertText('↔')">
                      ↔
                    </td>
                    <td @click="onInsertText('〓')">
                      〓
                    </td>
                  </tr>
                  <tr>
                    <td @click="onInsertText('◁')">
                      ◁
                    </td>
                    <td @click="onInsertText('◀')">
                      ◀
                    </td>
                    <td @click="onInsertText('◈')">
                      ◈
                    </td>
                    <td @click="onInsertText('▣')">
                      ▣
                    </td>
                    <td @click="onInsertText('◐')">
                      ◐
                    </td>
                    <td @click="onInsertText('◑')">
                      ◑
                    </td>
                    <td @click="onInsertText('▒')">
                      ▒
                    </td>
                    <td @click="onInsertText('▤')">
                      ▤
                    </td>
                    <td @click="onInsertText('▥')">
                      ▥
                    </td>
                    <td @click="onInsertText('▨')">
                      ▨
                    </td>
                    <td @click="onInsertText('▧')">
                      ▧
                    </td>
                    <td @click="onInsertText('▦')">
                      ▦
                    </td>
                    <td @click="onInsertText('▩')">
                      ▩
                    </td>
                    <td @click="onInsertText('♨')">
                      ♨
                    </td>
                    <td @click="onInsertText('☏')">
                      ☏
                    </td>
                    <td @click="onInsertText('☎')">
                      ☎
                    </td>
                    <td @click="onInsertText('☜')">
                      ☜
                    </td>
                    <td @click="onInsertText('☞')">
                      ☞
                    </td>
                    <td @click="onInsertText('¶')">
                      ¶
                    </td>
                    <td @click="onInsertText('†')">
                      †
                    </td>
                    <td @click="onInsertText('‡')">
                      ‡
                    </td>
                    <td @click="onInsertText('↕')">
                      ↕
                    </td>
                    <td @click="onInsertText('↗')">
                      ↗
                    </td>
                    <td @click="onInsertText('↙')">
                      ↙
                    </td>
                    <td @click="onInsertText('↖')">
                      ↖
                    </td>
                  </tr>
                  <tr>
                    <td @click="onInsertText('↘')">
                      ↘
                    </td>
                    <td @click="onInsertText('♭')">
                      ♭
                    </td>
                    <td @click="onInsertText('♩')">
                      ♩
                    </td>
                    <td @click="onInsertText('♪')">
                      ♪
                    </td>
                    <td @click="onInsertText('♬')">
                      ♬
                    </td>
                    <td @click="onInsertText('㉿')">
                      ㉿
                    </td>
                    <td @click="onInsertText('㈜')">
                      ㈜
                    </td>
                    <td @click="onInsertText('№')">
                      №
                    </td>
                    <td @click="onInsertText('㏇')">
                      ㏇
                    </td>
                    <td @click="onInsertText('™')">
                      ™
                    </td>
                    <td @click="onInsertText('㏂')">
                      ㏂
                    </td>
                    <td @click="onInsertText('㏘')">
                      ㏘
                    </td>
                    <td @click="onInsertText('℡')">
                      ℡
                    </td>
                    <td @click="onInsertText('®')">
                      ®
                    </td>
                    <td @click="onInsertText('ª')">
                      ª
                    </td>
                    <td @click="onInsertText('º')">
                      º
                    </td>
                    <td @click="onInsertText('！')">
                      ！
                    </td>
                    <td @click="onInsertText('＇')">
                      ＇
                    </td>
                    <td @click="onInsertText('，')">
                      ，
                    </td>
                    <td @click="onInsertText('．')">
                      ．
                    </td>
                    <td @click="onInsertText('／')">
                      ／
                    </td>
                    <td @click="onInsertText('：')">
                      ：
                    </td>
                    <td @click="onInsertText('；')">
                      ；
                    </td>
                    <td @click="onInsertText('＾')">
                      ＾
                    </td>
                    <td @click="onInsertText('＿')">
                      ＿
                    </td>
                  </tr>
                  <tr>
                    <td @click="onInsertText('｀')">
                      ｀
                    </td>
                    <td @click="onInsertText('。')">
                      。
                    </td>
                    <td @click="onInsertText('·')">
                      ·
                    </td>
                    <td @click="onInsertText('‥')">
                      ‥
                    </td>
                    <td @click="onInsertText('…')">
                      …
                    </td>
                    <td @click="onInsertText('〃')">
                      〃
                    </td>
                    <td @click="onInsertText('∥')">
                      ∥
                    </td>
                    <td @click="onInsertText('＼')">
                      ＼
                    </td>
                    <td @click="onInsertText('∼')">
                      ∼
                    </td>
                    <td @click="onInsertText('´')">
                      ´
                    </td>
                    <td @click="onInsertText('∧')">
                      ∧
                    </td>
                    <td @click="onInsertText('∨')">
                      ∨
                    </td>
                    <td @click="onInsertText('～')">
                      ～
                    </td>
                    <td @click="onInsertText('ˇ')">
                      ˇ
                    </td>
                    <td @click="onInsertText('˘')">
                      ˘
                    </td>
                    <td @click="onInsertText('˝')">
                      ˝
                    </td>
                    <td @click="onInsertText('˚')">
                      ˚
                    </td>
                    <td @click="onInsertText('˙')">
                      ˙
                    </td>
                    <td @click="onInsertText('¸')">
                      ¸
                    </td>
                    <td @click="onInsertText('˛')">
                      ˛
                    </td>
                    <td @click="onInsertText('¡')">
                      ¡
                    </td>
                    <td @click="onInsertText('¿')">
                      ¿
                    </td>
                    <td @click="onInsertText('ː')">
                      ː
                    </td>
                    <td @click="onInsertText('＋')">
                      ＋
                    </td>
                    <td @click="onInsertText('－')">
                      －
                    </td>
                  </tr>
                  <tr>
                    <td @click="onInsertText('±')">
                      ±
                    </td>
                    <td @click="onInsertText('×')">
                      ×
                    </td>
                    <td @click="onInsertText('÷')">
                      ÷
                    </td>
                    <td @click="onInsertText('≠')">
                      ≠
                    </td>
                    <td @click="onInsertText('≤')">
                      ≤
                    </td>
                    <td @click="onInsertText('≥')">
                      ≥
                    </td>
                    <td @click="onInsertText('∞')">
                      ∞
                    </td>
                    <td @click="onInsertText('∴')">
                      ∴
                    </td>
                    <td @click="onInsertText('♂')">
                      ♂
                    </td>
                    <td @click="onInsertText('♀')">
                      ♀
                    </td>
                    <td @click="onInsertText('∠')">
                      ∠
                    </td>
                    <td @click="onInsertText('⊥')">
                      ⊥
                    </td>
                    <td @click="onInsertText('⌒')">
                      ⌒
                    </td>
                    <td @click="onInsertText('∂')">
                      ∂
                    </td>
                    <td @click="onInsertText('∇')">
                      ∇
                    </td>
                    <td @click="onInsertText('≡')">
                      ≡
                    </td>
                    <td @click="onInsertText('≒')">
                      ≒
                    </td>
                    <td @click="onInsertText('≪')">
                      ≪
                    </td>
                    <td @click="onInsertText('≫')">
                      ≫
                    </td>
                    <td @click="onInsertText('√')">
                      √
                    </td>
                    <td @click="onInsertText('∽')">
                      ∽
                    </td>
                    <td @click="onInsertText('∝')">
                      ∝
                    </td>
                    <td @click="onInsertText('∵')">
                      ∵
                    </td>
                    <td @click="onInsertText('∪')">
                      ∪
                    </td>
                    <td @click="onInsertText('∩')">
                      ∩
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-tooltip>
            <aha-button
              v-if="text_message.fields.message_type != options.messages_enums.message_type.mms"
              class="secondary small button-up w50p"
              variant="dark"
              @click="onSaveMyMessage"
              v-html="$t('messages.save-message-br')"
            />
            <aha-button
              v-if="!isKr"
              class="secondary small send-message-btn w100p"
              variant="blue"
              @click="onCheckLengthBeforeSend()"
              v-html="$t('messages.send')"
            />
          </div>

          <div
            v-if="isKr && !isRelatedBookingDeposit && !isConsentType"
            class="buttonbox under"
          >
            <aha-button
              class="secondary small"
              variant="dark"
              @click="onShowTestMessage()"
              v-html="$t('messages.send-test-message')"
            />

            <aha-button
              class="secondary small send-message-btn"
              variant="blue"
              @click="onCheckLengthBeforeSend()"
              v-html="$t('messages.send')"
            />
          </div>

          <div
            v-if="isWarningDontSendMessageForClientShown"
            class="text-center dont-send-message-client"
          >
            <span class="font-red">{{ $t('messages.dont-send-message-client') }}</span>
          </div>

          <div
            v-if="isRelatedBookingDeposit || isConsentType"
            class="buttonbox"
          >
            <aha-button
              class="secondary small send-message-btn w100p"
              variant="blue"
              @click="onCheckLengthBeforeSend()"
              v-html="sendButtonText"
            />
            <br>
            <div :class="{ 'mt20': app_language === options.language.korean }">
              <span
                v-if="!isSendMessageByClient && bookingDeposit.clientId != 0"
                class="font-red"
              >{{ $t('messages.dont-send-message-client') }}</span>
              <br v-if="!isSendMessageByClient && bookingDeposit.clientId != 0 && !isSendMessageByBooking">
              <span
                v-if="!isSendMessageByBooking"
                class="font-red"
              >{{ $t('messages.dont-send-message-booking') }}</span>
            </div>
          </div>
          <!-- Content Button -->
        </div>
      </div>
      <div
        :class="{ 'message-autos-setup-load-right': isRelatedBookingDeposit || isConsentType }"
        class="phone-message-box box right"
      >
        <div
          v-if="type != options.messages_enums.send_page.unregister_clients"
          class="clearfix"
        >
          <span
            v-if="isMultiTarget"
            class="fw-bold fz16"
          >{{ $t('messages.multi-target-info') }}</span>
          <span
            v-if="isRelatedBookingDeposit"
            class="fw-bold fz16"
          >{{ $t('messages.client-and-booking-deposit') }}</span>
          <span
            v-if="isConsentType"
            class="fw-bold fz16"
          >{{ $t('messages.client-information') }}</span>
        </div>
        <div
          v-if="type != options.messages_enums.send_page.unregister_clients"
          class="bd pd10"
        >
          <table class="bd-none">
            <tbody>
              <template v-if="isMultiTarget">
                <tr>
                  <td>{{ $t('messages.target-clients') }}</td>
                  <td>{{ formatMoney(targets.target_count, 0) }}{{ $t('messages.client-count') }}</td>
                </tr>
                <tr>
                  <td>{{ $t('messages.unit-price') }} ({{ formatMessageTypeCol(text_message.fields.message_type) }})</td>
                  <td>{{ formatMoney(targets.unit_price, 0) }}p</td>
                </tr>
                <tr>
                  <td>{{ $t('messages.total-cost') }}</td>
                  <td>{{ formatMoney(targets.total_cost, 0) }}p</td>
                </tr>
                <tr>
                  <td>{{ $t('messages.netmoney-balance') }}</td>
                  <td>{{ formatMoney(targets.netmoney_balance, 0) }}p</td>
                </tr>
              </template>
              <tr
                v-if="type == options.messages_enums.send_page.client
                  || type == options.messages_enums.send_page.cid_unregister_client
                  || type == options.messages_enums.send_page.unregister_client"
              >
                <td>{{ $t('messages.mobile-number') }}</td>
                <td>
                  <client-mobile-phone
                    :id="send_message_data.id"
                    :mobile-number="send_message_data.mobile_number"
                  />
                </td>
              </tr>
              <tr v-if="type == options.messages_enums.send_page.client || isConsentType">
                <td>{{ $t('messages.client-name') }}</td>
                <td>{{ send_message_data.client_name }}</td>
              </tr>
              <tr v-if="isConsentType">
                <td>{{ $t('messages.mobile-number') }}</td>
                <td>
                  <client-mobile-phone
                    :id="send_message_data.id"
                    :mobile-number="send_message_data.mobile_number"
                  />
                </td>
              </tr>
              <template v-if="isRelatedBookingDeposit">
                <tr>
                  <td>{{ $t('messages.mobile-number') }}</td>
                  <td>
                    <client-mobile-phone
                      :id="bookingDeposit.clientId"
                      :mobile-number="bookingDeposit.mobileNumber"
                      :registration-date="bookingDeposit.clientRegistrationDateTS"
                    />
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('messages.client-name') }}</td>
                  <td>{{ bookingDeposit.clientName }}</td>
                </tr>
                <tr v-show="type == options.messages_enums.send_page.deposit_guide">
                  <td>{{ $t('messages.booking-deposit') }}</td>
                  <td>{{ formatMoney(bookingDeposit.deposit, 0) }}</td>
                </tr>
                <tr v-show="type == options.messages_enums.send_page.deposit_guide">
                  <td>{{ $t('messages.due-date-time') }}</td>
                  <td>{{ formatDueDate(bookingDeposit.dueDate, app_language, app_language) }}</td>
                </tr>
                <tr v-show="type == options.messages_enums.send_page.deposit_payment_confirm">
                  <td>{{ $t('messages.booking-deposit-payment') }}</td>
                  <td>{{ formatMoney(bookingDeposit.paidAmount, 0) }}</td>
                </tr>
              </template>
              <tr v-if="shortage_netmoney < 0">
                <td class="font-dark-orange">
                  {{ $t('messages.netmoney-balance-shortage') }}
                </td>
                <td class="font-dark-orange">
                  {{ formatMoney(shortage_netmoney, 0) }}p
                  <aha-button
                    variant="blue"
                    class="dib small charge-btn"
                    @click="onMoveNetmoneyPage()"
                  >
                    {{ $t('messages.netmoney-charge') }}
                  </aha-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          class="bdb"
        >
          <!-- Unregistered clients -->
          <span class="dib mb10">{{ $t('messages.receipt-number') }}</span>
          <textarea
            v-model="receiver_phones"
            class="textbox noresize w100"
            rows="5"
            @keypress="onCheckReceiverPhone($event)"
          />
        </div>
        <div
          v-if="!(isConsentType && text_message.fields.message_type === options.messages_enums.message_type.kao)"
          class="mt10 bdb"
        >
          <span class="fz12 mt5 dib">{{ $t('messages.sender') }}</span>
          <select
            v-model="text_message.fields.sender_phone"
            class="w150"
          >
            <option
              v-for="(row, idx) in sender_phone_select.rows"
              :key="idx"
              :value="row.sender_phone"
            >
              {{ row.sender_phone }}
            </option>
          </select>
          <aha-button
            v-if="!isRelatedBookingDeposit && !isConsentType"
            variant="blue"
            class="small dib"
            @click="onSetSenderNumber()"
          >
            {{ $t('messages.setup') }}
          </aha-button>
          <aha-button
            v-if="isKr && !isRelatedBookingDeposit && !isConsentType"
            variant="blue"
            class="small dib"
            @click="onAddRejectMessage()"
          >
            {{ $t('messages.add-rejection') }}
          </aha-button>

          <template v-if="isKr && !isRelatedBookingDeposit && !isConsentType">
            <span
              :id="'messages-rejection-in-tooltip-' + randomId"
              class="fail-code-img m-mb5 cursor-pointer"
            />
            <aha-tooltip
              :target="'messages-rejection-in-tooltip-' + randomId"
              placement="bottom"
              custom-class="messages-rejection-in-tooltip"
            >
              <div
                class="messages-rejection-in-tooltip__content"
                v-html="rejectionMessageInfo"
              />
            </aha-tooltip>
          </template>
        </div>
        <div
          v-if="isRelatedBookingDeposit || isConsentType"
          class="mt10"
        >
          <div v-html="$t('messages.booking-deposit-message-info1')" />
          <div
            v-if="isShowBookingDepositInfo"
            v-html="$t('messages.booking-deposit-message-info2')"
          />
          <div
            v-if="isConsentType"
            class="mt10"
          >
            <template v-if="text_message.fields.message_type !== options.messages_enums.message_type.kao">
              {{ $t('messages.consent-message-info').replace('{0}', $t('variable-data.consent-form-link-var', shopLanguage)) }}
            </template>
            <div class="mt10">
              <template v-if="app_language == options.language.korean">
                ※ <b><span
                  class="color-blue cursor-pointer"
                  @click="onMoveConsentSetupPage"
                >설정 > 동의서 관리 > 동의서 문자 설정</span></b>에서 발송타입 및 발송내용을 설정할 수 있습니다.
              </template>
              <template v-else>
                ※ You can set send type and contents in the <b><span
                  class="color-blue cursor-pointer"
                  @click="onMoveConsentSetupPage"
                >Setup > Consent Form Management > Consent Message Setup.</span></b>
              </template>
            </div>
          </div>
        </div>
        <div
          v-else
          class="mt10 bdb"
        >
          <div class="clearfix mb10">
            <span class="fz12">
              {{ $t('messages.sending-date') }}
            </span>
            <div class="message-tab dib sendday-tab m-mb10">
              <ul class="clearfix">
                <li class="fll">
                  <aha-button
                    :class="{ 'action': text_message.fields.is_send_now }"
                    class="btn mes-tab mr-2"
                    variant="dark"
                    @click="onChangeIsSendNow(true)"
                  >
                    {{ $t('messages.send-immediately') }}
                  </aha-button>
                </li>
                <li class="fll">
                  <aha-button
                    :class="{ 'action': !text_message.fields.is_send_now }"
                    class="btn mes-tab"
                    variant="dark"
                    @click="onChangeIsSendNow(false)"
                  >
                    {{ $t('messages.scheduled-sending') }}
                  </aha-button>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-show="!text_message.fields.is_send_now"
            class="clearfix mb10"
          >
            <aha-date-picker
              v-model="target_date"
              :input-props="{ placeholder: '' }"
              class="date-sm"
            />
            <select-control
              v-model="target_hour"
              :options="target_hour_options"
              :not-translate="true"
              class="dib time-sm"
              text-field="text"
              value-field="value"
            />{{ $t('messages.hour') }}
            <select-control
              v-model="target_minute"
              :options="target_minute_options"
              :not-translate="true"
              class="dib time-sm"
              text-field="text"
              value-field="value"
            />{{ $t('messages.minutes') }}
          </div>
        </div>
        <div
          v-if="type != options.messages_enums.send_page.unregister_clients
            && type != options.messages_enums.send_page.unregister_client
            && !isRelatedBookingDeposit
            && !isConsentType"
        >
          <message-variable
            ref="variable"
            :tab="variableTabType"
            @addChar="onInsertText"
          />
        </div>
        <div
          v-if="isKr && !isRelatedBookingDeposit && !isConsentType"
          class="link-guide-btn clearfix"
        >
          <a
            class="btn btn-link"
            @click="onShowSpamPopup(options.messages_enums.spam_type.filtering_info)"
            v-html="$t('messages.spam-message-info1')"
          />
          <a
            class="btn btn-link"
            @click="onShowSpamPopup(options.messages_enums.spam_type.how_to_write)"
          >{{ $t('messages.spam-message-info2') }}</a>
        </div>
        <div
          v-if="isKr && !isRelatedBookingDeposit && !isConsentType"
          class="note"
        >
          <p v-html="$t('messages.send-message-info1')" />
          <p v-html="$t('messages.send-message-info2')" />
        </div>

        <div
          v-if="isRelatedBookingDeposit || isConsentType"
          class="cancel-footer modal-footer"
        >
          <aha-button
            variant="blue-light"
            @click="onCancel"
          >
            {{ $t('general.cancel') }}
          </aha-button>
        </div>
      </div>
    </div>
    <div
      v-if="!isRelatedBookingDeposit && !isConsentType"
      :class="{'mt20' : isKr && (type == options.messages_enums.send_page.multi_booking || type == options.messages_enums.send_page.deposit_guide || type == options.messages_enums.send_page.deposit_payment_confirm)}"
      class="solution-message-sample clearfix"
    >
      <div class="message-tab">
        <ul class="clearfix">
          <li class="fll">
            <aha-button
              :class="{ 'action': list_type == options.messages_enums.list_type.sample }"
              class="btn mes-tab mr-2"
              variant="dark"
              @click="onChangeListType(options.messages_enums.list_type.sample)"
            >
              {{ $t('messages.samples') }}
            </aha-button>
          </li>
          <li class="fll">
            <aha-button
              :class="{ 'action': list_type == options.messages_enums.list_type.my_message }"
              class="btn mes-tab"
              variant="dark"
              @click="onChangeListType(options.messages_enums.list_type.my_message)"
            >
              {{ $t('messages.my-messages') }}
            </aha-button>
          </li>
        </ul>
      </div>
      <!-- Samples -->
      <div
        v-if="list_type == options.messages_enums.list_type.sample"
        class="sample-mes-list clearfix"
      >
        <div class="sample-list-left">
          <p class="fz12">
            {{ $t('messages.sample-add-title2') }}
          </p>
          <table class="message-sample-pc">
            <tr>
              <td>
                <select
                  v-model="main_group_id"
                  class="w100p"
                  @change="onLoadSampleSubGroup()"
                >
                  <option
                    v-for="(row, idx) in sample_main_group_select"
                    :key="idx"
                    :value="row.id"
                  >
                    {{ row.group_name }}
                  </option>
                </select>
              </td>
            </tr>
            <tr
              v-for="(row, idx) in sample_sub_group_select"
              :key="idx"
            >
              <td
                class="sub_group"
                @click="onSetSubGroupId(row.id)"
              >
                {{ row.group_name }}
              </td>
            </tr>
            <tr>
              <td class="fix-list clearfix">
                <span class="fll">{{ $t('messages.booking-reminder') }}</span>
                <aha-button
                  class="secondary small"
                  @click="onMoveSetupAutomaticMessagePage(options.messages_enums.setup_automatic_messaging_tab.booking)"
                >
                  {{ $t('general.setup') }}
                </aha-button>
              </td>
            </tr>
            <tr>
              <td class="fix-list clearfix">
                <span class="fll">{{ $t('messages.point-service') }}</span>
                <aha-button
                  class="secondary small"
                  @click="onMoveSetupAutomaticMessagePage(options.messages_enums.setup_automatic_messaging_tab.sales)"
                >
                  {{ $t('general.setup') }}
                </aha-button>
              </td>
            </tr>
            <tr>
              <td class="fix-list clearfix">
                <span class="fll">{{ $t('messages.post-visiting') }}</span>
                <aha-button
                  class="secondary small"
                  @click="onMoveSetupAutomaticMessagePage(options.messages_enums.setup_automatic_messaging_tab.post_visit)"
                >
                  {{ $t('general.setup') }}
                </aha-button>
              </td>
            </tr>
            <tr>
              <td class="fix-list clearfix">
                <span class="fll">{{ $t('messages.birthday-greeting') }}</span>
                <aha-button
                  class="secondary small"
                  @click="onMoveSetupAutomaticMessagePage(options.messages_enums.setup_automatic_messaging_tab.client)"
                >
                  {{ $t('general.setup') }}
                </aha-button>
              </td>
            </tr>
          </table>
          <table class="message-sample-m">
            <tr>
              <td colspan="2">
                <select
                  v-model="main_group_id"
                  class="w100p"
                  @change="onLoadSampleSubGroup()"
                >
                  <option
                    v-for="(row, idx) in sample_main_group_select"
                    :key="idx"
                    :value="row.id"
                  >
                    {{ row.group_name }}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td>{{ $t('messages.mobile-sample-list') }}</td>
              <td>
                <select
                  v-model="sub_group_id"
                  class="w100p"
                  @change="onLoadSample()"
                >
                  <option
                    v-for="(row, idx) in sample_sub_group_select"
                    :key="idx"
                    :value="row.id"
                  >
                    {{ row.group_name }}
                  </option>
                </select>
              </td>
            </tr>
          </table>
        </div>
        <div class="sample-list-right">
          <radio-group
            v-if="text_message.fields.message_type == options.messages_enums.message_type.mms && list_type == options.messages_enums.list_type.sample"
            v-model="mms_type"
            :options="options.messages_enums.mms_type_select"
            class="clearfix"
            style="padding-left:1rem"
            @input="onLoadSample()"
          />
          <text-sample-list
            ref="text_sample_list"
            :data="sample_data_props"
            @addChar="onInsertSampleText"
          />
        </div>
      </div>
      <!-- // Samples -->

      <!-- My Messages -->
      <div
        v-else
        class="sample-mes-list clearfix"
      >
        <div class="sample-list-right my-message">
          <div class="top-title clearfix">
            <span>{{ $t('messages.my-category-select') }}</span>
            <select
              v-model="my_message_category_id"
              class="w200"
              @change="onLoadSample()"
            >
              <option
                v-for="(row, idx) in my_message_category_select"
                :key="idx"
                :value="row.id"
              >
                {{ row.category_name }}
              </option>
            </select>
            <aha-button
              variant="blue"
              class="small dib"
              @click="onAddMiscMyMessageCategory()"
            >
              <span class="spacing">+</span>
            </aha-button>
            <aha-button
              variant="blue"
              class="small flr"
              @click="onCreateMyMessage()"
            >
              {{ $t('messages.create-message') }}
            </aha-button>
          </div>
          <div>
            <text-sample-list
              ref="text_sample_list"
              :data="sample_data_props"
              @addChar="onInsertSampleText"
            />
          </div>
        </div>
      </div>
      <!-- // My Messages -->
    </div>
    <send-test-message @send-test-message="onSendTestMessage" />
    <text-my-message-modal
      :id="modal_id"
      @confirm="onSaveMyMessageAction"
    />

    <alert-confirm
      :id="alert_id"
      :data_alerts="alert_data"
      @confirm="onAlertConfirmAsync"
      @cancel="onAlertCancel"
    />

    <my-message-category-action
      :is_from_send_message_action="true"
      @reload-page="onAddMiscMyMessageCategoryReloadPage"
    />
    <confirm-night-time-texting
      :modal-id="confirmNightTimeTextingModalId"
      :is-include-spam="isIncludeSpam"
      @confirm="onNightTimeTextingConfirmAsync"
    />

    <!-- Modal Send Message Aha Ai -->
    <modal-send-message-aha-ai
      ref="modalSendMessageAhaAi"
      :text-fee="text_fees.fields"
      :message-type="text_message.fields.message_type"
      :visible="isShowModalSendMessageAhaAi"
      @cancel="onCancelModalSendMessageAhaAi"
      @confirm-save-my-message-success="onConfirmSaveMyMessageSuccess"
      @use-message="onUseMessage"
    />
  </div>
</template>

<script>
// Constants
const LINK_URL = 'sign-consent-form?messageLinkKey='
const COUNTRY_CODE_QUERY_STRING = '&countryCode=XX'
const MAX_LINKKEY_LENGTH = 23
const MAX_CONTENT_LENGTH = 2000

// Time constants
const NIGHT_TIME_START_HOUR = 21
const NIGHT_TIME_END_HOUR = 8
const DEFAULT_HOUR = '08'
const DEFAULT_MINUTE = '00'
const HOUR_START = 8
const HOUR_END = 23
const MINUTE_INTERVALS = 6

// Random ID range
const RANDOM_ID_MAX = 10000

// Utils
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import { options } from 'OptionsHelpers'
import { mapMutations , mapState, mapActions } from 'vuex'
import MessageHelper from '../../../helpers/message-helper.js'
import { common_options } from 'Options/common-options.js'

// View models
import TextMessageViewModel from 'ViewModels/messages/text-message/text-message-view-model'
import SolutionTextFeeViewModel from 'ViewModels/messages/text-fees/solution-text-fee-view-model'
import MessageAutosShopViewModel from 'Modules/view-model/message-autos/message-autos-shop-view-model'
import ConsentMessageSetupViewModel from 'Modules/view-model/consent/consent-message-setup-view-model'

// Apis
import ClientApi from 'API/clients/client-api'
import TextMessageApi from 'API/messages/text-message-api'
import SolutionTextFeeApi from 'API/messages/solution-text-fee-api'
import TextSenderPhoneApi from 'API/messages/text-sender-phone-api'
import TextSampleGroupApi from 'API/messages/text-sample-group-api'
import PaymentShopUsageApi from 'API/account/payment-shop-info-api'
import MyMessageCategoryApi from 'API/messages/my-message-category-api'
import MessageSetupBookingApi from 'API/message-autos/message-setup-booking-api'
import TextSampleBusinessTypeApi from 'API/messages/text-sample-business-type-api'

import {
  emptyValue,
  replaceAll,
  formatMoney,
  checkUndefined,
  compressFileAsync,
  normalizeTextSafe,
  formatDateBySetting,
  clientAddPrivacyLog,
  convertDateToTimezone,
  formatMobileAndPhoneNumber,
  checkNullAndEmptyAndUndefined,
  convertDateFromTimezoneToTimestamp,
  getReplacedEmoticonAlimTalkContents,
} from 'CommonHelpers'
import { getInvalidCharsAsync } from 'MessageEncodingHelpers'
import { ApiError } from 'HTTPHelpers'

// Components
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import MessageFee from 'Components/messages/message-fee/message-fee.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import RadioGroup from 'CommonComponents/form/radio/radio-group/radio-group.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import TextSampleList from 'Components/messages/text-sample-list/text-sample-list.vue'
import MessageVariable from 'Components/messages/message-variable/message-variable.vue'
import SendTestMessage from 'Components/messages/send-test-message/send-test-message.vue'
import SelectControl from 'CommonComponents/form/select/select-control/select-control2.vue'
import TextMyMessageModal from 'Components/messages/text-my-message/text-my-message-modal.vue'
import ClientMobilePhone from 'Modules/clients/components/client-mobile-phone/client-mobile-phone.vue'
import ConfirmNightTimeTexting from 'Components/messages/confirm-night-time-texting/confirm-night-time-texting.vue'
import MyMessageCategoryAction from 'Components/setup/misc-codes/my-message-category/my-message-category-action.vue'
import ModalSendMessageAhaAi from 'Components/messages/modal-send-message-aha-ai/modal-send-message-aha-ai.vue'

export default {
  components: {
    MessageFee,
    AhaTooltip,
    RadioGroup,
    AlertConfirm,
    SelectControl,
    AhaDatePicker,
    TextSampleList,
    SendTestMessage,
    MessageVariable,
    ClientMobilePhone,
    TextMyMessageModal,
    MyMessageCategoryAction,
    ConfirmNightTimeTexting,
    ModalSendMessageAhaAi,
  },

  extends: ComponentBase,

  props: {
    data: {
      type:    Number, // Any type
      default: 0,
    },

    type: {
      type:    Number,
      default: 0,
    },

    call_number: {
      type:    String,
      default: null,
    },

    multi_data: {
      type:    Array,
      default: null,
    },

    isHideCallNumber: {
      type:    Boolean,
      default: false,
    },

    bookingDeposit: {
      type:    Object,
      default: () => ({}),
    },

    consent: {
      type:    Object,
      default: () => ({}),
    },

    storeInputAnswer: {
      type:    Array,
      default: () => ([]),
    },

    isSendMessageByBooking: {
      type:    Boolean,
      default: true,
    },

    isSendMessageByClient: {
      type:    Boolean,
      default: true,
    },

    isNotAllowSendMessageClient: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      // modal
      alert_id:                       'text-message-alert',
      modal_id:                       'text-my-message-modal-by-send-message',
      modal_id2:                      'my-message-category-action-modal',
      confirmNightTimeTextingModalId: 'confirm-night-time-texting',

      options,
      text_fees:             {},
      text_message:          {},
      text_message_errors:   [],
      current_bytes:         0,
      max_bytes:             0,
      receivers:             [],
      target_hour_options:   [],
      target_minute_options: [],
      target_date:           null,
      target_hour:           DEFAULT_HOUR,
      target_minute:         DEFAULT_MINUTE,
      message_helper:        null,

      sender_phone_select:        { rows: [] },
      sample_main_group_select:   {},
      sample_sub_group_select:    {},
      my_message_category_select: {},
      business_type_select:       {},
      table_filter:               {},

      messageSetupBookingApi: new MessageSetupBookingApi(),

      main_group_id:          0,
      sub_group_id:           0,
      my_message_category_id: 0,

      today:           convertDateToTimezone(new Date()),
      mms_image:       '',
      imageFile:       null,
      sampleImagePath: null,
      mms_type:        options.messages_enums.mms_type.image,

      targets: {
        target_count:     0,
        unit_price:       0,
        total_cost:       0,
        netmoney_balance: 0,
      },

      send_message_data: { // target : 1client (Init)
        id:            null,
        mobile_number: null,
        client_name:   null,
      },
      list_type:         options.messages_enums.list_type.sample,
      sample_data_props: {
        message_type: options.messages_enums.message_type.sms,
        country_code: '',
        solution_id:  0,
        text_fees:    {},
        shop_id:      0,
      },

      test_mobile_numbers: [],
      variableTabType:     null,

      alert_data: [],
      alert_type: options.messages_enums.alert_type.message_type_change,

      receiver_phones:        '',
      receiver_phones_errors: [],
      business_type_code:     null,

      is_show_character:          false,
      my_message_category_action: {},

      isLoadSample: false,
      contents:     '',

      isShowBookingDepositInfo: false,
      randomId:                 0,

      consentMessageSetup: new ConsentMessageSetupViewModel(),

      messageTypeBeforeChange: null,
      isIncludeSpam:           false,
      messageAutosShop:        new MessageAutosShopViewModel(),

      isShowModalSendMessageAhaAi: false,
    }
  },

  computed: {
    ...mapState('supports', [
      'solution',
    ]),
    shortage_netmoney(){
      // Setting targets.target_count displays netmoney shortage
      return this.targets.netmoney_balance - this.targets.total_cost
    },
    isKr() {
      return this.shop_data.country === options.country_code.kr
    },
    rejectionMessageInfo() {
      return this.isKr
        ? this.$t('messages.rejection-message-info-kr')
        : this.$t('messages.rejection-message-info-vn')
    },
    shopLanguage() {
      return this.isKr ? options.language.korean : options.language.english
    },
    isRelatedBookingDeposit() {
      return [
        options.messages_enums.send_page.deposit_guide,
        options.messages_enums.send_page.deposit_payment_confirm,
      ].includes(this.type)
    },
    isMultiTarget() {
      return [
        options.messages_enums.send_page.multi_booking,
        options.messages_enums.send_page.client_management,
        options.messages_enums.send_page.campaign,
      ].includes(this.type)
    },
    isConsentType() {
      return this.type === options.messages_enums.send_page.consent_form
    },
    placement() {
      return this.isMobile() ? 'bottomleft' : 'bottom'
    },

    isWarningDontSendMessageForClientShown() {
      if (this.type !== options.messages_enums.send_page.client && !this.isConsentType) {
        return false
      }

      if (this.send_message_data.id) {
        return this.send_message_data.allowed_message_type === options.allowed_message_type.not_message
      }

      return this.isNotAllowSendMessageClient
    },

    replacedAlimtalkContents() {
      if (checkNullAndEmptyAndUndefined(this.contents)) {
        return ''
      }

      const result = getReplacedEmoticonAlimTalkContents(this.contents)
        + '<br><br><button class="consent-link-btn">'
        + this.$t('messages.consent-view')
        + '</button>'

      return sanitizeHtml(result, {
        allowedTags:       ['i', 'br', 'button'],
        allowedAttributes: {
          i:      ['class'],
          button: ['class'],
        },
        disallowedTagsMode: 'escape',
      })
    },

    sendTypeText() {
      return this.text_message.fields.message_type === options.messages_enums.message_type.kao
        ? this.$t('messages.kakao-talk')
        : this.$t('messages.text-message')
    },

    sendButtonText() {
      if (this.isConsentType) {
        return this.$t('messages.send-consent-form')
      }
      return this.$t('messages.send')
    },
  },

  watch: {
    target_date() {
      if (formatDateBySetting(this.target_date) === formatDateBySetting(this.today)) {
        const currentHour = this.today.getHours()
        if (currentHour >= 22 || currentHour <= NIGHT_TIME_END_HOUR) {
          this.target_hour = DEFAULT_HOUR
        } else {
          this.target_hour = String(currentHour + 1).padStart(2, '0')
        }
      } else {
        this.target_hour = DEFAULT_HOUR
      }
      this.target_minute = DEFAULT_MINUTE
    },
    main_group_id(){
      if(this.sample_sub_group_select.length > 0)
        this.sub_group_id = this.sample_sub_group_select[0].id
    },
  },

  beforeMount() {
    this.text_fees = new SolutionTextFeeViewModel()
    this.text_message = new TextMessageViewModel()

    // Set time options
    for (let index = HOUR_START; index < HOUR_END; index++) {
      const hour = String(index).padStart(2, '0')
      this.target_hour_options.push({ text: hour, value: hour })
    }
    for (let index = 0; index < MINUTE_INTERVALS; index++) {
      const minute = index + '0'
      this.target_minute_options.push({ text: minute, value: minute })
    }
    this.randomId = Math.floor(Math.random() * RANDOM_ID_MAX)
  },

  methods: {
    formatMobileAndPhoneNumber,
    formatMoney,
    ...mapMutations('setup_automatic_messaging', [
      'setSetupAutomaticMessagingInfo',
    ]),
    ...mapActions('my_message_category', [
      'setMyMessageCategoryActionData',
    ]),
    ...mapActions('supports', [
      'getSolution',
    ]),

    async onLoadForm() {
      try {
        this.preLoader()

        // Init data
        this.text_fees = new SolutionTextFeeViewModel()
        this.text_message = new TextMessageViewModel()
        this.receiver_phones = ''
        this.text_message.fields.country_code = this.shop_data.country
        this.text_message.fields.shop_id = this.shop_data.shop_id
        this.text_message.fields.user_id = this.x_user.user_name
        this.text_message.fields.message_type = options.messages_enums.message_type.lms
        this.text_message.fields.is_send_now = true
        this.send_message_data = {
          id:            null,
          mobile_number: null,
          client_name:   null,
        }
        this.contents = ''
        this.isShowBookingDepositInfo = false
        this.is_show_character = false
        this.test_mobile_numbers = []
        this.mms_image = ''
        this.imageFile = null
        this.sampleImagePath = null
        this.hideDialogById(this.alert_id)

        // To show variable
        this.variableTabType =
          (this.type == options.messages_enums.send_page.multi_booking
          || this.type == options.messages_enums.send_page.deposit_guide
          || this.type == options.messages_enums.send_page.deposit_payment_confirm)
            ? options.messages_enums.setup_automatic_messaging_tab.booking : null

        if(this.type == options.messages_enums.send_page.client
          || this.type == options.messages_enums.send_page.unregister_clients)
          await this.onChangeListType(options.messages_enums.list_type.my_message)
        else if(!this.isRelatedBookingDeposit && !this.isConsentType)
          this.onChangeListType(options.messages_enums.list_type.sample)

        this.current_bytes = 0
        this.mms_type = options.messages_enums.mms_type.image
        this.target_date = convertDateToTimezone(new Date())

        if(this.isMultiTarget && this.isKr)
          this.contents = this.$t('messages.multi-message-info1') +'\n\n' + this.$t('messages.multi-message-info2')

        if(this.type == options.messages_enums.send_page.client || this.isConsentType){
          this.targets.target_count = 1
          await this.loadClientInfo() // Set ClientInfo
          this.loadNetMoneyBalance()
        } else if(
          this.type == options.messages_enums.send_page.cid_unregister_client ||
          this.type == options.messages_enums.send_page.unregister_client
        ) {
          this.send_message_data.mobile_number = this.call_number
          this.receivers = this.send_message_data.mobile_number
        } else if(
          this.type == options.messages_enums.send_page.multi_booking ||
          this.type == options.messages_enums.send_page.client_management ||
          this.type == options.messages_enums.send_page.campaign
        ) {
          if (this.multi_data && this.multi_data.length > 0){
            this.targets.target_count = this.multi_data.length
            this.loadNetMoneyBalance()
          }
        } else if (
          this.type == options.messages_enums.send_page.deposit_guide ||
          this.type == options.messages_enums.send_page.deposit_payment_confirm
        ) {
          this.targets.target_count = 1
          this.receivers = this.bookingDeposit.mobileNumber
          this.loadNetMoneyBalance()
        }

        await this.loadTextInfo() // Set Max Byte, TextFee
        if(this.isRelatedBookingDeposit)
          await this.onLoadBookingSetupAsync()
        else if(this.isConsentType) {
          await this.onLoadShopInfoAsync()
          await this.onLoadConsentSetupAsync()
        }

        await this.loadSenderPhones()

        if(this.type != options.messages_enums.send_page.unregister_clients
          && this.type != options.messages_enums.send_page.unregister_client
          && !this.isConsentType
          && !this.isRelatedBookingDeposit){
          this.$refs.variable.onLoadForm()
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async loadClientInfo() {
      try {
        const dataSend = {
          client_id: this.data,
          shop_id:   this.shop_data.shop_id,
        }

        const clientApi = new ClientApi()
        const result = await clientApi.getClientAsync(dataSend)

        if (!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        clientAddPrivacyLog(options.clients_enums.privacy_work_type.get_client, null, null)
        this.send_message_data = result.data

        if(!emptyValue(this.send_message_data.mobile_number)) {
          this.receivers = this.send_message_data.mobile_number
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadTextInfo() {
      try {
        const dataSend = {
          chain_id:     this.shop_data.chain_id,
          shop_id:      this.shop_data.shop_id,
          country_code: this.shop_data.country,
          solution_id:  this.shop_data.solution_id,
        }

        const solutionTextFeeApi = new SolutionTextFeeApi()
        const result = await solutionTextFeeApi.getTextFeeByShopAsync(dataSend)

        if (!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        this.text_fees.fields = Object.assign({}, result.data)
        this.onChangeMessageType()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadSenderPhones() {
      try {
        const dataSend = {
          page_number:    1,
          is_sender_list: true,
          shop_id:        this.shop_data.shop_id,
          page_size:      options.pagination.default,
        }

        const result = await (new TextSenderPhoneApi()).getTextSenderPhonesByShopAsync(dataSend)

        if (!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        this.sender_phone_select.rows= result.data.items
        if (result.data.items.length > 0) {
          const tempAutoSendItem = result.data.items.find(x => x.is_auto_sender)

          if(!checkUndefined(tempAutoSendItem))
            this.text_message.fields.sender_phone = tempAutoSendItem.sender_phone
          else {
            this.text_message.fields.sender_phone = result.data.items[0].sender_phone
          }
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    onChangeMessageType(func = null) {
      if(this.text_message.fields.message_type == this.options.messages_enums.message_type.sms) {
        this.max_bytes = this.text_fees.fields.sms_max_bytes
        this.targets.unit_price = this.text_fees.fields.sms_fee
      }
      else if(this.text_message.fields.message_type == this.options.messages_enums.message_type.lms) {
        this.max_bytes = this.text_fees.fields.lms_max_bytes
        this.targets.unit_price = this.text_fees.fields.lms_fee
      }
      else if(this.text_message.fields.message_type == this.options.messages_enums.message_type.mms) {
        this.max_bytes = this.text_fees.fields.lms_max_bytes
        this.targets.unit_price = this.text_fees.fields.mms_fee
      }

      this.targets.total_cost = this.targets.target_count * this.targets.unit_price
      this.message_helper = new MessageHelper(this.text_message.fields.message_type, this.max_bytes, this.text_fees.fields.lms_max_bytes)

      setTimeout(()=> this.onCheckLength(func), 4)

      if(!this.isRelatedBookingDeposit && !this.isConsentType)
        this.onLoadSample()
    },

    onConfirmChangeMessageType(){
      this.text_message.fields.message_type = this.options.messages_enums.message_type.lms
      this.onChangeMessageType()
    },

    onConfirmChangeMessageTypeLMStoSMS(value) {
      if(!value) {
        this.text_message.fields.message_type = this.messageTypeBeforeChange
        this.onChangeMessageType()
      }
    },

    onCheckLength(func = null) {
      if(this.message_helper === null) {
        this.onChangeMessageType()
        return
      }

      if(this.text_message.fields.message_type === options.messages_enums.message_type.kao) {
        return
      }

      const ui = this.$refs.txArea
      const return_data = this.message_helper.check_len(ui, func)
      if (return_data != null) {
        ui.value = return_data.value
        this.contents = return_data.value
        this.current_bytes = return_data.length
      }
    },

    onPaste(event){
      event.preventDefault()

      const clipboardData = event.clipboardData || window.clipboardData
      const pastedText = clipboardData.getData('text')

      const normalizedText = normalizeTextSafe(pastedText)

      const textarea = this.$refs.txArea
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentValue = this.contents || ''

      const newValue = currentValue.substring(0, start) + normalizedText + currentValue.substring(end)

      this.contents = newValue

      this.$nextTick(() => {
        textarea.setSelectionRange(start + normalizedText.length, start + normalizedText.length)
        textarea.focus()
        this.onCheckLength(this.onConfirmChangeMessageType)
      })
    },

    onInsertText(ch) {
      const ui = this.$refs.txArea
      const value = this.message_helper.insertAtCaret(ui, ch)
      if (value != null) {
        this.contents = value
      }
      this.onCheckLength()
      ui.focus()
    },

    onLoadSample(){
      this.onSetSampleDataProp()
      this.$nextTick(() => {
        this.$refs.text_sample_list.onLoadForm()
      })
    },

    async onLoadMainSample() {
      try {
        const dataSendBusinessType = {
          country_code: this.shop_data.country,
          solution_id:  this.shop_data.solution_id,
        }

        const textSampleBusinessTypeApi = new TextSampleBusinessTypeApi()
        const result = await textSampleBusinessTypeApi.getTextSampleBusinessTypesAsync(dataSendBusinessType)

        if (!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        if(result.data.items.length != 0){
          this.business_type_select = result.data.items
          let up_level_id = 0
          const selected_business_type = this.business_type_select.find(x => x.business_type_code == this.shop_data.business_type_code)
          if(selected_business_type != null) {
            this.business_type_code = this.shop_data.business_type_code
            up_level_id = selected_business_type.text_sample_group_id
          } else {
            this.business_type_code = this.business_type_select[0].business_type_code
            up_level_id = this.business_type_select[0].text_sample_group_id
          }

          const dataSendMain = {
            country_code: this.shop_data.country,
            solution_id:  this.shop_data.solution_id,
            group_level:  2,
            up_level_id:  up_level_id,
            group_type:   options.messages_enums.text_sample_group_type.business_type,
          }

          const textSampleGroupApi = new TextSampleGroupApi()
          const resultMain = await textSampleGroupApi.getTextSampleGroupsAsync(dataSendMain)

          if (!resultMain.is_ok) {
            throw new ApiError(resultMain.error_messages)
          }

          if(resultMain.data.items.length != 0) {
            this.sample_main_group_select = resultMain.data.items
            this.main_group_id = this.sample_main_group_select[0].id

            await this.onLoadSampleSubGroup()
          }
        }
        this.isLoadSample = true
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async onLoadSampleSubGroup() {
      try {
        const dataSend = {
          group_level:  3,
          up_level_id:  this.main_group_id,
          country_code: this.shop_data.country,
          solution_id:  this.shop_data.solution_id,
          group_type:   options.messages_enums.text_sample_group_type.business_type,
        }

        const textSampleGroupApi = new TextSampleGroupApi()
        const result = await textSampleGroupApi.getTextSampleGroupsAsync(dataSend)

        if(!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        this.sample_sub_group_select = result.data.items

        if(result.data.items.length != 0) {
          this.sub_group_id = result.data.items[0].id
        } else {
          this.sub_group_id = 0
        }
        this.onLoadSample()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async onLoadMyMessageCategories(is_create) {
      try {
        this.preLoader()

        const dataSend = {
          page_number: 1,
          shop_id:     this.shop_data.shop_id,
          page_size:   options.pagination.max,
          status:      options.common_status.active,
        }

        const myMessageCategoryApi = new MyMessageCategoryApi()
        const result = await myMessageCategoryApi.getMyMessageCategoriesAsync(dataSend)

        if(!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        this.my_message_category_select = result.data.items

        if(!is_create){
          if(result.data.items.length != 0) this.my_message_category_id = result.data.items[0].id
          else this.my_message_category_id = 0
        }

        this.onLoadSample()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
      this.preLoader(false)
    },

    onSetSampleDataProp(){
      this.sample_data_props = {
        text_sample_group_id:   this.sub_group_id,
        message_type:           this.text_message.fields.message_type,
        country_code:           this.shop_data.country,
        solution_id:            this.shop_data.solution_id,
        text_fees:              this.text_fees.fields,
        mms_type:               this.mms_type,
        list_type:              this.list_type,
        contents:               this.contents, // Todo Delete
        my_message_category_id: this.my_message_category_id,
        shop_id:                this.shop_data.shop_id,
      }
    },

    async onSaveMyMessage(){
      this.onHideToolTip()
      this.showDialogById(this.modal_id)
    },

    async onSaveMyMessageAction(id){
      if(id != 0){
        this.my_message_category_id = id

        this.onSetSampleDataProp()

        this.$nextTick(() => {
          this.$refs.text_sample_list.onActionMyMessage({}, 'createTextMyMessageAsync')
          this.onChangeListType(options.messages_enums.list_type.my_message, true)
        })
      }
    },

    onCreateMyMessage(){
      this.$refs.text_sample_list.onActionMyMessage({
        id:       0,
        contents: null,
      }, 'createTextMyMessageAsync', true)
    },

    async encodeImageFileAsURL(event){
      if (event.target.files.length > 0) {
        const eventFile = event.target.files[0]
        this.checkValidImageWithCallback(this.getFileBlobURL(eventFile), callBackEvent => {
          const fileExtension = eventFile.name.split('.').pop()
          const isInvalidTypeFile = (callBackEvent.type === 'error')
          const isInvalidExt = (!['png', 'jpeg', 'jpg', 'bmp', 'gif'].includes(fileExtension.toLowerCase()))
          const isInvalidNameLength = (eventFile.name.length > common_options.uploadFileValidationRules.maxNameLength)
          if (isInvalidTypeFile || isInvalidExt || isInvalidNameLength) {
            this.showAlert([this.$t('messages.mms-image-error')])
            // this.imageFile = null
          } else {
            this.imageFile = eventFile
            const file_to_load = eventFile
            const file_reader = new FileReader()
            file_reader.readAsDataURL(file_to_load)
            file_reader.onload = (event) => {
              this.mms_image = event.target.result
            }
            this.sampleImagePath = null
          }
        })
      }
    },

    async onInsertSampleText(text){
      if(this.text_message.fields.message_type == options.messages_enums.message_type.mms
          && this.mms_type == options.messages_enums.mms_type.image
          && this.list_type == options.messages_enums.list_type.sample) {
        this.sampleImagePath = text

        const textMessageApi = new TextMessageApi()
        this.preLoader()
        this.mms_image = await textMessageApi.getImageUrl(text)
        this.preLoader(false)
        this.imageFile = null
      }
      else {
        this.contents = text
      }
      setTimeout(()=> this.onCheckLength(), 4)
    },

    async submitActionAsync(is_test = false){
      const tempIsSendNow = this.text_message.fields.is_send_now
      if(is_test) {
        this.text_message.fields.contents = this.contents
        this.text_message.fields.target_count = this.test_mobile_numbers.length

        // Image from (manual(base64) or sample(url))
        if(this.text_message.fields.message_type == options.messages_enums.message_type.mms){
          if(this.sampleImagePath == null) {
            let fileToLoad = null
            if(this.imageFile != null) {
              if(this.imageFile.size > this.text_fees.fields.mms_max_bytes) {
                let uploadedFile = {
                  file: this.imageFile,
                  type: this.imageFile.type,
                  size: this.imageFile.size,
                }
                this.preLoader()
                uploadedFile = await compressFileAsync(uploadedFile, this.text_fees.fields.mms_max_bytes)
                this.preLoader(false)
                fileToLoad = uploadedFile.file
              } else {
                fileToLoad = this.imageFile
              }
              let base64 = await this.toBase64(fileToLoad)
              this.text_message.fields.image_base64 = base64.replace(/^data:image\/(png|jpg|jpeg|bmp|gif);base64,/, '')
              this.text_message.fields.image_url = ''
            }
          } else {
            this.text_message.fields.image_base64 = ''
            this.text_message.fields.image_url = this.imagePath(this.sampleImagePath)
          }
        }

        this.text_message.fields.is_send_now = true
        this.test_mobile_numbers.forEach(e => {
          let receiver = {
            receiver_phone: e,
          }
          this.text_message.fields.receivers.push(receiver)
        })
      }
      else if(!this.text_message.fields.is_send_now){
        this.text_message.fields.target_date_ts = convertDateFromTimezoneToTimestamp(this.target_date)
                                                  + (3600 * Number(this.target_hour)
                                                  + (60 * Number(this.target_minute)))
      }
      this.text_message_errors = this.text_message.isValid()
      if(this.text_message_errors.length == 0) {
        this.text_message.fields.variable_data = null
        if(is_test) {
          if(!emptyValue(this.text_message.fields.contents)){
            this.text_message.fields.contents = replaceAll(this.text_message.fields.contents,this.$t('variable-data.client-name-var', this.shopLanguage), '')
          }
        } else if(this.type == options.messages_enums.send_page.client){
          this.text_message.fields.source_type = options.messages_enums.message_source_type.client
          this.text_message.fields.variable_data = this.$t('variable-data.client-name-var', this.shopLanguage)
          this.text_message.fields.contents = replaceAll(this.text_message.fields.contents,this.$t('variable-data.client-name-var', this.shopLanguage), '#$var1#$')
          let receiver = {
            receiver_phone: this.receivers,
            receiver_key:   this.send_message_data.id,
            var1:           this.send_message_data.client_name,
          }
          this.text_message.fields.receivers.push(receiver)
        } else if(this.isRelatedBookingDeposit) {
          this.text_message.fields.source_type = options.messages_enums.message_source_type.client
          let receiver = {
            receiver_phone: this.receivers,
            receiver_key:   this.bookingDeposit.clientId,
            var1:           this.bookingDeposit.clientName,
          }
          this.text_message.fields.receivers.push(receiver)
        } else if(this.type == options.messages_enums.send_page.cid_unregister_client
                  || this.type == options.messages_enums.send_page.unregister_client){
          this.text_message.fields.source_type = options.messages_enums.message_source_type.client
          let receiver = {
            receiver_phone: this.receivers,
          }
          this.text_message.fields.receivers.push(receiver)
        } else if(this.type == options.messages_enums.send_page.multi_booking){
          this.text_message.fields.source_type = options.messages_enums.message_source_type.booking
          this.text_message.fields.receivers = this.multi_data
          this.text_message.fields.contents = this.replaceVariableToBooking()
          this.text_message.fields.variable_data = this.$t('variable-data.booking-variable_data', this.shopLanguage)
        } else if(this.type == options.messages_enums.send_page.client_management
                  || this.type == options.messages_enums.send_page.campaign){
          this.text_message.fields.source_type = options.messages_enums.message_source_type.client
          this.text_message.fields.receivers = this.multi_data
          this.text_message.fields.contents = replaceAll(this.text_message.fields.contents, this.$t('variable-data.client-name-var', this.shopLanguage), '#$var1#$')
          this.text_message.fields.variable_data = this.$t('variable-data.client-name-var', this.shopLanguage)
        } else if(this.isConsentType) {
          this.text_message.fields.source_type = options.messages_enums.message_source_type.client
          let receiver = {
            receiver_phone: this.receivers,
            receiver_key:   this.send_message_data.id,
            var1:           this.send_message_data.client_name,
          }
          this.text_message.fields.receivers.push(receiver)
        }

        // Call create text message API
        this.preLoader(true)
        let result = {}
        if(this.isConsentType) {
          const text_message_api = new TextMessageApi()
          let dataSend = Object.assign(this.text_message.fields, {
            consentFormId:               this.consent.id,
            clientId:                    this.send_message_data.id,
            solutionId:                  this.shop_data.solution_id,
            consentSupplementAndAnswers: this.storeInputAnswer,
            templateCode:                this.consentMessageSetup.fields.template_code,
            replaceContents:             this.consentMessageSetup.fields.replace_contents,
            isReplaceMessage:            this.consentMessageSetup.fields.is_replace_message,
            replaceMessageType:          this.consentMessageSetup.fields.replace_message_type,
          })
          result = await text_message_api.createConsentTextMessageAsync(dataSend)
        } else {
          const text_message_api = new TextMessageApi()
          result = await text_message_api.createTextMessageAsync(this.text_message.fields)
        }

        if(result.is_ok) {
          if(is_test){
            this.showAlert(new Array(this.$t('messages.test-send-message-success')))
            this.text_message.fields.is_send_now = tempIsSendNow
            this.hideDialogById('send-test-message-modal')
          }
          else {
            this.$emit('reload-page')
          }
          this.revokeMMSImage()
        } else {
          this.showAlert(result.error_messages)
        }
        this.preLoader(false)
      } else {
        this.showAlert(this.text_message_errors)
      }

      // To initialize data in case of failure
      this.text_message.fields.image_base64 = ''
      this.text_message.fields.image_url = ''
      this.text_message.fields.receivers = []
    },

    revokeMMSImage(){
      if (this.mms_image && this.mms_image.startsWith('blob')) {
        window.URL.revokeObjectURL(this.mms_image)
      }
    },

    imagePath(data){
      // eslint-disable-next-line no-undef
      return process.env.AZURE_STORAGE_MESSAGE_URL + data.image_path + '/' + data.image_name
    },

    onSetReceivers(){ // case : Unregister clients
      var temp = this.receiver_phones.split('\n')

      temp.forEach(e => {
        if(!emptyValue(e)) {
          let receiver = {
            receiver_phone: e.replace(/-/g,''),
          }
          if(emptyValue(this.text_message.fields.receivers.find(x => x.receiver_phone == receiver.receiver_phone)))
            this.text_message.fields.receivers.push(receiver)
        }
      })
    },

    async loadNetMoneyBalance(){
      const dataSend = { shop_id: this.shop_data.shop_id }
      const paymentShopUsageApi = new PaymentShopUsageApi()
      this.preLoader(false)
      const result = await paymentShopUsageApi.getPaymentShopUsageAsync(dataSend)
      this.preLoader(false)

      if(result.is_ok) this.targets.netmoney_balance = result.data.net_money_balance
      else this.showAlert(result.error_messages)
    },

    // Set Samples or My messages
    async onChangeListType(list_type, is_create = false){
      this.list_type = list_type
      if(this.list_type == options.messages_enums.list_type.my_message) await this.onLoadMyMessageCategories(is_create)
      else {
        if(!this.isLoadSample) // Already loaded samples
          await this.onLoadMainSample() // Set Main & Sub group samples
        this.onLoadSample()
      }
    },

    onShowSpamPopup(type){
      const routeData = this.$router.resolve({ name: 'spam-info-popup', query: { type: type }})
      window.open(routeData.href, 'name(spam' + type +')', 'location=yes, left= ' + 30 + ', top= ' + 200 + ', width= ' + 590 + ', height=' + 600)
    },

    onAddRejectMessage(){
      if(this.isKr) this.contents += this.$t('messages.reject-message-kr')
      else this.contents += this.$t('messages.reject-message-vn')
      setTimeout(()=> this.onCheckLength(), 4)
    },

    onShowTestMessage(){
      this.onHideToolTip()
      this.showDialogById('send-test-message-modal')
    },

    async onSendTestMessage(mobile_numbers) {
      if (!await this.validateInvalidCharsAsync()) {
        this.hideDialogById('send-test-message-modal')
        return
      }

      if (!this.validateShopNamePlaceholder()) {
        this.hideDialogById('send-test-message-modal')
        return
      }

      this.test_mobile_numbers = mobile_numbers.filter(e => !emptyValue(e))
      await this.submitActionAsync(true)
    },

    replaceVariableToBooking(){
      let contents = ''

      contents = replaceAll(this.text_message.fields.contents, this.$t('variable-data.client-name-var', this.shopLanguage), '#$var1#$')
      contents = replaceAll(contents, this.$t('variable-data.booking-date-var', this.shopLanguage), '#$var2#$')
      contents = replaceAll(contents, this.$t('variable-data.booking-mmdd-var', this.shopLanguage), '#$var3#$')
      contents = replaceAll(contents, this.$t('variable-data.booking-time-var', this.shopLanguage), '#$var4#$')

      return contents
    },

    formatMessageTypeCol(type) {
      return options.messages_enums.message_type_full_format.find(x => x.value === type).text
    },

    // ==================== Validation Methods ====================

    async validateInvalidCharsAsync() {
      if (this.text_message.fields.message_type === options.messages_enums.message_type.kao) {
        return true
      }

      const invalidChars = await getInvalidCharsAsync(this.contents)
      if (invalidChars) {
        const uniq = [...new Set(invalidChars.split(',').map(s => s.trim()).filter(Boolean))].join(', ')
        this.showAlert([this.$t('validate-message.invalid-messages-characters'), `(${uniq})`])
        return false
      }
      return true
    },

    validateAdTextOnly() {
      const contentAll = this.contents.replace(/\s/g, '')
      const adText1 = this.$t('messages.multi-message-info1').replace(/\s/g, '')
      const adText2 = this.$t('messages.multi-message-info2').replace(/\s/g, '')

      if (contentAll === adText1 + adText2 || contentAll === adText1 || contentAll === adText2) {
        this.showAlert([this.$t('validate_messages.include-ad-text')])
        return false
      }
      return true
    },

    validateTargetCount() {
      if (this.text_message.fields.target_count === 0) {
        this.showAlert([this.$t('validate_messages.send-text-message-target')])
        return false
      }
      return true
    },

    validateShopNamePlaceholder() {
      const shopName1 = this.$t('message-autos.shop-name-1')
      const shopName2 = this.$t('message-autos.shop-name-2')

      if (this.contents.includes(shopName1) || this.contents.includes(shopName2)) {
        this._showDialogAlert([this.$t('message-autos.shop-name-check')])
        return false
      }
      return true
    },

    validateConsentLink() {
      const consentLinkVar = this.$t('variable-data.consent-form-link-var', this.shopLanguage)

      // Check consent link exist
      if (!this.contents.includes(consentLinkVar)) {
        this.showAlert([this.$t('validate_messages.please-insert-consent-link')])
        return false
      }

      // Check duplicated consent link
      const consentLinkRegex = new RegExp(`${this.$t('variable-data.consent-form-link-reg', this.shopLanguage)}`, 'g')
      const matches = this.contents.match(consentLinkRegex)
      if (matches?.length > 1) {
        this._showDialogAlert(this.$t('consent.enter-one-consent-link-alert'))
        return false
      }

      return true
    },

    validateConsentLinkSpacing() {
      const consentLinkReg = this.$t('variable-data.consent-form-link-reg', this.shopLanguage)
      const spaceBeforeRegex = new RegExp(`(\\s|^)(${consentLinkReg})`, 'g')
      const spaceAfterRegex = new RegExp(`${consentLinkReg}(?!\\s|$)`, 'g')

      const hasSpaceBeforeConsentLink = (() => {
        const matches = this.contents.matchAll(spaceBeforeRegex)
        for (const match of matches) {
          return match[1] === ' ' || match[1] === '\n' || match[1] === ''
        }
        return false
      })()

      const noHasSpaceAfterConsentLink = this.contents.match(spaceAfterRegex)

      const errors = []
      if (!hasSpaceBeforeConsentLink) {
        errors.push(this.$t('consent.no-has-space-before-consent-link'))
      }
      if (noHasSpaceAfterConsentLink) {
        errors.push(this.$t('consent.no-has-space-after-consent-link'))
      }

      if (errors.length) {
        this._showDialogAlert(errors)
        return false
      }
      return true
    },

    async validateConsentContentLengthAsync() {
      try {
        this.preLoader()
        await this.getSolution({ solutionId: this.shop_data.solution_id })

        if (this.text_message.fields.message_type === options.messages_enums.message_type.kao) {
          return true
        }

        const urlLength = (this.solution.homeURL + LINK_URL + COUNTRY_CODE_QUERY_STRING).length
        const totalLength = urlLength + MAX_LINKKEY_LENGTH

        // Check max content length
        if (this.contents?.length + totalLength > MAX_CONTENT_LENGTH) {
          this.showAlert([this.$t('validate_messages.max-message-contents-length').replace('{0}', totalLength)])
          return false
        }

        // Check max bytes
        if (this.current_bytes + totalLength > this.max_bytes) {
          this.showAlert([
            this.$t('validate_messages.max-message-contents-bytes')
              .replace('{0}', this.max_bytes)
              .replace('{1}', totalLength),
          ])
          return false
        }

        return true
      } catch (error) {
        this._showDialogAlert(error.message)
        return false
      } finally {
        this.preLoader(false)
      }
    },

    async validateConsentTypeAsync() {
      if (!this.isConsentType) {
        return true
      }

      if (this.text_message.fields.message_type !== options.messages_enums.message_type.kao) {
        if (!this.validateConsentLink()) {
          return false
        }
        if (!this.validateConsentLinkSpacing()) {
          return false
        }
      }

      return await this.validateConsentContentLengthAsync()
    },

    setTargetCount() {
      const singleTargetTypes = [
        options.messages_enums.send_page.client,
        options.messages_enums.send_page.cid_unregister_client,
        options.messages_enums.send_page.unregister_client,
      ]

      if (singleTargetTypes.includes(this.type) || this.isRelatedBookingDeposit || this.isConsentType) {
        if (!emptyValue(this.receivers)) {
          this.text_message.fields.target_count = 1
        }
      } else if (this.type === options.messages_enums.send_page.unregister_clients) {
        this.onSetReceivers()
        this.text_message.fields.target_count = this.text_message.fields.receivers.length
      } else if (this.isMultiTarget) {
        if (this.multi_data?.length > 0) {
          this.text_message.fields.target_count = this.multi_data.length
        }
      }
    },

    checkIsNightTimeSpam() {
      const firstRowIndex = this.contents.indexOf('\n')
      const multiMessageInfo = this.$t('messages.multi-message-info1')

      if (firstRowIndex === -1) {
        return !this.contents.includes(multiMessageInfo)
      }

      const firstRowContents = this.contents.substring(0, firstRowIndex)
      return !firstRowContents.includes(multiMessageInfo)
    },

    // ==================== End Validation Methods ====================

    async onCheckLengthBeforeSend() {
      this.text_message.fields.receivers = []
      this.onHideToolTip()

      // Set Target count
      this.setTargetCount()

      // Run validations
      if (!await this.validateInvalidCharsAsync()) return
      if (!this.validateAdTextOnly()) return
      if (!this.validateTargetCount()) return
      if (!this.validateShopNamePlaceholder()) return
      if (!await this.validateConsentTypeAsync()) return

      // Prepare MMS image
      await this.prepareMmsImageAsync()

      // Validate text message
      this.text_message.fields.contents = this.contents
      this.text_message_errors = this.text_message.isValid()
      if (this.text_message_errors.length !== 0) {
        this.showAlert(this.text_message_errors)
        return
      }

      // Set alert data
      this.setAlertData()

      // Check night time texting
      const sendHour = this.text_message.fields.is_send_now
        ? convertDateToTimezone(new Date()).getHours()
        : Number(this.target_hour)

      const isNightTime = sendHour >= NIGHT_TIME_START_HOUR || sendHour < NIGHT_TIME_END_HOUR
      if (this.isMultiTarget && this.isKr && isNightTime) {
        this.isIncludeSpam = this.checkIsNightTimeSpam(sendHour)
        this.$nextTick(() => {
          this.showDialogById(this.confirmNightTimeTextingModalId)
        })
      } else {
        this.showDialogById(this.alert_id)
      }
    },

    async prepareMmsImageAsync() {
      if (this.text_message.fields.message_type !== options.messages_enums.message_type.mms) {
        return
      }

      if (this.sampleImagePath !== null) {
        this.text_message.fields.image_url = this.imagePath(this.sampleImagePath)
        this.text_message.fields.image_base64 = ''
        return
      }

      if (this.imageFile === null) {
        return
      }

      let fileToLoad = this.imageFile
      if (this.imageFile.size > this.text_fees.fields.mms_max_bytes) {
        const uploadedFile = {
          file: this.imageFile,
          type: this.imageFile.type,
          size: this.imageFile.size,
        }
        this.preLoader()
        const compressed = await compressFileAsync(uploadedFile, this.text_fees.fields.mms_max_bytes)
        this.preLoader(false)
        fileToLoad = compressed.file
      }

      const base64 = await this.toBase64(fileToLoad)
      this.text_message.fields.image_base64 = base64.replace(/^data:image\/(png|jpg|jpeg|bmp|gif);base64,/, '')
      this.text_message.fields.image_url = ''
    },

    setAlertData() {
      const fullType = this.$t(
        options.messages_enums.message_type_full.find(x => x.value === this.text_message.fields.message_type).text
      )
      const targetCount = this.text_message.fields.target_count

      if (this.isConsentType) {
        this.alert_type = options.messages_enums.alert_type.none
        this.alert_data = [this.$t('messages.send-message-one').replace('{0}', fullType)]
        return
      }

      const isLmsCanBeDowngraded = this.text_message.fields.message_type === options.messages_enums.message_type.lms
        && this.current_bytes < this.text_fees.fields.sms_max_bytes
        && !this.text_message.fields.contents.includes(this.$t('variable-data.client-name-var'))

      if (isLmsCanBeDowngraded) {
        this.alert_type = options.messages_enums.alert_type.message_type_change
        this.alert_data = targetCount === 1
          ? [this.$t('messages.send-message-change-type-one').replace('{0}', this.text_fees.fields.sms_max_bytes)]
          : [this.$t('messages.send-message-change-type-multi')
              .replace('{0}', this.text_fees.fields.sms_max_bytes)
              .replace('{1}', targetCount)]
      } else {
        this.alert_type = options.messages_enums.alert_type.none
        this.alert_data = targetCount === 1
          ? [this.$t('messages.send-message-one').replace('{0}', fullType)]
          : [this.$t('messages.send-message-multi').replace('{0}', fullType).replace('{1}', targetCount)]
      }
    },

    async onAlertConfirmAsync(){
      if(this.alert_type == options.messages_enums.alert_type.message_type_change) {
        this.text_message.fields.message_type = options.messages_enums.message_type.sms
      }

      await this.submitActionAsync()
    },

    onAlertCancel(){
      this.text_message.fields.receivers = []
    },

    async onNightTimeTextingConfirmAsync() {
      this.showDialogById(this.alert_id)
    },

    onMoveNetmoneyPage(){
      this.$router.push({ name: 'account-payments' })
    },

    onCheckReceiverPhone(e){
      var available = []
      var value = e.which

      for (var i = 48; i < 58; i++) // 0 ~ 9
        available.push(i)
      available.push(45) // -
      available.push(13) // Line

      if (!(available.indexOf(value)>=0))
        e.preventDefault()
    },

    onSetSubGroupId(id){
      this.sub_group_id = id
      this.onLoadSample()
    },

    onMoveSetupAutomaticMessagePage(type){
      this.setSetupAutomaticMessagingInfo({
        tab: type,
      })
      this.$router.push({ name: 'setup-automatic-messaging' })
    },

    onChangeMessageTypeMobile(message_type){
      this.messageTypeBeforeChange = this.text_message.fields.message_type
      this.text_message.fields.message_type = message_type
      this.onChangeMessageType(this.onConfirmChangeMessageTypeLMStoSMS)
    },

    onSaveMessageTypeBeforeChange(){
      this.messageTypeBeforeChange = this.text_message.fields.message_type
      this.$refs.type_select.blur()
    },

    onChangeIsSendNow(value){
      this.text_message.fields.is_send_now = value
    },

    onHideToolTip(){
      this.is_show_character = false
    },

    onAddMiscMyMessageCategory(){
      this.my_message_category_action = {
        action: options.form_actions.add,
      }
      this.setMyMessageCategoryActionData(this.my_message_category_action).then(() => {
        this.showDialogById(this.modal_id2)
      })
    },

    onAddMiscMyMessageCategoryReloadPage(){
      this.onLoadMyMessageCategories(false)
    },

    onSetSenderNumber(){
      if(this.x_user.user_role_code === options.user_roles.staff)
        this.showAlert([this.$t('messages.do-not-have-permission-to-setup')])
      else
        this.$router.push({ name: 'message-sender-numbers' })
    },

    formatBookingDateVariable(bookingDate, isContainMonth){
      let format = ''

      if(isContainMonth) {
        if(this.shop_data.country == options.country.kr) {
          format = 'MM월 DD일(ddd)'
        }
        else {
          format = 'DD(ddd) MMM.'
        }
      } else {
        if(this.shop_data.country == options.country.kr) {
          format = 'DD일(ddd)'
        }
        else {
          format = 'DD(ddd)'
        }
      }

      if(this.shop_data.country == options.country.kr)
        return moment(bookingDate).locale('ko').format(format)
      else
        return moment(bookingDate).locale('en').format(format)
    },

    formatBookingTimeVariable(bookingDate) {
      let tempTime = moment(bookingDate).format('HH:mm')

      if (tempTime.substring(3, 5) != '00') {
        tempTime = tempTime + this.$t('messages.minutes', this.shopLanguage) // 17:30
      }
      else {
        tempTime = tempTime.substring(0, 3) // 17:00
      }

      return tempTime.replace(':', this.$t('messages.hour', this.shopLanguage) + ' ')
    },

    formatDueDate(dueDate, user_language, locale) {
      let format = ''

      if(user_language === options.language.korean)
        format = 'MM월 DD일 HH시 mm분'
      else
        format = 'DD MMM [at] HH:mm'

      return moment(dueDate).locale(locale).format(format)
    },

    async onLoadBookingSetupAsync() {
      try {
        let setupType = 0
        if(this.type == options.messages_enums.send_page.deposit_guide)
          setupType = options.messages_enums.setup_automatic_messaging_type.booking.deposit_guide
        else
          setupType = options.messages_enums.setup_automatic_messaging_type.booking.deposit_payment_confirm

        this.preLoader()
        const result = await this.messageSetupBookingApi.getMessageSetupBookingListAsync({
          shop_id:    this.shop_data.shop_id,
          setup_type: setupType,
        })

        if (!result.is_ok) {
          this.showAlert(result?.error_messages || [])
          return
        }

        this.messageSetup = result.data.items[0]
        if(this.messageSetup.fields.id > 0 && this.messageSetup.fields.status == options.common_status.active) {
          this.text_message.fields.message_type = this.messageSetup.fields.message_type
          let replacedContents = this.messageSetup.fields.contents

          replacedContents = replaceAll(replacedContents, this.$t('variable-data.client-name-var', this.shopLanguage), this.bookingDeposit.clientName)
          replacedContents = replaceAll(replacedContents, this.$t('variable-data.booking-date-var', this.shopLanguage), this.formatBookingDateVariable(this.bookingDeposit.bookingDate, false))
          replacedContents = replaceAll(replacedContents, this.$t('variable-data.booking-mmdd-var', this.shopLanguage), this.formatBookingDateVariable(this.bookingDeposit.bookingDate, true))
          replacedContents = replaceAll(replacedContents, this.$t('variable-data.booking-time-var', this.shopLanguage), this.formatBookingTimeVariable(this.bookingDeposit.bookingDate))

          if(this.type == options.messages_enums.send_page.deposit_guide) {
            let locale = ''
            if(this.shop_data.country === options.country.kr) locale = 'ko'
            else locale = 'en'

            replacedContents = replaceAll(replacedContents, this.$t('variable-data.deposit-amount-var', this.shopLanguage), this.formatMoney(this.bookingDeposit.deposit, 0))
            replacedContents = replaceAll(replacedContents, this.$t('variable-data.deposit-payment-duedate-var', this.shopLanguage), this.formatDueDate(this.bookingDeposit.dueDate, this.shopLanguage, locale))
            replacedContents = replaceAll(replacedContents, this.$t('variable-data.deposit-payment-duedate-time-var', this.shopLanguage), this.formatBookingTimeVariable(this.bookingDeposit.dueDate))
          }else {
            replacedContents = replaceAll(replacedContents, this.$t('variable-data.deposit-payment-amount-var', this.shopLanguage), this.formatMoney(this.bookingDeposit.paidAmount, 0))
          }
          this.contents = replacedContents

          this.$nextTick(() => {
            this.onChangeMessageType(this.onConfirmChangeMessageType)
          })
        } else {
          this.contents = ''
          this.isShowBookingDepositInfo = true
        }
      } catch (error) {
        this.showAlert([error?.message || ''])
      } finally {
        this.preLoader(false)
      }
    },

    async onLoadConsentSetupAsync() {
      try {
        this.preLoader()
        const dataSend = {
          shop_id: this.shop_data.shop_id,
        }
        const result = await this.consentMessageSetup.getContsendMessageSetupAsync(dataSend)
        const consentSetup = result?.items[0] || {}

        if(consentSetup.fields.id > 0 && consentSetup.fields.status == options.common_status.active) {
          this.consentMessageSetup = consentSetup
          this.text_message.fields.message_type = consentSetup.fields.message_type
          let replacedContents = consentSetup.fields.contents

          if(this.text_message.fields.message_type === options.messages_enums.message_type.kao) {
            replacedContents = replaceAll(replacedContents, /#{/, '((')
            replacedContents = replaceAll(replacedContents, /}/, '))')
            replacedContents = replaceAll(replacedContents, '((매장명))', this.messageAutosShop?.fields?.alimtalk_shop_name)
            replacedContents = replaceAll(replacedContents, '((전화번호))', checkNullAndEmptyAndUndefined(this.messageAutosShop?.fields?.sender_phone) ? '' : formatMobileAndPhoneNumber(this.messageAutosShop?.fields?.sender_phone))

            this.consentMessageSetup.fields.replace_contents = replaceAll(this.consentMessageSetup.fields.replace_contents, this.$t('variable-data.client-name-var', this.shopLanguage), this.send_message_data.client_name)
            this.consentMessageSetup.fields.replace_contents = replaceAll(this.consentMessageSetup.fields.replace_contents, this.$t('variable-data.consent-form-title-var', this.shopLanguage), this.consent.title)
          }

          replacedContents = replaceAll(replacedContents, this.$t('variable-data.client-name-var', this.shopLanguage), this.send_message_data.client_name)
          replacedContents = replaceAll(replacedContents, this.$t('variable-data.consent-form-title-var', this.shopLanguage), this.consent.title)

          this.contents = replacedContents

          this.$nextTick(() => {
            this.onCheckLength()
          })
        } else {
          this.contents = ''
        }
      } catch (error) {
        this.showAlert([error?.message || ''])
      } finally {
        this.preLoader(false)
      }
    },

    async onLoadShopInfoAsync() {
      try {
        this.preLoader()
        const dataSend = {
          shop_id: this.shop_data.shop_id,
        }
        const result = await this.messageAutosShop.getMessageAutosShopInfoAsync(dataSend)
        this.messageAutosShop = result
        this.alimtalkData = {
          alimtalkShopName: this.messageAutosShop.fields.alimtalk_shop_name,
          senderPhone:      this.messageAutosShop.fields.sender_phone,
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onMoveConsentSetupPage() {
      if(this.x_user.user_role_code === options.user_roles.staff)
        this.showAlert([this.$t('messages.do-not-have-permission-to-setup')])
      else
        this.$router.push('/setup/consent-message-setup')
    },

    onCancel() {
      this.$emit('cancel-page')
    },

    async toBase64(imageFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(imageFile)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
    },

    checkValidImageWithCallback(imgSrc, callback) {
      const img = document.createElement('img')
      img.src = imgSrc
      img.onload = callback
      img.onerror = callback
    },

    getFileBlobURL(file) {
      const URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        return URL.createObjectURL(file)
      }
      return ''
    },

    onShowModalSendMessageAhaAi() {
      this.isShowModalSendMessageAhaAi = true
    },

    onCancelModalSendMessageAhaAi() {
      this.isShowModalSendMessageAhaAi = false
    },

    onConfirmSaveMyMessageSuccess(myMessageCategoryId) {
      this.my_message_category_id = myMessageCategoryId
      this.onSetSampleDataProp()
      this.onChangeListType(options.messages_enums.list_type.my_message, true)
    },

    onUseMessage(item) {
      this.contents = item.content

      this.$nextTick(() => {
        this.onCheckLength(this.onConfirmChangeMessageType)
      })
    },

    resetModalSendMessageAhaAi() {
      this.$refs.modalSendMessageAhaAi.reset()
    },
  },
}
</script>

<style lang='scss'>
@import './send-message-action.scss';
</style>
