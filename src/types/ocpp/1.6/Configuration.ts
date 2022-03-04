export enum OCPP16SupportedFeatureProfiles {
  Core = 'Core',
  Firmware_Management = 'FirmwareManagement',
  Local_Auth_List_Management = 'LocalAuthListManagement',
  Reservation = 'Reservation',
  Smart_Charging = 'SmartCharging',
  Remote_Trigger = 'RemoteTrigger',
}

export enum OCPP16StandardParametersKey {
  AllowOfflineTxForUnknownId = 'AllowOfflineTxForUnknownId',
  AuthorizationCacheEnabled = 'AuthorizationCacheEnabled',
  AuthorizeRemoteTxRequests = 'AuthorizeRemoteTxRequests',
  BlinkRepeat = 'BlinkRepeat',
  ClockAlignedDataInterval = 'ClockAlignedDataInterval',
  ConnectionTimeOut = 'ConnectionTimeOut',
  GetConfigurationMaxKeys = 'GetConfigurationMaxKeys',
  HeartBeatInterval = 'HeartBeatInterval',
  HeartbeatInterval = 'HeartbeatInterval',
  LightIntensity = 'LightIntensity',
  LocalAuthorizeOffline = 'LocalAuthorizeOffline',
  LocalPreAuthorize = 'LocalPreAuthorize',
  MaxEnergyOnInvalidId = 'MaxEnergyOnInvalidId',
  MeterValuesAlignedData = 'MeterValuesAlignedData',
  MeterValuesAlignedDataMaxLength = 'MeterValuesAlignedDataMaxLength',
  MeterValuesSampledData = 'MeterValuesSampledData',
  MeterValuesSampledDataMaxLength = 'MeterValuesSampledDataMaxLength',
  MeterValueSampleInterval = 'MeterValueSampleInterval',
  MinimumStatusDuration = 'MinimumStatusDuration',
  NumberOfConnectors = 'NumberOfConnectors',
  ResetRetries = 'ResetRetries',
  ConnectorPhaseRotation = 'ConnectorPhaseRotation',
  ConnectorPhaseRotationMaxLength = 'ConnectorPhaseRotationMaxLength',
  StopTransactionOnEVSideDisconnect = 'StopTransactionOnEVSideDisconnect',
  StopTransactionOnInvalidId = 'StopTransactionOnInvalidId',
  StopTxnAlignedData = 'StopTxnAlignedData',
  StopTxnAlignedDataMaxLength = 'StopTxnAlignedDataMaxLength',
  StopTxnSampledData = 'StopTxnSampledData',
  StopTxnSampledDataMaxLength = 'StopTxnSampledDataMaxLength',
  SupportedFeatureProfiles = 'SupportedFeatureProfiles',
  SupportedFeatureProfilesMaxLength = 'SupportedFeatureProfilesMaxLength',
  TransactionMessageAttempts = 'TransactionMessageAttempts',
  TransactionMessageRetryInterval = 'TransactionMessageRetryInterval',
  UnlockConnectorOnEVSideDisconnect = 'UnlockConnectorOnEVSideDisconnect',
  WebSocketPingInterval = 'WebSocketPingInterval',
  LocalAuthListEnabled = 'LocalAuthListEnabled',
  LocalAuthListMaxLength = 'LocalAuthListMaxLength',
  SendLocalListMaxLength = 'SendLocalListMaxLength',
  ReserveConnectorZeroSupported = 'ReserveConnectorZeroSupported',
  ChargeProfileMaxStackLevel = 'ChargeProfileMaxStackLevel',
  ChargingScheduleAllowedChargingRateUnit = 'ChargingScheduleAllowedChargingRateUnit',
  ChargingScheduleMaxPeriods = 'ChargingScheduleMaxPeriods',
  ConnectorSwitch3to1PhaseSupported = 'ConnectorSwitch3to1PhaseSupported',
  MaxChargingProfilesInstalled = 'MaxChargingProfilesInstalled',
}

export enum OCPP16VendorDefaultParametersKey {
  ConnectionUrl = 'ConnectionUrl',
}
