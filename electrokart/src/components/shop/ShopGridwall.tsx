import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addToCart, removeFromCart } from '../store/cartSlice';
import ProductMap from '../../mapLeaflet/ProductsMap';
import 'leaflet/dist/leaflet.css';

export interface LatLang {
    lat:number
    lng:number;
}

export interface Products {
    id: number;
    product_name: string;
    product_category: string;
    image_url: string;
    product_description: string;
    price: number;
    product_quantity: string;
    location: LatLang[]
}

interface Product {
  id: number;
  name: string;
  price: number;
  lat: number;
  lng: number;
}

const ShopGridwall: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const cartItems = useSelector((state: RootState) => state.cart.items);
    
    const [products, SetProducts] = useState<Products[] | null>(null);

    console.log('testSuccess123', products)
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/fetchProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            return response.json();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchProducts();
            if (data?.success === true) {
                console.log('testSuccess', data)
                SetProducts(data?.data);
            } else {
                console.log('Fech Failed!')
            }
        };
        loadData();
    }, []);

    const handleProductView = (item: Products) => {
        navigate(`/product/${item?.id}`);
    };

    const getProductCount = (id: number) => {
        return cartItems.find(item => item.id === id)?.count || 0;
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.count, 0);

    const product : Product[]  = products?.map((item) => {
        const loc = item.location && item.location.length > 0 
                ? item.location[0] 
                : { lat: 12.8352, lng: 80.2011 };
        return {
            id: item?.id,
            name: item?.product_name,
            price: item?.price,
            lat: loc?.lat || 12.5,
            lng: loc?.lng || 80.12
        }
    }) || []

    console.log(cartItems, products,'cartItems')
    return (
        <>

            <Container className="mt-5">
                <ProductMap products={products} />

                <Row>
                    {typeof products === 'object' && products?.map((item) => {
                        const currentCount = getProductCount(item.id);
                        
                        return (
                            <Col key={item?.id} xs={12} md={6} lg={3} className='mb-4 p-0'>
                                <div className="card text-bg-light h-100 mx-2">
                                    <Button 
                                        variant="light" 
                                        className="p-0 border-0" 
                                        onClick={() => handleProductView(item)}
                                    >
                                        <img src={item?.image_url} className="card-img-top p-3" alt="Product" style={{ height: '200px', objectFit: 'contain' }} />
                                    </Button>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-primary">{item?.product_name}</h5>
                                        <div className="d-flex justify-content-center gap-2">
                                            <p className="card-text fw-bold">${item?.price}</p>
                                            <p className="card-text text-success">Stock: {item?.product_quantity}</p>
                                        </div>

                                        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                disabled={currentCount === 0}
                                            > - </button>
                                            
                                            <span className="fw-bold px-2">{currentCount}</span>

                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => dispatch(addToCart({ ...item, product_quantity: parseInt(item.product_quantity) }))}
                                                disabled={currentCount >= parseInt(item.product_quantity)}
                                            > + </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Container>

            <div className="sticky-bottom p-3 text-white text-center" style={{ backgroundColor: "dodgerblue" }}>
                <button 
                    className="btn btn-light" 
                    onClick={() => navigate('/cart')}
                >
                    View Cart <span className="badge bg-secondary ms-2">{totalItems}</span>
                </button>
            </div>
        </>
    );
};

export default ShopGridwall;