const pool = require('../config/db');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    const userId = req.user.id;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    // Filtro por categoría
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filtro por tipo (income/expense)
    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Filtro por rango de fechas
    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: { transactions: result.rows }
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

    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, category, description, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, type, amount, category, description, date]
    );

    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente.',
      data: { transaction: result.rows[0] }
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
    const existing = await pool.query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada.'
      });
    }

    const result = await pool.query(
      `UPDATE transactions 
       SET type = $1, amount = $2, category = $3, description = $4, date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [type, amount, category, description, date, id, userId]
    );

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente.',
      data: { transaction: result.rows[0] }
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

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
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
