# KISVAN POS Payment Integration - Document Analysis

## 1. Architecture Overview

```
[WEB App] --WebSocket--> [AGENT] --RS-232--> [CAT Terminal] --TCP/IP--> [KIS-VAN Server]
   |                        ^
   |                        |
[POS S/W] ----TCP/IP-------+
(KisPosAgent.ocx)
```

### Components
| Component | Role | Protocol |
|-----------|------|----------|
| **WEB** | Web application (frontend) | WebSocket (WS/WSS) |
| **POS S/W** | Desktop POS software (optional, uses OCX) | TCP/IP |
| **AGENT** | Middleware installed on local machine, bridges web/POS to CAT | TCP/IP + RS-232 |
| **CAT** | Card Authorization Terminal (physical card reader device) | RS-232 (to Agent) + TCP/IP (to VAN) |
| **KIS-VAN** | KIS payment network server (processes transactions) | TCP/IP |

---

## 2. Document Relationship Map

### Document 1: `09. KisPosAgentGuide(CAT).docx`
**Role**: HIGH-LEVEL INTEGRATION GUIDE (How to connect & use)

Contains:
- WebSocket connection setup (WS `localhost:1516`, WSS `localhost:1517`)
- JavaScript code samples for connect/send/receive
- JSON message format examples
- CAT device configuration in Agent settings
- Receipt printing guidance

### Document 2: `10. KisPosAgentDevelopGuide(POS-KIS)_250929.xlsx`
**Role**: DETAILED API SPECIFICATION (What data to send & receive)

Contains:
- Sheet 1: Architecture diagram
- Sheet 2: Service categories (transaction types)
- Sheet 3: Request/Response field specifications (mandatory/optional per transaction type)
- Sheet 4: CAT response signal types and error handling
- Sheet 5: Agent rejection error codes

### Document 3: `KIS-7400 POS Printer Command.pdf`
**Role**: RECEIPT PRINTER HARDWARE SPEC (How to print receipts)

Contains:
- RS-232C serial communication settings
- ESC/POS command reference for KIS-7400 thermal printer
- Text formatting, barcode printing, paper cutting commands

### How They Relate

```
[Doc 1: Integration Guide] --> Explains HOW to connect (WebSocket + JSON)
         |
         v
[Doc 2: API Spec]          --> Defines WHAT data fields to send/receive
         |
         v
[Doc 3: Printer Commands]  --> Shows HOW to print receipts after payment
```

**Flow**: Connect (Doc 1) → Send/Receive Payment (Doc 2) → Print Receipt (Doc 3)

---

## 3. Supported Transaction Types

| Service | Type | Code | Description |
|---------|------|------|-------------|
| Credit Card | Approval | D1 | Credit card payment |
| Credit Card | Cancel | D2 | Credit card cancellation |
| Cash Receipt | Approval | CC | Cash receipt issuance |
| Cash Receipt | Cancel | CR | Cash receipt cancellation |

All transactions use `inTranCode = "UC"` (POS-KIS CAT mode).

---

## 4. Integration Steps (Detailed)

### Step 1: Prerequisites
- KIS POS Agent software must be installed on the local machine
- CAT terminal device must be connected via RS-232 (serial port)
- Agent must be configured: Device Settings → Check "Use CAT" → Set COM port & baud rate

### Step 2: WebSocket Connection
```javascript
// WS (unencrypted)
const ws = new WebSocket("ws://localhost:1516/endpoint");

// WSS (encrypted - recommended)
const ws = new WebSocket("wss://localhost:1517/endpoint");
```

### Step 3: Build Payment Request (JSON)
```json
{
  "KIS_ICApproval": {
    "inTranCode": "UC",
    "inTradeType": "D1",
    "inInstallment": "00",
    "inTranAmt": "1004",
    "inVatAmt": "",
    "inSvcAmt": "",
    "inPrintYN": "Y"
  }
}
```

### Step 4: Send Request & Handle Response
- Send JSON via `webSocket.send(message)`
- Listen for response via `webSocket.onmessage`
- Parse response JSON containing approval results

### Step 5: Handle Response Codes
| Code | Meaning |
|------|---------|
| `outReplyCode = "0000"` | Success |
| `outAgentCode = "0000"` | Normal Agent communication |
| `outAgentCode = "UC12"` | Card removed before recognition |
| `outAgentCode = "UC13"` | Timeout or EXIT pressed |
| `outAgentCode = "UC14"` | Message format error |

### Step 6: Print Receipt (Optional)
Use ESC/POS commands sent to KIS-7400 printer:
- `ESC @` (0x1B 0x40) - Initialize printer
- `ESC a n` (0x1B 0x61 n) - Align text (0=left, 1=center, 2=right)
- `ESC E n` (0x1B 0x45 n) - Bold on/off
- `GS ! n` (0x1D 0x21 n) - Set character size
- `GS k` (0x1D 0x6B) - Print barcode
- `ESC i` (0x1B 0x69) - Cut paper
- `LF` (0x0A) - Line feed

---

## 5. Key Request Fields (Mandatory for Credit Approval D1)

| # | Field | Description | Max Size |
|---|-------|-------------|----------|
| 1 | inTranCode | "UC" fixed | 2 |
| 2 | inTradeType | "D1" for credit approval | 2 |
| 3 | inCatId | Terminal ID (default from Agent) | 8 |
| 6 | inInstallment | Installment months ("00" = lump sum) | 2 |
| 7 | inTranAmt | Payment amount | 12 |
| 13 | inTranNo | Transaction sequence number | 4 |
| 20 | inPrintYN | "Y" to print / "N" to skip | 1 |

## 6. Key Response Fields

| # | Field | Description |
|---|-------|-------------|
| 1 | outTranCode | "UC" |
| 2 | outAgentCode | "0000" = success |
| 4 | outWCC | "C" = IC card, "@" = Cash Receipt |
| 5 | outCardNo | Card number (masked) |
| 6 | outInstallment | Installment months |
| 7 | outTranAmt | Total amount |
| 10 | outAuthNo | Approval number |
| 11 | outTradeReqTime | Transaction datetime (yymmddhhmmss) |
| 14 | outAccepterCode | Acquirer code |
| 15 | outAccepterName | Acquirer name |
| 20 | outReplyCode | "0000" = normal |
| 21 | outReplyMsg1 | Error description if abnormal |

---

## 7. CAT Response Signal Handling

| Signal | Meaning | Action |
|--------|---------|--------|
| ACK (5 bytes) | CAT status normal | Proceed, wait for payment data |
| EOT (5 bytes) | Payment error/timeout/cancel | Handle as failed transaction |
| ACK + EOT | Card inserted then removed | Handle as failed |
| NAK (5 bytes) | Message format error | Check request format |

**Important**: ACK/EOT may arrive fragmented (not complete 5-byte blocks). Exception handling required.

---

## 8. Important Notes

1. **Timeout**: 120 seconds (longer due to signature time)
2. **CAT Cancel**: Once data is sent to CAT, cancel must be done on the CAT terminal physically (not via web)
3. **IC Card**: When "Please remove IC card" is displayed, payment will NOT proceed until card is removed
4. **Receipt**: Message length for receipt printing must not exceed 4096 bytes
5. **Printer Communication**: RS-232C, default baud rate options: 9600-115200
