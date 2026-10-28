const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("./healthService");

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Check server health and system status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running successfully and returns system health details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "ok"
 *                     uptime:
 *                       type: number
 *                       example: 145.23
 *                     timestamp:
 *                       type: string
 *                       example: "2026-03-30T10:00:00.000Z"
 *                     environment:
 *                       type: string
 *                       example: "development"
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     database:
 *                       type: object
 *                       properties:
 *                         state:
 *                           type: string
 *                           example: "connected"
 */
router.get("/", (req, res) => {
  const data = getHealthStatus();

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = router;
