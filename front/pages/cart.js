import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Center from "@/components/Center";
import WhiteBox from "@/components/WhiteBox";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px){
        grid-template-columns: 1.3fr .8fr;
    }
    gap: 40px;
    margin-top: 40px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 70px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px){
        padding: 10px;
        width: 100px;
        height: 100px;
        img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 10px;
    display: block;
    @media screen and (min-width: 768px){
        display: inline-block;
        padding: 0 10px;
    }
`;

export default function CartPage(){
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [buyer, setBuyer] = useState({
        name: '',
        email: '',
        city: '',
        postalCode: '',
        streetAddress: '',
        country: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
        if(cartProducts.length > 0){
            axios.post('api/cart', {ids:cartProducts})
            .then(response => {
                setProducts(response.data);        
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);
    useEffect(() =>{
        if(window.location.href.includes('success')){
            setIsSuccess(true);
            clearCart();
        }
    },[])
    function moreOfThisProduct(id){
        addProduct(id);
    }
    function lessOfThisProduct(id){
        removeProduct(id);
    }
    async function goToPayment(){
        const response = await axios.post('api/checkout',{
            buyer, cartProducts
        })
        if(response.data.url){
            window.location = response.data.url
        }
    }
    let total = 0;
    for (const productId of cartProducts){
        const price = products.find(p => p._id == productId)?.price || 0;
        total += price;
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBuyer(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(buyer);
    };
    if(isSuccess){
        return(
            <>
                <Header/>
                <Center>
                    <ColumnsWrapper>
                        <WhiteBox>
                            <h1>Thanks for your order</h1>
                            <p>We will email when your order will be sent.</p>
                        </WhiteBox>
                    </ColumnsWrapper>
                </Center>
            </>
        )
    }
    return (
        <>
            <Header/>
            <Center>
            <ColumnsWrapper>
                <WhiteBox>
                    <h2>Cart</h2>
                    {!cartProducts.length &&(
                        <div>Your cart is empty</div>
                    )}
                    {products?.length >0 &&(
                        <Table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product =>(
                                    <tr key={product._id}>
                                        <ProductInfoCell>
                                            <ProductImageBox>
                                                <img src={product.images[0]} />
                                            </ProductImageBox>
                                            {product.title}
                                        </ProductInfoCell>
                                        <td>
                                            <Button
                                                onClick={() => lessOfThisProduct(product._id)
                                            }>-
                                            </Button>
                                            <QuantityLabel>
                                                {cartProducts.filter(id => id=== product._id).length}
                                            </QuantityLabel>
                                            <Button 
                                                onClick={() => moreOfThisProduct(product._id)
                                            }>+
                                            </Button>
                                        </td>
                                        <td>${cartProducts.filter(id => id=== product._id).length * product.price}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>${total}</td>
                                </tr>
                            </tbody>
                        </Table>
                    )}
                </WhiteBox>
                {!!cartProducts?.length &&(
                    <WhiteBox>
                        <h2>Order Information</h2>
                        <Input type="text" placeholder="Name" name="name" onChange={handleChange} value={buyer.name}/>
                        <Input type="text" placeholder="Email" name="email" onChange={handleChange} value={buyer.email}/>
                        <CityHolder>
                            <Input type="text" placeholder="City" name="city" onChange={handleChange} value={buyer.city}/>
                            <Input type="text" placeholder="Postal code" name="postalCode" onChange={handleChange} value={buyer.postalCode}/>
                        </CityHolder>
                        <Input type="text" placeholder="Street Address" name="streetAddress" onChange={handleChange} value={buyer.streetAddress}/>
                        <Input type="text" placeholder="Country" name="country" onChange={handleChange} value={buyer.country}/>
                        <input type="hidden" name="products" value={cartProducts.join(',')} />
                        <Button black block onClick={goToPayment}>Continue to payment</Button>
                    </WhiteBox>
                )}
            </ColumnsWrapper>
            </Center>
        </>
    );
}