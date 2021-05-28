import { ClassesColors } from './classesColors';
import { DatasetValue } from './datasetValue';

export class Layer {
    classesColors = new ClassesColors();
    dataHeader: string;
    dataset: DatasetValue[] = [];
    datasetLength: number;
    latitudeHeader: string;
    longitudeHeader: string;
    name: string;
    constructor(name: string, latitudeHeader: string, longitudeHeader: string, dataHeader: string, datasetLength: number) {
        this.name = name;
        this.latitudeHeader = latitudeHeader;
        this.longitudeHeader = longitudeHeader;
        this.dataHeader = dataHeader;
        this.datasetLength = datasetLength;
    }
}
