import jsPDF from 'jspdf'

// import raw font data (base64 hoặc binary string, tuỳ bạn build từ ttf -> js)
import NanumGothicBold from '../utils/fonts/NanumGothic-ExtraBold-bold'
import NanumGothicRegular from '../utils/fonts/NanumGothic-Regular-normal'

export function registerFonts() {
  jsPDF.API.events.push([
    'addFonts',
    () => {
      jsPDF.API.addFileToVFS('NanumGothic-Regular.ttf', NanumGothicRegular)
      jsPDF.API.addFont('NanumGothic-Regular.ttf', 'NanumGothic', 'normal')
      jsPDF.API.addFileToVFS('NanumGothic-Bold.ttf', NanumGothicBold)
      jsPDF.API.addFont('NanumGothic-Bold.ttf', 'NanumGothic', 'bold')
    },
  ])
}
