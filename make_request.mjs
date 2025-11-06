// Simple Node.js script to send POST request
// Run with: node make_request.mjs

const url = 'https://functions.poehali.dev/44b67bea-4c0b-4f2d-833a-f5adc60d9567';

const data = {
  email: 'melni-v@yandex.ru',
  name: 'Владимир',
  password: '123456'
};

async function sendRequest() {
  try {
    console.log('Sending POST request to:', url);
    console.log('With data:', JSON.stringify(data, null, 2));
    console.log('');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log('Status:', response.status, response.statusText);
    console.log('');

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      console.log('Response (JSON):');
      console.log(JSON.stringify(responseData, null, 2));
    } else {
      responseData = await response.text();
      console.log('Response (Text):');
      console.log(responseData);
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    };
  } catch (error) {
    console.error('Error occurred:', error.message);
    throw error;
  }
}

sendRequest().catch(console.error);
