import React, { useState } from 'react';
import transactionsData from "./assets/data.json";
import './App.css';

function App() {

  const [transactions, setTransactions] = useState(transactionsData);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: 0, date: '' });
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
    setNewTransaction({ description: '', amount: 0, date: '' });
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({ description: transaction.description, amount: transaction.amount, date: transaction.date });
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
    setNewTransaction({ description: '', amount: 0, date: '' });
    setEditingTransaction(null);
  };

  const calculateBalance = () => {
    return transactions.reduce((total, t) => total + t.amount, 0);
  };

  return (
    <div className="container">
      <h1 className="title">Finance Manager</h1>

      <h2 className="subtitle">Transactions</h2>
    <table className="table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.description}</td>
            <td className={transaction.amount < 0 ? 'negative' : 'positive'}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}</td>
            <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
            <td>
              <button className="btn-primary" onClick={() => editTransaction(transaction)}>Edit</button>
              <button className="btn-delete" onClick={() => deleteTransaction(transaction.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      <tfoot>
      <tr>
        <td><strong>Balance:</strong></td>
        <td className={calculateBalance() < 0 ? 'negative' : 'positive'}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateBalance())}</td>
        <td></td>
        <td></td>
      </tr>
      </tfoot>

      <form onSubmit={handleSubmit}>
        <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <label>
          Description:
          <input type="text" value={newTransaction.description} onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} required />
        </label>
        <label>
          Amount:
          <input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} required min="0.01" />
        </label>
        <label>
          Date:
          <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} required />
        </label>
        <button className="btn-primary" type="submit" >{editingTransaction ? 'Save' : 'Add'}</button>
      {editingTransaction && <button className="delete" type="btn-delete" onClick={cancelEditing}>Cancel</button>}
    </form>

  </div>
  );
}

export default App;
