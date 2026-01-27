import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './ProductsMap.css'
import 'leaflet/dist/images/marker-shadow.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import { addToCart, removeFromCart } from '../components/store/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../components/store';
import { useNavigate } from 'react-router-dom';
import { ProductDetail } from '../components/description/ProductDetails';
import { Products } from '../components/shop/ShopGridwall';

// Fix for default marker icons in React
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface ProductMapProps {
    products: Products[] | null;
}

// interface Product {
//     id: number;
//     name: string;
//     price: number;
//     lat: number;
//     lng: number;
// }


const ProductMap: React.FC<ProductMapProps> = ({ products }) => {
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const getProductCount = (id: number) => {
        return cartItems.find(item => item.id === id)?.count || 0;
    };
    const currentCount = productDetail && getProductCount(productDetail?.id)

    console.log('testCart', products)

    // 1. Logic to handle map clicks
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                console.log('selLoc', e.latlng.lat, e.latlng.lng)
                setSelectedLocation([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };

    // 2. Filter products within 3km of the clicked point
    const nearbyProducts = useMemo(() => {
        if (!selectedLocation) return [];

        const userPoint = L.latLng(selectedLocation[0], selectedLocation[1]);

        return (products ?? [])?.filter(p => {


            const { lat = 12.12, lng = 80.12 } = p?.location && p?.location.length && p?.location?.[0] || {}

            const productPoint = L.latLng(lat, lng);
            return userPoint.distanceTo(productPoint) <= 3000; // 3000 meters = 3km
        });
    }, [selectedLocation, products]);

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header text-white" style={{ backgroundColor: 'dodgerblue' }}>
                Find Products Near You (Click on the map)
            </div>
            <div className='mapContainer'>
                <MapContainer
                    center={[12.8352, 80.2011]}
                    zoom={13}
                    style={{ height: '450px', width: 'auto', zIndex: 1, flex: 1 }}      >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapEvents />

                    {selectedLocation && (
                        <>
                            {/* The 3km Area */}
                            <Circle
                                center={selectedLocation}
                                radius={3000}
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                            />

                            {/* The User's Selection Marker */}
                            <Marker position={selectedLocation} icon={DefaultIcon}>
                                <Popup>Your Location</Popup>
                            </Marker>

                            {/* Filtered Products */}
                            {nearbyProducts.map(product => {
                                const { lat = 12.12, lng = 80.12 } = product?.location && product?.location.length && product?.location?.[0] || {}
                                return (

                                    <Marker
                                        key={product.id}
                                        position={[lat, lng]}
                                        icon={DefaultIcon}
                                        eventHandlers={{
                                            click: () => {
                                                // console.log("Marker clicked:", product.product_name);
                                                setProductDetail(product); // Update state on click
                                            },
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-center">
                                                <h6>{product.product_name}</h6>
                                                <p className="mb-1 text-success fw-bold">${product.price}</p>
                                                <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => dispatch(removeFromCart(product.id))}
                            // disabled={currentCount === 0}
                            > - </button>

                            <span className="fw-bold px-2">{currentCount}</span>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => dispatch(addToCart({ ...product, product_quantity: parseInt(product.product_quantity) }))}
                            // disabled={currentCount >= parseInt(productDetail.product_quantity)}
                            > + </button>
                        </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            }
                            )}
                        </>
                    )}
                </MapContainer>
                <div style={{ flex: 1 }}>
                    <h3>Product Details</h3>
                    {productDetail && (<>
                        <h5 className="card-title text-primary">{productDetail?.product_name}</h5>
                        <div >
                            <img src={productDetail.image_url} className="" style={{ width: "40%", height: '50%' }} alt="Image" />
                        </div>
                        {/* <p className="card-text mt-2">{productDetail?.product_description}</p> */}

                        <p className="card-text">{`Price: `}<span className='fw-bold'>{`$${productDetail?.price}`}</span></p>
                        <p className="card-text text-success">{`In Stock: ${productDetail?.product_quantity}`}</p>
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => dispatch(removeFromCart(productDetail.id))}
                            // disabled={currentCount === 0}
                            > - </button>

                            <span className="fw-bold px-2">{currentCount}</span>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => dispatch(addToCart({ ...productDetail, product_quantity: parseInt(productDetail.product_quantity) }))}
                            // disabled={currentCount >= parseInt(productDetail.product_quantity)}
                            > + </button>
                        </div>
                    </>)}
                </div>
            </div>
            <div className="card-footer text-muted small">
                {selectedLocation
                    ? `Showing ${nearbyProducts.length} products within 3km of your selection.`
                    : "Click anywhere on the map to see local availability."}
            </div>
        </div>
    );
};

export default ProductMap;