export class ClassesColors{
    rgbCodes: number[][] = [];
    constructor(classesQuantity: number) {
        const preCodedClassesColors = [
            [0, 255, 0],
            [255, 0, 0],
            [0, 0, 255],
            [255, 255, 0],
            [0, 255, 255],
            [255, 0, 255],
            [0, 125, 0],
            [125, 0, 0],
            [0, 0, 125],
            [125, 125, 0]
        ];
        for (let i = 0; i < classesQuantity; i++) {
            this.rgbCodes.push(preCodedClassesColors[i]);
        }
        this.rgbCodes.push([0, 0, 0]); // point seletor on mapping
        this.rgbCodes.push([1, 1, 1]); // gradient coloring variable
    }
}
