import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

/**
 * Send order confirmation email to the customer
 * @param {string} email - Customer email address
 * @param {Object} orderData - Order details
 * @param {string} orderData.orderNumber - Order ID/number
 * @param {Array} orderData.orderItems - Items in the order
 * @param {number} orderData.totalPrice - Total order price
 * @param {string} orderData.userName - Customer name
 * @returns {Promise} - Email sending result
 */
export const sendOrderConfirmationEmail = async (email, orderData) => {
    const { orderNumber, orderItems, totalPrice, userName } = orderData;

    // Create items list HTML
    const itemsListHtml = orderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    // Email template
    const emailTemplate = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title>Order Confirmation</title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          font-family: 'Open Sans', sans-serif;
          background: #E5E5E5;
        }
        table, td {
          border-collapse: collapse;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          padding: 20px;
          background-color: #3b82f6;
          color: white;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .main-content {
          padding: 30px;
          color: #333333;
        }
        .footer {
          padding: 20px;
          background-color: #f3f4f6;
          color: #6b7280;
          font-size: 12px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .button {
          background: #3b82f6;
          text-decoration: none;
          display: inline-block;
          padding: 10px 20px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          font-weight: bold;
          border-radius: 4px;
        }
      </style>
    </head>
    
    <body>
      <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
        <tbody>
          <tr>
            <td valign="top" align="center">
              <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td class="header">
                      <h1 style="margin: 0; font-size: 24px;">Order Confirmation</h1>
                    </td>
                  </tr>
                  <tr>
                    <td class="main-content">
                      <p style="font-size: 16px;">Hello ${userName},</p>
                      <p style="font-size: 14px;">Thank you for your order! We are pleased to confirm that we have received your order.</p>
                      
                      <h2 style="font-size: 18px; margin-top: 20px;">Order Details</h2>
                      <p style="font-size: 14px;">Order Number: <strong>${orderNumber}</strong></p>
                      
                      <table width="100%" style="margin-top: 20px; border-collapse: collapse;">
                        <thead>
                          <tr style="background-color: #f3f4f6;">
                            <th style="padding: 10px; text-align: left;">Product</th>
                            <th style="padding: 10px; text-align: left;">Quantity</th>
                            <th style="padding: 10px; text-align: left;">Price</th>
                            <th style="padding: 10px; text-align: left;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsListHtml}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                            <td style="padding: 10px; font-weight: bold;">$${totalPrice.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                      
                      <p style="font-size: 14px; margin-top: 30px;">
                        If you have any questions or concerns regarding your order, please contact our customer support.
                      </p>
                      
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/orders/${orderNumber}" class="button">View Your Order</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="footer">
                      <p>&copy; ${new Date().getFullYear()} Garment Factory Management System. All rights reserved.</p>
                      <p>This is an automated email, please do not reply.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
    `;

    // Send email
    try {
        const mailOptions = {
            from: `"Garment Factory" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Order Confirmation #${orderNumber}`,
            html: emailTemplate
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
        throw error;
    }
};

export default transporter;