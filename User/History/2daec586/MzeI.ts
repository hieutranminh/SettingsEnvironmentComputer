import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

export default {
  install: (app: any) => {
    app.use(PrimeVue, {
      ripple: true,
      inputStyle: 'outlined'
    })
  }
}
