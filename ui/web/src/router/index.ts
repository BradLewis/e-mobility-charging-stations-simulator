import { createRouter, createWebHistory } from 'vue-router'
import ChargingStationsView from '@/views/ChargingStationsView.vue'
import StartTransaction from '@/components/actions/StartTransaction.vue'
import AddChargingStations from '@/components/actions/AddChargingStations.vue'
import SetSupervisionUrl from '@/components/actions/SetSupervisionUrl.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'charging-stations',
      components: {
        default: ChargingStationsView
      }
    },
    {
      path: '/add-charging-stations',
      name: 'add-charging-stations',
      components: {
        default: ChargingStationsView,
        action: AddChargingStations
      }
    },
    {
      path: '/set-supervision-url/:hashId/:chargingStationId',
      name: 'set-supervision-url',
      components: {
        default: ChargingStationsView,
        action: SetSupervisionUrl
      },
      props: { default: false, action: true }
    },
    {
      path: '/start-transaction/:hashId/:chargingStationId/:connectorId',
      name: 'start-transaction',
      components: {
        default: ChargingStationsView,
        action: StartTransaction
      },
      props: { default: false, action: true }
    }
  ]
})
