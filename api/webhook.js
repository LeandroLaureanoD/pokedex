module.exports = function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  console.log('Webhook recebido:', request.body);

  return response.status(200).json({
    success: true,
    message: 'Webhook recebido com sucesso',
    data: request.body
  });
};