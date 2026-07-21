const { Op } = require('sequelize');
const { Transaction } = require('../models');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    const userId = req.user.id;

    const where = { user_id: userId };

    if (category) where.category = category;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });

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

    const transaction = await Transaction.create({
      user_id: userId,
      type,
      amount,
      category,
      description,
      date
    });

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
    const existing = await Transaction.findOne({ where: { id, user_id: userId } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada.'
      });
    }

    await existing.update({ type, amount, category, description, date });

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente.',
      data: { transaction: existing }
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

    const deleted = await Transaction.destroy({ where: { id, user_id: userId } });

    if (deleted === 0) {
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
