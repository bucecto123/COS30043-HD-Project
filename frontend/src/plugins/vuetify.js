import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#E53935',
          secondary: '#161A1D',
          accent: '#FFB300',
          error: '#DC2626',
          info: '#1976D2',
          success: '#2E7D32',
          warning: '#FFB300',
          background: '#FFF8F3',
          surface: '#FFFFFF'
        }
      }
    }
  }
})
