const prisma = require("../config/db");
const crypto = require("crypto");

/**
 * Generates the next sequential product code based on the last created non-deleted product.
 * The code is a 3-digit padded number (e.g., "001", "123").
 * @returns {Promise<string>} The generated product code.
 * @throws {Error} If a database error occurs.
 */

const generateProductCode = () =>
  "PRD-" + crypto.randomUUID().slice(0, 8).toUpperCase();

/**
 * Generates the next sequential dealer code based on the last created non-deleted dealer.
 * The code is prefixed with "D" and followed by a 3-digit padded number (e.g., "D001", "D123").
 * @returns {Promise<string>} The generated dealer code.
 * @throws {Error} If a database error occurs or dealer code format is unexpected.
 */

function generateDealerCode() {
  return `DLR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
async function generateOrderId(userId) {
  const userOrderNum = await prisma.order.count({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });
  const totalOrderNum = await prisma.order.count();
  // Get the current date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");

  // Format date as YYYYMMDD
  const dateStr = `${year}${month}${day}`;

  // Format order numbers with leading zeros
  const userOrderNumStr = String(userOrderNum + 1).padStart(3, "0"); // e.g., 3 -> 003
  const totalOrderNumStr = String(totalOrderNum + 1).padStart(6, "0"); // e.g., 125 -> 000125

  // Create the Order ID
  const orderId = `${dateStr}-${userId}-${userOrderNumStr}-${totalOrderNumStr}`;
  console.log(orderId);
  return orderId;
}

module.exports = { generateProductCode, generateDealerCode, generateOrderId };
