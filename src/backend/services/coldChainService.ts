export interface ReeferFleetUnit {
  vanNumber: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  currentTempCelsius: number;
  targetTempCelsius: number;
  humidityPercent: number;
  batteryReservePercent: number;
  solarInputWatts: number;
  activeOrdersCount: number;
  tamperSealIntact: boolean;
  status: 'optimal' | 'warning' | 'standby';
}

export const FLEET_DATABASE: ReeferFleetUnit[] = [
  {
    vanNumber: 'MH-15-EG-4402',
    driverName: 'Santosh Yadav',
    driverPhone: '+91 98230 11204',
    currentLocation: 'Samruddhi Expressway KM 112 (Thane Bound)',
    currentTempCelsius: 3.4,
    targetTempCelsius: 3.5,
    humidityPercent: 88,
    batteryReservePercent: 96,
    solarInputWatts: 420,
    activeOrdersCount: 14,
    tamperSealIntact: true,
    status: 'optimal',
  },
  {
    vanNumber: 'MH-04-AX-9912',
    driverName: 'Mahesh Kulkarni',
    driverPhone: '+91 98190 44521',
    currentLocation: 'Bandra Kurla Complex Last-Mile Dock',
    currentTempCelsius: 3.2,
    targetTempCelsius: 3.0,
    humidityPercent: 85,
    batteryReservePercent: 91,
    solarInputWatts: 380,
    activeOrdersCount: 8,
    tamperSealIntact: true,
    status: 'optimal',
  },
  {
    vanNumber: 'MH-12-PQ-7710',
    driverName: 'Rajendra Deshmukh',
    driverPhone: '+91 97650 33819',
    currentLocation: 'Nashik Agro-Logistics Cluster Hub',
    currentTempCelsius: 2.9,
    targetTempCelsius: 3.0,
    humidityPercent: 90,
    batteryReservePercent: 99,
    solarInputWatts: 510,
    activeOrdersCount: 22,
    tamperSealIntact: true,
    status: 'optimal',
  },
  {
    vanNumber: 'MH-14-BT-3091',
    driverName: 'Vikas Shinde',
    driverPhone: '+91 98900 77412',
    currentLocation: 'Western Express Highway, Goregaon',
    currentTempCelsius: 4.8,
    targetTempCelsius: 3.5,
    humidityPercent: 82,
    batteryReservePercent: 84,
    solarInputWatts: 290,
    activeOrdersCount: 6,
    tamperSealIntact: true,
    status: 'warning',
  },
];

export const coldChainService = {
  getFleetStatus(): ReeferFleetUnit[] {
    return FLEET_DATABASE;
  },

  getUnitTelemetry(vanNumber: string): ReeferFleetUnit | undefined {
    return FLEET_DATABASE.find((v) => v.vanNumber === vanNumber);
  },

  updateTemperature(vanNumber: string, newTemp: number): ReeferFleetUnit | null {
    const unit = FLEET_DATABASE.find((v) => v.vanNumber === vanNumber);
    if (!unit) return null;
    unit.currentTempCelsius = newTemp;
    unit.status = newTemp > 4.5 ? 'warning' : 'optimal';
    return unit;
  },
};
