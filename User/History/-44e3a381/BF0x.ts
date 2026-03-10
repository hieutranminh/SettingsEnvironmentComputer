import type { App } from 'vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

export function setupVCalendar(app: App): void {
  app.use(setupCalendar, {})
  app.component('VCalendar', Calendar)
  app.component('VDatePicker', DatePicker)
}
