export const completeChat = async (req, res, next) => {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.My_Key_1}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
      max_tokens: 512
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
  }
};