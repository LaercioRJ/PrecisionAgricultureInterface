import { DatasetValue } from './datasetValue';

export class Layer {
    name: string;
    latitudeHeader: string;
    longitudeHeader: string;
    dataHeader: string;
    datasetLength: number;
    dataset: DatasetValue[] = [];
    constructor(name: string, latitudeHeader: string, longitudeHeader: string, dataHeader: string, datasetLength: number) {
        this.name = name;
        this.latitudeHeader = latitudeHeader;
        this.longitudeHeader = longitudeHeader;
        this.dataHeader = dataHeader;
        this.datasetLength = datasetLength;
    }
}
