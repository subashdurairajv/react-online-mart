import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


interface Location {
    lat: number,
    lng: number
}

@Entity("products")
export class Products {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    product_name!: string;

    @Column()
    product_category!: string;

    @Column()
    image_url!: string;

    @Column()
    product_description!: string;

    @Column()
    price!: number;

    @Column()
    product_quantity!: string;

    @Column("simple-json")
        location!: Location[];
}