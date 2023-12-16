import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function HomePage({featuredProduct, newProducts}){
    return (
        <div>
            <Header />
            <Featured product={featuredProduct} />
            <NewProducts products={newProducts}/>
        </div>
    );
}

export async function getServerSideProps(){
    await mongooseConnect();
    /*const featuredProduct = {
        _id: '655170dfa2271ba3d551e171',
        title: 'Macbook 14 Pro',
        category: {id:1, name:'Notebooks'},
        description: 'Lorem ipsumm f sd fsd f sd fsdf sdflsdf sk dfsld fsdf f fsd f dfsd fds fds fdgfdg fdg fd gdfg dfgdfgdfg dfgdfgdfgdf gdfgdfgdf gdfgdf g',
        price: 1595,
        images: ['https://mycommerce-e2.s3.amazonaws.com/1701945942450.png'],
        properties: {Cor: 'Branco'}
    }*/
   /* const newProducts = [
        featuredProduct,
        featuredProduct,
        featuredProduct,
        featuredProduct,
        featuredProduct,
        featuredProduct,
        featuredProduct,
        featuredProduct,
        featuredProduct
    ];*/
    const featuredProduct = await Product.findById('6559f56c03f7b4e5f71d6942');
    const newProducts = await Product.find({}, null, {sort: {'_id' : -1}});
    return {
        props: { 
            featuredProduct : JSON.parse(JSON.stringify(featuredProduct)),
            newProducts : JSON.parse(JSON.stringify(newProducts)),
        }
    };
}