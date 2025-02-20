import {
  ApplicationProtocol,
  AuthenticationType,
  type ChargingStationOptions,
  ProcedureName,
  type ProtocolResponse,
  type RequestPayload,
  type ResponsePayload,
  ResponseStatus,
  type UIServerConfigurationSection
} from '@/types'

type ResponseHandler = {
  procedureName: ProcedureName
  resolve: (value: ResponsePayload | PromiseLike<ResponsePayload>) => void
  reject: (reason?: unknown) => void
}

export class UIClient {
  private static instance: UIClient | null = null

  private ws!: WebSocket
  private responseHandlers: Map<string, ResponseHandler>

  private constructor(private uiServerConfiguration: UIServerConfigurationSection) {
    this.openWS()
    this.responseHandlers = new Map<string, ResponseHandler>()
  }

  public static getInstance(uiServerConfiguration: UIServerConfigurationSection): UIClient {
    if (UIClient.instance === null) {
      UIClient.instance = new UIClient(uiServerConfiguration)
    }
    return UIClient.instance
  }

  public setConfiguration(uiServerConfiguration: UIServerConfigurationSection): void {
    this.ws.close()
    this.uiServerConfiguration = uiServerConfiguration
    this.openWS()
  }

  public registerWSEventListener<K extends keyof WebSocketEventMap>(
    event: K,
    listener: (event: WebSocketEventMap[K]) => void
  ) {
    this.ws.addEventListener(event, listener)
  }

  public async startSimulator(): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.START_SIMULATOR, {})
  }

  public async stopSimulator(): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.STOP_SIMULATOR, {})
  }

  public async listTemplates(): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.LIST_TEMPLATES, {})
  }

  public async listChargingStations(): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.LIST_CHARGING_STATIONS, {})
  }

  public async addChargingStations(
    template: string,
    numberOfStations: number,
    options?: ChargingStationOptions
  ): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.ADD_CHARGING_STATIONS, {
      template,
      numberOfStations,
      options
    })
  }

  public async deleteChargingStation(hashId: string): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.DELETE_CHARGING_STATIONS, { hashIds: [hashId] })
  }

  public async setSupervisionUrl(hashId: string, supervisionUrl: string): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.SET_SUPERVISION_URL, {
      hashIds: [hashId],
      url: supervisionUrl
    })
  }

  public async startChargingStation(hashId: string): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.START_CHARGING_STATION, { hashIds: [hashId] })
  }

  public async stopChargingStation(hashId: string): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.STOP_CHARGING_STATION, { hashIds: [hashId] })
  }

  public async openConnection(hashId: string): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.OPEN_CONNECTION, {
      hashIds: [hashId]
    })
  }

  public async closeConnection(hashId: string): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.CLOSE_CONNECTION, {
      hashIds: [hashId]
    })
  }

  public async startTransaction(
    hashId: string,
    connectorId: number,
    idTag: string | undefined
  ): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.START_TRANSACTION, {
      hashIds: [hashId],
      connectorId,
      idTag
    })
  }

  public async stopTransaction(
    hashId: string,
    transactionId: number | undefined
  ): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.STOP_TRANSACTION, {
      hashIds: [hashId],
      transactionId
    })
  }

  public async startAutomaticTransactionGenerator(
    hashId: string,
    connectorId: number
  ): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.START_AUTOMATIC_TRANSACTION_GENERATOR, {
      hashIds: [hashId],
      connectorIds: [connectorId]
    })
  }

  public async stopAutomaticTransactionGenerator(
    hashId: string,
    connectorId: number
  ): Promise<ResponsePayload> {
    return this.sendRequest(ProcedureName.STOP_AUTOMATIC_TRANSACTION_GENERATOR, {
      hashIds: [hashId],
      connectorIds: [connectorId]
    })
  }

  private openWS(): void {
    const protocols =
      this.uiServerConfiguration.authentication?.enabled === true &&
      this.uiServerConfiguration.authentication?.type === AuthenticationType.PROTOCOL_BASIC_AUTH
        ? [
            `${this.uiServerConfiguration.protocol}${this.uiServerConfiguration.version}`,
            `authorization.basic.${btoa(`${this.uiServerConfiguration.authentication.username}:${this.uiServerConfiguration.authentication.password}`).replace(/={1,2}$/, '')}`
          ]
        : `${this.uiServerConfiguration.protocol}${this.uiServerConfiguration.version}`
    this.ws = new WebSocket(
      `${this.uiServerConfiguration.secure === true ? ApplicationProtocol.WSS : ApplicationProtocol.WS}://${this.uiServerConfiguration.host}:${this.uiServerConfiguration.port}`,
      protocols
    )
    this.ws.onopen = openEvent => {
      console.info('WebSocket opened', openEvent)
    }
    this.ws.onmessage = this.responseHandler.bind(this)
    this.ws.onerror = errorEvent => {
      console.error('WebSocket error: ', errorEvent)
    }
    this.ws.onclose = closeEvent => {
      console.info('WebSocket closed: ', closeEvent)
    }
  }

  private async sendRequest(
    procedureName: ProcedureName,
    payload: RequestPayload
  ): Promise<ResponsePayload> {
    return new Promise<ResponsePayload>((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        const uuid = crypto.randomUUID()
        const msg = JSON.stringify([uuid, procedureName, payload])
        const sendTimeout = setTimeout(() => {
          this.responseHandlers.delete(uuid)
          return reject(new Error(`Send request '${procedureName}' message: connection timeout`))
        }, 60000)
        try {
          this.ws.send(msg)
          this.responseHandlers.set(uuid, { procedureName, resolve, reject })
        } catch (error) {
          this.responseHandlers.delete(uuid)
          reject(error)
        } finally {
          clearTimeout(sendTimeout)
        }
      } else {
        reject(new Error(`Send request '${procedureName}' message: connection closed`))
      }
    })
  }

  private responseHandler(messageEvent: MessageEvent<string>): void {
    const response = JSON.parse(messageEvent.data) as ProtocolResponse

    if (Array.isArray(response) === false) {
      throw new Error(`Response not an array: ${JSON.stringify(response, undefined, 2)}`)
    }

    const [uuid, responsePayload] = response

    if (this.responseHandlers.has(uuid) === true) {
      const { procedureName, resolve, reject } = this.responseHandlers.get(uuid)!
      switch (responsePayload.status) {
        case ResponseStatus.SUCCESS:
          resolve(responsePayload)
          break
        case ResponseStatus.FAILURE:
          reject(responsePayload)
          break
        default:
          reject(
            new Error(
              `Response status for procedure '${procedureName}' not supported: '${responsePayload.status}'`
            )
          )
      }
      this.responseHandlers.delete(uuid)
    } else {
      throw new Error(`Not a response to a request: ${JSON.stringify(response, undefined, 2)}`)
    }
  }
}
