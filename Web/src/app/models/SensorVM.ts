export class SensorVM {
    ID_sensor: number;
    sensorid: string;
    name: string;
    type: string;
    manufacturer: string;
    model: string;
    version: string;
    manuf_date: Date;
    description: string;
    mac_address: string;
    chipset: string;
    status?: number;    
    first_install_date?: Date;
    last_install_date?: Date;
    calibration_date?: Date;
    last_service_date?: Date;
    battery_install_date?: Date;
    sensor_set_point?: Date;
    company: number;
}

export class SearchSensorVM {
    TotalRows: number;
    ID_sensor: number;
    sensorid: string;
    name: string;
    type: string;
    manufacturer: string;
    model: string;
    version: string;
    manuf_date?: Date;
    description: string;
    mac_address: string;
    chipset: string;
    status?: number;    
    first_install_date?: Date;
    last_install_date?: Date;
    calibration_date?: Date;
    last_service_date?: Date;
    battery_install_date?: Date;
    sensor_set_point?: Date;
    company: number;
}