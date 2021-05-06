export class KrigingSelectorResult {
    isi: number;
    method: string;
    model: string;
    nuggetEffect: number;
    range: number;
    partialSill: number;
    constructor(isi: number, method: string, model: string, nuggetEffect: number, range: number, partialSill: number) {
        this.isi = isi;
        this.method = method;
        this.model = model;
        this.nuggetEffect = nuggetEffect;
        this.range = range;
        this.partialSill = partialSill;
    }
}
