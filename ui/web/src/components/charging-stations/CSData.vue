<template>
  <tr class="cs-table__row">
    <td class="cs-table__column">
      {{ props.chargingStation.stationInfo.chargingStationId }}
    </td>
    <td class="cs-table__column">{{ props.chargingStation.started === true ? 'Yes' : 'No' }}</td>
    <td class="cs-table__column">
      {{ getSupervisionUrl() }}
    </td>
    <td class="cs-table__column">{{ getWSState() }}</td>
    <td class="cs-table__column">
      {{ props.chargingStation?.bootNotificationResponse?.status ?? 'Ø' }}
    </td>
    <td class="cs-table__column">
      {{ props.chargingStation.stationInfo.templateName }}
    </td>
    <td class="cs-table__column">{{ props.chargingStation.stationInfo.chargePointVendor }}</td>
    <td class="cs-table__column">{{ props.chargingStation.stationInfo.chargePointModel }}</td>
    <td class="cs-table__column">
      {{ props.chargingStation.stationInfo.firmwareVersion ?? 'Ø' }}
    </td>
    <td class="cs-table__column">
      <Button @click="startChargingStation()">Start Charging Station</Button>
      <Button @click="stopChargingStation()">Stop Charging Station</Button>
      <Button
        @click="
          $router.push({
            name: 'set-supervision-url',
            params: {
              hashId: props.chargingStation.stationInfo.hashId,
              chargingStationId: props.chargingStation.stationInfo.chargingStationId
            }
          })
        "
      >
        Set Supervision Url
      </Button>
      <Button @click="openConnection()">Open Connection</Button>
      <Button @click="closeConnection()">Close Connection</Button>
      <Button @click="deleteChargingStation()">Delete Charging Station</Button>
    </td>
    <td class="cs-table__connectors-column">
      <table id="connectors-table">
        <thead id="connectors-table__head">
          <tr class="connectors-table__row">
            <th scope="col" class="connectors-table__column">Identifier</th>
            <th scope="col" class="connectors-table__column">Status</th>
            <th scope="col" class="connectors-table__column">Transaction</th>
            <th scope="col" class="connectors-table__column">ATG Started</th>
            <th scope="col" class="connectors-table__column">Actions</th>
          </tr>
        </thead>
        <tbody id="connectors-table__body">
          <!-- eslint-disable-next-line vue/valid-v-for -->
          <CSConnector
            v-for="(connector, index) in getConnectorStatuses()"
            :hash-id="props.chargingStation.stationInfo.hashId"
            :charging-station-id="props.chargingStation.stationInfo.chargingStationId"
            :connector-id="index + 1"
            :connector="connector"
            :atg-status="getATGStatus(index + 1)"
          />
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { useToast } from 'vue-toast-notification'
import CSConnector from '@/components/charging-stations/CSConnector.vue'
import Button from '@/components/buttons/Button.vue'
import type { ChargingStationData, ConnectorStatus, Status } from '@/types'

const props = defineProps<{
  chargingStation: ChargingStationData
}>()

const getConnectorStatuses = (): ConnectorStatus[] => {
  if (Array.isArray(props.chargingStation.evses) && props.chargingStation.evses.length > 0) {
    const connectorStatuses: ConnectorStatus[] = []
    for (const [evseId, evseStatus] of props.chargingStation.evses.entries()) {
      if (evseId > 0 && Array.isArray(evseStatus.connectors) && evseStatus.connectors.length > 0) {
        for (const connectorStatus of evseStatus.connectors) {
          connectorStatuses.push(connectorStatus)
        }
      }
    }
    return connectorStatuses
  }
  return props.chargingStation.connectors?.slice(1)
}
const getATGStatus = (connectorId: number): Status | undefined => {
  return props.chargingStation.automaticTransactionGenerator
    ?.automaticTransactionGeneratorStatuses?.[connectorId - 1]
}
const getSupervisionUrl = (): string => {
  const supervisionUrl = new URL(props.chargingStation.supervisionUrl)
  return `${supervisionUrl.protocol}//${supervisionUrl.host.split('.').join('.\u200b')}`
}
const getWSState = (): string => {
  switch (props.chargingStation?.wsState) {
    case WebSocket.CONNECTING:
      return 'Connecting'
    case WebSocket.OPEN:
      return 'Open'
    case WebSocket.CLOSING:
      return 'Closing'
    case WebSocket.CLOSED:
      return 'Closed'
    default:
      return 'Ø'
  }
}

const uiClient = getCurrentInstance()?.appContext.config.globalProperties.$uiClient

const $toast = useToast()

const startChargingStation = (): void => {
  uiClient
    .startChargingStation(props.chargingStation.stationInfo.hashId)
    .then(() => {
      $toast.success('Charging station successfully started')
    })
    .catch((error: Error) => {
      $toast.error('Error at starting charging station')
      console.error('Error at starting charging station', error)
    })
}
const stopChargingStation = (): void => {
  uiClient
    .stopChargingStation(props.chargingStation.stationInfo.hashId)
    .then(() => {
      $toast.success('Charging station successfully stopped')
    })
    .catch((error: Error) => {
      $toast.error('Error at stopping charging station')
      console.error('Error at stopping charging station', error)
    })
}
const openConnection = (): void => {
  uiClient
    .openConnection(props.chargingStation.stationInfo.hashId)
    .then(() => {
      $toast.success('Connection successfully opened')
    })
    .catch((error: Error) => {
      $toast.error('Error at opening connection')
      console.error('Error at opening connection', error)
    })
}
const closeConnection = (): void => {
  uiClient
    .closeConnection(props.chargingStation.stationInfo.hashId)
    .then(() => {
      $toast.success('Connection successfully closed')
    })
    .catch((error: Error) => {
      $toast.error('Error at closing connection')
      console.error('Error at closing connection', error)
    })
}
const deleteChargingStation = (): void => {
  uiClient
    .deleteChargingStation(props.chargingStation.stationInfo.hashId)
    .then(() => {
      $toast.success('Charging station successfully deleted')
    })
    .catch((error: Error) => {
      $toast.error('Error at deleting charging station')
      console.error('Error at deleting charging station', error)
    })
}
</script>

<style>
#connectors-table {
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: auto hidden;
  border-collapse: collapse;
  empty-cells: show;
}

#connectors-table__body {
  display: flex;
  flex-direction: column;
}

.connectors-table__row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: solid 0.25px black;
}

.connectors-table__row:nth-of-type(even) {
  background-color: whitesmoke;
}

#connectors-table__head .connectors-table__row {
  background-color: lightgrey;
}

.connectors-table__column {
  width: calc(100% / 5);
  text-align: center;
}
</style>
