import { Contourn } from './contourn';
import { Layer } from './layer';

export class SamplingLayer extends Layer{
    contourn!: Contourn;
    idwExpoent = 0;
    radius = 0;
    neighbors = 0;
    pixelX = 0;
    pixelY = 0;
    krigingModel = '';
    krigingMethod = '';
    partialSill = 0;
    range = 0;
}
