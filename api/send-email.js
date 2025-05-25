import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://www.neidsoft.com'); // Cambia según tu dominio
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar petición preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, email, message } = req.body;

  // Validar campos requeridos
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  // Configurar transporter con Zoho
  const transporter = nodemailer.createTransport({
    service: 'Zoho',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'info@neidsoft.com',
      pass: 'KrQfXG2R5PmS', // ⚠️ Asegúrate de guardar esto en variables de entorno en producción
    }
  });

  const mailOptions = {
    from: 'info@neidsoft.com',
    to: 'info@neidsoft.com',
    subject: `Nuevo mensaje de contacto de ${name}`,
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    res.status(200).json({ message: 'Correo enviado exitosamente!' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo.', error: error.message });
  }
}
