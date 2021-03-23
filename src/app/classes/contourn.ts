export class Contourn {
    fileName;
    latitudeHeader;
    longitudeHeader;
    coordinates: number[][] = [];
    constructor(fileName: string, latitudeHeader: string, longitudeheader: string) {
        this.fileName = fileName;
        this.latitudeHeader = latitudeHeader;
        this.longitudeHeader = longitudeheader;
    }
}
