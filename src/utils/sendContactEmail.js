import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendContactEmail = async ({ name, email, phone, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_HOST,
      subject: "🌞 Nueva Consulta de Paneles Solares - " + name,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Consulta de Paneles Solares</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header con gradiente solar -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%); padding: 30px 20px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 40px;">☀️</div>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                Nueva Consulta de Paneles Solares
              </h1>
              <p style="color: #fef3c7; margin: 10px 0 0; font-size: 16px; opacity: 0.9;">
                Un cliente potencial está interesado en energía solar
              </p>
            </div>

            <!-- Contenido principal -->
            <div style="padding: 40px 30px;">
              
              <!-- Información del cliente -->
              <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 25px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 22px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background-color: #f59e0b; color: white; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 16px;">👤</span>
                  Información del Cliente
                </h2>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="background-color: #dbeafe; color: #1e40af; padding: 8px; border-radius: 6px; margin-right: 15px; font-weight: 600; min-width: 80px; text-align: center; font-size: 14px;">NOMBRE</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">${name}</span>
                  </div>
                  
                  <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="background-color: #dcfce7; color: #166534; padding: 8px; border-radius: 6px; margin-right: 15px; font-weight: 600; min-width: 80px; text-align: center; font-size: 14px;">EMAIL</span>
                    <a href="mailto:${email}" style="color: #059669; font-size: 16px; text-decoration: none; font-weight: 500;">${email}</a>
                  </div>
                  
                  <div style="display: flex; align-items: center; padding: 12px 0;">
                    <span style="background-color: #fef3c7; color: #92400e; padding: 8px; border-radius: 6px; margin-right: 15px; font-weight: 600; min-width: 80px; text-align: center; font-size: 14px;">TELÉFONO</span>
                    <a href="tel:${phone}" style="color: #d97706; font-size: 16px; text-decoration: none; font-weight: 500;">${phone}</a>
                  </div>
                </div>
              </div>

              <!-- Mensaje del cliente -->
              <div style="background-color: #ffffff; border: 2px solid #f3f4f6; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #1f2937; margin: 0 0 15px; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background-color: #f59e0b; color: white; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 16px;">💬</span>
                  Mensaje del Cliente
                </h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                  <p style="color: #374151; line-height: 1.6; margin: 0; font-size: 16px; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Call to action -->
              <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 12px; margin-bottom: 20px;">
                <h3 style="color: #92400e; margin: 0 0 15px; font-size: 18px; font-weight: 600;">⚡ Acción Recomendada</h3>
                <p style="color: #78350f; margin: 0 0 20px; font-size: 14px;">Responde rápidamente para no perder esta oportunidad de negocio</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                  <a href="mailto:${email}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">📧 Responder Email</a>
                  <a href="tel:${phone}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">📞 Llamar Ahora</a>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 25px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                🌱 <strong style="color: #10b981;">Energía Solar</strong> - Transformando el futuro energético
              </p>
              <p style="color: #6b7280; margin: 10px 0 0; font-size: 12px;">
                Este mensaje fue generado automáticamente desde tu formulario de contacto
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, error };
  }
};

export default sendContactEmail;
