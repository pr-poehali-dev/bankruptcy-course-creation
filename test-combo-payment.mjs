import fetch from 'node-fetch';

async function testComboPayment() {
    const paymentData = {
        email: "test-combo-final@example.com",
        amount: 1.0,
        name: "Final Test Combo",
        product_type: "combo",
        return_url: "https://bankrot-kurs.ru/payment/success"
    };

    console.log('Creating test combo payment...');
    console.log('Request data:', JSON.stringify(paymentData, null, 2));

    try {
        const response = await fetch('https://functions.poehali.dev/b3f3dab4-093d-45bf-98cb-86512e00886b?action=create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        console.log('\nResponse status:', response.status);
        
        const data = await response.json();
        console.log('\nResponse data:', JSON.stringify(data, null, 2));

        if (response.ok && data.confirmation_url) {
            console.log('\n✅ Payment created successfully!');
            console.log('Payment ID:', data.payment_id);
            console.log('Purchase ID:', data.purchase_id);
            console.log('Status:', data.status);
            console.log('\n🔗 Confirmation URL:');
            console.log(data.confirmation_url);
        } else {
            console.log('\n❌ Error creating payment:');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('\n❌ Network error:', error.message);
    }
}

testComboPayment();
