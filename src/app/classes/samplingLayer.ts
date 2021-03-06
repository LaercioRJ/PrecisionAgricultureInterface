import { DatasetValue } from './datasetValue';

export class SamplingLayer {
    latitudeHeader: string;
    longitudeHeader: string;
    dataHeader: string;
    datasetLength: number;
    dataset: DatasetValue[] = [];
    constructor(latitudeHeader: string, longitudeHeader: string, dataHeader: string, datasetLength: number) {
        this.latitudeHeader = latitudeHeader;
        this.longitudeHeader = longitudeHeader;
        this.dataHeader = dataHeader;
        this.datasetLength = datasetLength;
    }
}
