const express = require('express');

const router = express.Router();

const expenseController=require('../controllers/expense');

router.post('/add-expense', expenseController.addExpense);

router.get('/get-expenses', expenseController.getExpenses);

router.put('/update-expense/:id', expenseController.updateExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports=router;