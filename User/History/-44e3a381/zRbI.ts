import type { App } from 'vue'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

export function setupVCalendar(app: App): void {
  app.use(VCalendar, {})
}

