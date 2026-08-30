import type {
  VercelRequest,
  VercelResponse
} from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
): void {

  if (request.method !== 'POST') {
    response.status(405).json({
      success: false,
      message: 'Método não permitido'
    });

    return;
  }

  console.log(
    'Webhook recebido:',
    request.body
  );

  response.status(200).json({
    success: true,
    message: 'Webhook recebido com sucesso',
    data: request.body
  });
}