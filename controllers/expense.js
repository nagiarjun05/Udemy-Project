const Expense = require('../models/expense');

const addExpense= async (req, res)=>{
    try{
        const amount=req.body.amount;
        const description=req.body.description;
        const category=req.body.category;

        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category
        });
        res.status(201).json({newExpenseDetail: data});
    } catch(err){
        res.status(500).json({
            error: err
        })
    }
};

const getExpenses=async (req, res)=>{
    try{
        const expenses = await Expense.findAll();
        res.status(200).json({allExpenses: expenses});
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
};

const deleteExpense=async (req, res)=>{
    const uId=req.params.id;
    console.log(uId);
    await Expense.destroy({where:{id: uId}});
    res.sendStatus(200);
};

const updateExpense=async (req, res)=>{;
    const uId=req.body.id;
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.category;
    
    await Expense.update({
        amount: amount,
        description: description,
        category: category
    },
    {where:{id: uId}});
    res.sendStatus(200);
};

module.exports={
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
};