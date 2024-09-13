import CheckoutStripe from '../stripe/buttonProducts';

export default function ListButtonsMaps() {
    const products = [
        {
            name: '1 Super Point',
            priceId: 'price_1PuAYAP4rVLS4DImVQ2x3c25',
            price: '10',
            description: 'Acheter 1 Super Point'
        },
        {
            name: '5 Super Points',
            priceId: 'price_1Pv0OTP4rVLS4DIml24noZ3P',
            price: '40',
            description: 'Acheter 5 Super Points'
        }
    ];

    return (
        <div className="absolute top-16 right-4 flex flex-col gap-1">
            {products.map((product) => (
                <CheckoutStripe
                    key={product.priceId}
                    priceId={product.priceId}
                    price={product.price}
                    description={product.description}
                />
            ))}
        </div>
    );
}
