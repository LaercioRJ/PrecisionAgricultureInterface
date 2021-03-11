import { DatasetValue } from './datasetValue';

export class Layer {
    layerName: string;
    latitudeHeader: string;
    longitudeHeader: string;
    dataHeader: string;
    datasetLength: number;
    dataset: DatasetValue[] = [];
    constructor(layerName: string, latitudeHeader: string, longitudeHeader: string, dataHeader: string, datasetLength: number) {
        this.layerName = layerName;
        this.latitudeHeader = latitudeHeader;
        this.longitudeHeader = longitudeHeader;
        this.dataHeader = dataHeader;
        this.datasetLength = datasetLength;
    }
}
