import express from 'express';
import { 
    getFinancialSummary,
    getMonthlyFinanceData,
    getFinancialKPIs
} from '../../controllers/finance/financeController.js';
import { protect, isAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All finance routes require admin privileges
router.use(protect, isAdmin);

// Get financial summary
router.get('/summary', getFinancialSummary);

// Get monthly finance data
router.get('/monthly', getMonthlyFinanceData);

// Get financial KPIs
router.get('/kpis', getFinancialKPIs);

export default router;