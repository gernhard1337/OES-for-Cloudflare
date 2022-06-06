import {oBJECT} from "../OESjs-Core0/OES-Foundation";
export class SingleProductShop extends oBJECT {
    constructor({ id, name, quantityInStock, reorderLevel, targetInventory}) {
        super( id, name);
        this.quantityInStock = quantityInStock;
        this.reorderLevel = reorderLevel;
        this.targetInventory = targetInventory;
    }
}
SingleProductShop.labels = {"quantityInStock":"stock"};