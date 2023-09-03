import express from "express";
import {
	askAICoder,
	carddata,
	createTransaction,
	deleteTransaction,
	getAllTransactions,
	getExpenseIncomeStats,
	getLastTransactions,
	getUserBudgetTips,
	getUserSuggestions,
	predictTransactionType,
} from "../controllers/Transaction.controller";

const router = express.Router();
// Get all transactions
router.get("/transactions/:id", getAllTransactions);
// Create a new transaction
router.post("/transactions", createTransaction);
// Get expense and income statistics
router.get("/expense-income-stats", getExpenseIncomeStats);
// Get last income and expense transactions
router.get("/last-transactions", getLastTransactions);
// Delete a transaction by ID
router.delete("/transactions/:id", deleteTransaction);
router.post("/predict", predictTransactionType);
router.get("/suggestions/:userId", getUserSuggestions);
router.get("/budget-tips/:userId", getUserBudgetTips);
router.get("/carddata/:id", carddata);
router.get("/tr/askAICoder", askAICoder);

export default router;
