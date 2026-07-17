const db = require('../config/sqlite');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    const userId = req.user.id;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const transactions = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: { transactions }
    });
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las transacciones.'
    });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const userId = req.user.id;

    const result = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, type, amount, category, description, date);

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente.',
      data: { transaction }
    });
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la transacción.'
    });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;
    const userId = req.user.id;

    // Verificar que la transacción pertenece al usuario
    const existing = db.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?').get(id, userId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada.'
      });
    }

    db.prepare(
      'UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ? WHERE id = ? AND user_id = ?'
    ).run(type, amount, category, description, date, id, userId);

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente.',
      data: { transaction }
    });
  } catch (error) {
    console.error('Error al actualizar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la transacción.'
    });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada.'
      });
    }

    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la transacción.'
    });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
