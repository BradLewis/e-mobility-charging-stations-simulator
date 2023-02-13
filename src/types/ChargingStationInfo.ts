import type { ChargingStationTemplate, FirmwareStatus } from './internal';

export type ChargingStationInfo = Omit<
  ChargingStationTemplate,
  | 'AutomaticTransactionGenerator'
  | 'Configuration'
  | 'power'
  | 'powerUnit'
  | 'chargeBoxSerialNumberPrefix'
  | 'chargePointSerialNumberPrefix'
  | 'meterSerialNumberPrefix'
> & {
  hashId: string;
  infoHash?: string;
  chargingStationId?: string;
  chargeBoxSerialNumber?: string;
  chargePointSerialNumber?: string;
  meterSerialNumber?: string;
  maximumPower?: number; // Always in Watt
  maximumAmperage?: number; // Always in Ampere
  firmwareStatus?: FirmwareStatus;
};

export type ChargingStationInfoConfiguration = {
  stationInfo?: ChargingStationInfo;
};
