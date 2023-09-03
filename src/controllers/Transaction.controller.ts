/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import TransactionModel from "../models/Transaction.Model";
import axios from "axios";

export const getAllTransactions = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	try {
		const allTransactions = await TransactionModel.find({ userid: id });
		res.status(200).json(allTransactions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const createTransaction = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const newTransaction = await TransactionModel.create(req.body);
		res.status(201).json(newTransaction);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const getExpenseIncomeStats = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const maxExpense = await TransactionModel.findOne({
			type: "Expense",
		}).sort({
			amount: -1,
		});
		const minExpense = await TransactionModel.findOne({
			type: "Expense",
		}).sort({
			amount: 1,
		});
		const maxIncome = await TransactionModel.findOne({
			type: "Income",
		}).sort({
			amount: -1,
		});
		const minIncome = await TransactionModel.findOne({
			type: "Income",
		}).sort({
			amount: 1,
		});

		const stats = {
			maxExpenseAmount: maxExpense?.amount,
			minExpenseAmount: minExpense?.amount,
			maxIncomeAmount: maxIncome?.amount,
			minIncomeAmount: minIncome?.amount,
		};

		res.status(200).json(stats);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const getLastTransactions = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const lastIncomeTransactions = await TransactionModel.find({
			type: "Income",
		})
			.sort({ date: -1 })
			.limit(3);

		const lastExpenseTransactions = await TransactionModel.find({
			type: "Expense",
		})
			.sort({ date: -1 })
			.limit(3);

		const response = {
			lastIncome: lastIncomeTransactions,
			lastExpense: lastExpenseTransactions,
		};

		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const deleteTransaction = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		// Find the transaction by ID and delete it
		const deletedTransaction = await TransactionModel.findByIdAndDelete(id);

		if (!deletedTransaction) {
			// return res.status(404).json({ error: "Transaction not found" });
			console.log("transaction not found");
		}

		res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const predictTransactionType = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { amount } = req.body;

		// Fetch transaction data for prediction
		const transactions = await TransactionModel.find({});
		// Calculate average amounts for Income and Expense transactions
		let totalIncome = 0;
		let totalExpense = 0;
		let countIncome = 0;
		let countExpense = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === "Income") {
				totalIncome += transaction.amount;
				countIncome++;
			} else if (transaction.type === "Expense") {
				totalExpense += transaction.amount;
				countExpense++;
			}
		});

		const avgIncome = totalIncome / countIncome;
		const avgExpense = totalExpense / countExpense;

		// Make a prediction based on average amounts
		const predictedType = amount >= avgIncome ? "Income" : "Expense";

		res.json({ predictedType });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getUserSuggestions = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = req.params.userId;

		// Fetch user's transaction history
		const transactions = await TransactionModel.find({ userid: userId });

		// Calculate total income, total expense, and total savings
		let totalIncome = 0;
		let totalExpense = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === "Income") {
				totalIncome += transaction.amount;
			} else if (transaction.type === "Expense") {
				totalExpense += transaction.amount;
			}
		});

		const totalBalance = totalIncome - totalExpense;

		// Calculate average daily income and expense
		const daysWithData = transactions.length;
		const averageDailyIncome = totalIncome / daysWithData;
		const averageDailyExpense = totalExpense / daysWithData;

		// Calculate potential savings
		const averageDailySavings = averageDailyIncome - averageDailyExpense;
		const monthlySavings = averageDailySavings * 30; // Assuming 30 days in a month
		const yearlySavings = monthlySavings * 12;

		// Calculate yearly, daily, and monthly income
		const yearlyIncome = totalIncome;
		const monthlyIncome = yearlyIncome / 12;
		const dailyIncome = yearlyIncome / 365; // Assuming 365 days in a year

		// Calculate yearly, daily, and monthly expenses
		const yearlyExpense = totalExpense;
		const monthlyExpense = yearlyExpense / 12;
		const dailyExpense = yearlyExpense / 365; // Assuming 365 days in a year

		// Prepare personalized suggestions
		const suggestions = {
			totalBalance,
			totalIncome,
			totalExpense,
			totalSavings: totalBalance,
			yearlyIncome,
			monthlyIncome,
			dailyIncome,
			yearlyExpense,
			monthlyExpense,
			dailyExpense,
			yearlySavings,
			monthlySavings,
			dailySavings: averageDailySavings,
		};

		res.json(suggestions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getUserBudgetTips = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = req.params.userId;

		// Fetch user's transaction history
		const transactions = await TransactionModel.find({ userId });

		// Calculate total income and total expenses
		let totalIncome = 0;
		let totalExpense = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === "Income") {
				totalIncome += transaction.amount;
			} else if (transaction.type === "Expense") {
				totalExpense += transaction.amount;
			}
		});

		// Calculate net savings
		const netSavings = totalIncome - totalExpense;

		// Prepare budget tips based on net savings
		const budgetTips: string[] = [];

		if (netSavings > 0) {
			budgetTips.push(
				"Congratulations! You're saving more than you spend."
			);
		} else if (netSavings < 0) {
			budgetTips.push("Consider cutting down on unnecessary expenses.");
		} else {
			budgetTips.push("Your income and expenses are balanced.");
		}

		// Return budget tips
		res.json({ budgetTips });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

//

export const carddata = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	try {
		const lastIncomeTransactions = await TransactionModel.find({
			userid: id,
			type: "Income",
		})
			.sort({ date: -1 })
			.limit(4);

		const lastExpenseTransactions = await TransactionModel.find({
			userid: id,
			type: "Expense",
		})
			.sort({ date: -1 })
			.limit(5);

		// Calculate total income, total expense, and total savings
		const totalIncome = lastIncomeTransactions.reduce(
			(total, transaction) => total + transaction.amount,
			0
		);

		const totalExpense = lastExpenseTransactions.reduce(
			(total, transaction) => total + transaction.amount,
			0
		);

		const totalSavings = totalIncome - totalExpense;

		// Calculate bar values for income, savings, and expenses
		const incomeBarValue =
			(totalIncome / (totalIncome + totalExpense + totalSavings)) * 100;
		const savingsBarValue =
			(totalSavings / (totalIncome + totalExpense + totalSavings)) * 100;
		const expensesBarValue =
			(totalExpense / (totalIncome + totalExpense + totalSavings)) * 100;

		const response = {
			lastIncome: lastIncomeTransactions,
			lastExpense: lastExpenseTransactions,
			totalIncome,
			totalExpense,
			totalSavings,
			incomeBarValue,
			savingsBarValue,
			expensesBarValue,
		};

		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const askAICoder = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { balance, category } = req.query as {
		balance: string;
		category?: string;
	};

	// if (!balance) {
	//   res
	// 		.status(400)
	// 		.json({ error: "Missing query parameter: balance" });
	// }

	try {
		const message = `my budget is ${balance}  give me some business idea`;
		// category
		// 	? `my balance is ${balance} and ${category} give me some idea to start business from the existing business ideas`
		// 	: `my balance is ${balance} give me a business idea`;

		const options = {
			method: "POST",
			url: "https://open-ai21.p.rapidapi.com/askaicoder",
			headers: {
				"content-type": "application/json",
				"X-RapidAPI-Key":
					"06e898940cmsh465bec485e3ca3fp159475jsnc2ab2a1e1786",
				"X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
			},
			data: {
				message,
			},
		};

		const response = await axios.request(options);
		res.status(200).json(response.data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
