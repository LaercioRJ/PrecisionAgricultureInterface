import { Layer } from './layer';

export class ZmLayer extends Layer {
    rectificationMethod = '';
    kernelSize = 0;
    kernelFormat = '';
    iterations = 0;

    discoverHigherClass(): number {
        let higherClass = 0;
        for (let i = 0; i < this.datasetLength; i++) {
            if (higherClass < this.dataset[i].data) {
                higherClass = this.dataset[i].data;
            }
        }
        return higherClass;
    }
}
