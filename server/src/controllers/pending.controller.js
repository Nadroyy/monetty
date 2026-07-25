const { Op, Sequelize, literal } = require('sequelize');
const { PendingPayment } = require('../models');

// Helper: calcular status de un pago
const getPaymentStatus = (payment) => {
  if (payment.paid_installments >= payment.total_installments) return 'completed';
  const today = new Date().toISOString().split('T')[0];
  if (payment.due_date < today) return 'overdue';
  return 'active';
};

// Agregar status a un pago
const withStatus = (payment) => {
  const plain = payment.toJSON ? payment.toJSON() : { ...payment };
  plain.status = getPaymentStatus(plain);
  return plain;
};

// GET /api/pending-payments
const getPendingPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const payments = await PendingPayment.findAll({
      where: { user_id: userId },
      order: [['due_date', 'ASC']]
    });

    // Agregar status calculado y filtrar si se pidió
    let result = payments.map(withStatus);

    if (status) {
      result = result.filter(p => p.status === status);
    }

    // Ordenar: overdue primero, active después, completed al final
    const statusOrder = { overdue: 0, active: 1, completed: 2 };
    result.sort((a, b) => (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2));

    res.json({ success: true, data: { payments: result } });
  } catch (error) {
    console.error('Error al obtener pagos pendientes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los pagos pendientes.' });
  }
};

// POST /api/pending-payments
const createPendingPayment = async (req, res) => {
  try {
    const { description, total_amount, total_installments, frequency, due_date, category } = req.body;
    const userId = req.user.id;

    const installments = parseInt(total_installments) || 1;
    const installmentAmount = Math.round((parseFloat(total_amount) / installments) * 100) / 100;

    const payment = await PendingPayment.create({
      user_id: userId,
      description,
      total_amount,
      installment_amount: installmentAmount,
      total_installments: installments,
      paid_installments: 0,
      frequency,
      due_date,
      category: category || 'Otros'
    });

    res.status(201).json({
      success: true,
      message: 'Pago pendiente creado.',
      data: { payment: { ...payment.toJSON(), status: 'active' } }
    });
  } catch (error) {
    console.error('Error al crear pago pendiente:', error);
    res.status(500).json({ success: false, message: 'Error al crear el pago pendiente.' });
  }
};

// PUT /api/pending-payments/:id/pay
const payInstallment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await PendingPayment.findOne({ where: { id, user_id: userId } });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    if (payment.paid_installments >= payment.total_installments) {
      return res.status(400).json({ success: false, message: 'Este pago ya está completado.' });
    }

    await payment.update({ paid_installments: payment.paid_installments + 1 });

    const status = payment.paid_installments >= payment.total_installments ? 'completed' : 'active';

    res.json({
      success: true,
      message: `Cuota ${payment.paid_installments}/${payment.total_installments} registrada.`,
      data: { payment: { ...payment.toJSON(), status } }
    });
  } catch (error) {
    console.error('Error al registrar cuota:', error);
    res.status(500).json({ success: false, message: 'Error al registrar la cuota.' });
  }
};

// PUT /api/pending-payments/:id
const updatePendingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, total_amount, total_installments, frequency, due_date, category } = req.body;
    const userId = req.user.id;

    const payment = await PendingPayment.findOne({ where: { id, user_id: userId } });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    const installments = parseInt(total_installments) || 1;
    const installmentAmount = Math.round((parseFloat(total_amount) / installments) * 100) / 100;

    await payment.update({
      description,
      total_amount,
      installment_amount: installmentAmount,
      total_installments: installments,
      frequency,
      due_date,
      category: category || 'Otros'
    });

    res.json({
      success: true,
      message: 'Pago pendiente actualizado.',
      data: { payment: withStatus(payment) }
    });
  } catch (error) {
    console.error('Error al actualizar pago pendiente:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el pago pendiente.' });
  }
};

// DELETE /api/pending-payments/:id
const deletePendingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await PendingPayment.destroy({ where: { id, user_id: userId } });

    if (deleted === 0) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    res.json({ success: true, message: 'Pago pendiente eliminado.' });
  } catch (error) {
    console.error('Error al eliminar pago pendiente:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el pago pendiente.' });
  }
};

module.exports = { getPendingPayments, createPendingPayment, payInstallment, updatePendingPayment, deletePendingPayment };
