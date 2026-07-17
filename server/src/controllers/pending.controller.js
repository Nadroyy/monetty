const db = require('../config/sqlite');

// GET /api/pending-payments
const getPendingPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT *,
        CASE
          WHEN paid_installments >= total_installments THEN 'completed'
          WHEN due_date < date('now') THEN 'overdue'
          ELSE 'active'
        END as status
      FROM pending_payments
      WHERE user_id = ?
    `;
    const params = [userId];

    if (status) {
      query = `
        SELECT * FROM (
          SELECT *,
            CASE
              WHEN paid_installments >= total_installments THEN 'completed'
              WHEN due_date < date('now') THEN 'overdue'
              ELSE 'active'
            END as status
          FROM pending_payments
          WHERE user_id = ?
        ) sub WHERE status = ?
      `;
      params.push(status);
    }

    query += ` ORDER BY
      CASE
        WHEN status = 'overdue' THEN 0
        WHEN status = 'active' THEN 1
        ELSE 2
      END,
      due_date ASC`;

    const payments = db.prepare(query).all(...params);

    res.json({ success: true, data: { payments } });
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

    const installmentAmount = Math.round((parseFloat(total_amount) / parseInt(total_installments)) * 100) / 100;

    const result = db.prepare(
      `INSERT INTO pending_payments (user_id, description, total_amount, installment_amount, total_installments, paid_installments, frequency, due_date, category)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`
    ).run(userId, description, total_amount, installmentAmount, total_installments, frequency, due_date, category || 'Otros');

    const payment = db.prepare('SELECT * FROM pending_payments WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Pago pendiente creado.',
      data: { payment: { ...payment, status: 'active' } }
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

    const payment = db.prepare('SELECT * FROM pending_payments WHERE id = ? AND user_id = ?').get(id, userId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    if (payment.paid_installments >= payment.total_installments) {
      return res.status(400).json({ success: false, message: 'Este pago ya está completado.' });
    }

    db.prepare('UPDATE pending_payments SET paid_installments = paid_installments + 1 WHERE id = ?').run(id);

    const updated = db.prepare('SELECT * FROM pending_payments WHERE id = ?').get(id);
    const status = updated.paid_installments >= updated.total_installments ? 'completed' : 'active';

    res.json({
      success: true,
      message: `Cuota ${updated.paid_installments}/${updated.total_installments} registrada.`,
      data: { payment: { ...updated, status } }
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

    const existing = db.prepare('SELECT id FROM pending_payments WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    const installmentAmount = Math.round((parseFloat(total_amount) / parseInt(total_installments)) * 100) / 100;

    db.prepare(
      `UPDATE pending_payments
       SET description = ?, total_amount = ?, installment_amount = ?, total_installments = ?, frequency = ?, due_date = ?, category = ?
       WHERE id = ? AND user_id = ?`
    ).run(description, total_amount, installmentAmount, total_installments, frequency, due_date, category || 'Otros', id, userId);

    const payment = db.prepare('SELECT * FROM pending_payments WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Pago pendiente actualizado.',
      data: { payment }
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

    const result = db.prepare('DELETE FROM pending_payments WHERE id = ? AND user_id = ?').run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    res.json({ success: true, message: 'Pago pendiente eliminado.' });
  } catch (error) {
    console.error('Error al eliminar pago pendiente:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el pago pendiente.' });
  }
};

module.exports = { getPendingPayments, createPendingPayment, payInstallment, updatePendingPayment, deletePendingPayment };
