async function generateImage(prompt) {
    return await axios.post('https://api.openai.com/v1/images/generations', JSON.stringify({
        'prompt': `${prompt}`,
        'n': 1,
        'size': '256x256'
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
    }).then(function (response) {
        return response.data.data[0].url;
    })
        .catch(function (error) {
            console.log(`Image genrator failed with the error: ${error}`)
            return '';
        });
    } 