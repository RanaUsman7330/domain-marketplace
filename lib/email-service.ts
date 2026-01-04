// /lib/email-service.ts - EMAIL SERVICE (implement later)
export async function sendOrderConfirmation(to: string, orderDetails: any) {
  // Implement email sending logic
  console.log(`Email sent to ${to} for order ${orderDetails.orderNumber}`)
}

export async function sendNewOrderNotificationToAdmin(orderDetails: any) {
  // Send email to admin
  console.log(`Admin notification sent for order ${orderDetails.orderNumber}`)
}