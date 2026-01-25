import { Entity, Column, CreateDateColumn, PrimaryColumn } from "typeorm";

interface ProductItem {
    id: number,
    product_name: string;
    price: number;
    count: number;
    image_url: string;
    product_quantity: number
}

@Entity("cart_orders")
export class CartOrder {
    @PrimaryColumn()
    cart_id!: string;

    @Column()
    user_id!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    total_cost!: number;

    @Column("simple-json")
    products!: ProductItem[];

    @CreateDateColumn()
    created_at!: Date;
}