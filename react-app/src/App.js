import React, { useState } from 'react';
import transactionsData from "./assets/data10000.json";
import './App.css';

function App() {
  const [addingTransaction, setAddingTransaction] = useState(false);
  const [transactions, setTransactions] = useState(transactionsData);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: 0, date: '', type: 'income' || 'expense' });
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.date) return;
    if (editingTransaction) {
      saveTransaction();
    } else {
      addTransaction();
    }
  };

  const addTransaction = () => {
    setTransactions([
      ...transactions,
      { id: Math.random(), description: newTransaction.description, amount: parseFloat(newTransaction.amount), date: newTransaction.date }
    ]);
    cancelAdd();
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({ description: transaction.description, amount: transaction.amount, date: transaction.date });
  };

  const cancelAdd = () => {
    setNewTransaction({ description: '', amount: 0, date: '' });
    setAddingTransaction(false);
  };

  const saveTransaction = () => {
    const updatedTransactions = transactions.map((t) => {
      if (t.id === editingTransaction.id) {
        return { ...t, description: newTransaction.description, amount: parseFloat(newTransaction.amount), date: newTransaction.date };
      }
      return t;
    });
    setTransactions(updatedTransactions);
    setNewTransaction({ description: '', amount: 0, date: '' });
    setEditingTransaction(null);
  };

  const cancelEditing = () => {
    cancelAdd();
    setEditingTransaction(null);
  };

  const calculateBalance = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'income') {
        return total + transaction.amount;
      } else {
        return total - transaction.amount;
      }
    }, 0);
  };

  return (
      <div className="container">
        <h1 className="title">Finance Manager</h1>

        {(!addingTransaction && editingTransaction == null) && (
            <button className="btn-primary form-right" onClick={() => setAddingTransaction(true)}>
              New Transaction
            </button>
        )}
        {(addingTransaction || editingTransaction !== null) && (
            <form onSubmit={handleSubmit}>
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <label>
                Type:
                <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                    required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
              <label>
                Description:
                <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) =>
                        setNewTransaction({ ...newTransaction, description: e.target.value })
                    }
                    required
                />
              </label>
              <label>
                Amount:
                <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    required
                    min={0}
                    pattern="^[0-9]\d*(\.\d+)?$"
                />
              </label>
              <label>
                Date:
                <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    required
                />
              </label>
              <button className="btn-primary" type="submit">
                {editingTransaction ? 'Save' : 'Add'}
              </button>
              {editingTransaction ? (
                  <button className="btn-delete" type="btn-delete" onClick={cancelEditing}>
                    Cancel
                  </button>
              ) : (
                  <button className="btn-delete" type="btn-delete" onClick={cancelAdd}>
                    Cancel
                  </button>
              )}
            </form>
        )}

        <h2 className="subtitle">Transactions</h2>
        <table className="table">
          <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                <td>{transaction.description}</td>
                <td className={transaction.type === 'expense' ? 'negative' : 'positive'}>
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(transaction.amount)}
                </td>
                <td>
                  <button className="btn-primary" onClick={() => editTransaction(transaction)}>
                    Edit
                  </button>
                  <button
                      className="btn-delete"
                      onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      <tfoot>
      <tr>
        <td><strong>Balance:</strong></td>
        <td></td>
        <td className={calculateBalance() < 0 ? 'negative' : 'positive'}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateBalance())}</td>
        <td></td>
      </tr>
      </tfoot>
  </div>
  );
}

export default App;
