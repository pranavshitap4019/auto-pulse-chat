export interface VehicleData {
  vin: string;
  label: string;
  status: 'healthy' | 'warning' | 'critical';
}

export const VEHICLE_DATA: VehicleData[] = [
  { vin: "5YJ3E1EA7KF317000", label: "Tesla Model 3 · 2019", status: "healthy" },
  { vin: "1HGCM82633A004352", label: "Honda Accord · 2003", status: "warning" },
  { vin: "JTDKB20U793123456", label: "TCS Car · 2025", status: "healthy" },
  { vin: "1FADP3F22EL123456", label: "Ford Focus · 2014", status: "critical" },
  { vin: "WDDGF8AB4EA123456", label: "Mercedes C250 · 2014", status: "warning" },
  { vin: "1FTFW1ET5DFC12345", label: "Ford F-150 · 2013", status: "healthy" },
  { vin: "1C4RJFAG2EC123456", label: "Jeep Grand Cherokee · 2014", status: "critical" },
  { vin: "2T1BURHE9JC123456", label: "Toyota Corolla · 2018", status: "healthy" },
  { vin: "1N4AL3AP8JC123456", label: "Nissan Altima · 2018", status: "warning" },
  { vin: "KMHD84LF3JU123456", label: "Hyundai Elantra · 2018", status: "healthy" }
];

export const getDummyFleetSummary = () => {
  const healthy = VEHICLE_DATA.filter(v => v.status === 'healthy').length;
  const warning = VEHICLE_DATA.filter(v => v.status === 'warning').length;
  const critical = VEHICLE_DATA.filter(v => v.status === 'critical').length;
  
  return {
    total: VEHICLE_DATA.length,
    healthy,
    warning,
    critical,
    vehicles: VEHICLE_DATA
  };
};