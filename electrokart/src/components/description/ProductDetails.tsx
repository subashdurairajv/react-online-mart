import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addToCart, removeFromCart } from '../store/cartSlice';


export interface ProductDetail {
    id: number;
    product_name: string;
    product_category: string;
    image_url: string;
    product_description: string;
    price: number,
    product_quantity: string
}

type Message = {
    message: string
}

const ProductDetails: React.FC = () => {
    const { id } = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [message, setMessage] = useState<Message>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();


    const fetchProductDetail = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/fetchProduct/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
            });
            return response.json()
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchProductDetail();
            if (data?.success === true) {
                setProductDetail(data?.data[0])
            }
            else {
                setMessage({ message: 'Fetch Failed due to unavoidable reasons! Please try again.' })
            }

        };

        loadData();
    }, [])

    const currentCount = cartItems.find(item => item.id === productDetail?.id)?.count || 0;
    const totalItems = cartItems.reduce((sum, item) => sum + item.count, 0);

    console.log(productDetail)

    return (
        <div className='d-flex flex-column min-vh-100'>
            {productDetail && <Container className="mt-5">
                <h1 className='mb-4'>Product Description</h1>
                <div style={{ display: 'flex', flexDirection: 'row', flex: 1}}>
                    <div >
                        <img src={productDetail.image_url} className="" style={{ width: "70%", height: '100%' }} alt="Image" />
                    </div>
                  <div style={{textAlign: 'left', flex: 1}}>
                <h5 className="card-title text-primary">{productDetail?.product_name}</h5>
                    <p className="card-text mt-2">{productDetail?.product_description}</p>
              
                    <p className="card-text">{`Price: `}<span className='fw-bold'>{`$${productDetail?.price}`}</span></p>
                    <p className="card-text text-success">{`In Stock: ${productDetail?.product_quantity}`}</p>
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => dispatch(removeFromCart(productDetail.id))}
                                                                    disabled={currentCount === 0}
                                                                > - </button>
                                                                
                                                                <span className="fw-bold px-2">{currentCount}</span>
                    
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => dispatch(addToCart({ ...productDetail, product_quantity: parseInt(productDetail.product_quantity) }))}
                                                                    disabled={currentCount >= parseInt(productDetail.product_quantity)}
                                                                > + </button>
                                                            </div>
                </div>
                
                </div>
                
            </Container>
            }
            <div className="mt-auto p-3 text-white text-center sticky-bottom" style={{ backgroundColor: "dodgerblue" }}>
                <button 
                    className="btn btn-light" 
                    onClick={() => navigate('/cart', { replace: true })}
                >
                    View Cart <span className="badge bg-secondary ms-2">{totalItems}</span>
                </button>
            </div>
        </div>

    );
};

export default ProductDetails;