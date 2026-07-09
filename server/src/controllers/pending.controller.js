const pool = require('../config/db');

// ============ MODO DEMO (sin base de datos) ============
const demoPendingPayments = [];
let demoPendingIdCounter = 1;

const isDemoMode = () => {
  return !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('usuario:password');
};
// =======================================================

// GET /api/pending-payments
const getPendingPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // 'active', 'completed', 'overdue' o vacío para todos

    // --- MODO DEMO ---
    if (isDemoMode()) {
      let filtered = demoPendingPayments.filter(p => p.user_id === userId);
      
      const today = new Date().toISOString().split('T')[0];
      
      // Calcular estado dinámico
      filtered = filtered.map(p => {
        let computedStatus = 'active';
        if (p.paid_installments >= p.total_installments) {
          computedStatus = 'completed';
        } else if (p.due_date && p.due_date < today) {
          computedStatus = 'overdue';
        }
        return { ...p, status: computedStatus };
      });

      if (status) {
        filtered = filtered.filter(p => p.status === status);
      }

      filtered.sort((a, b) => {
        // Primero vencidos, luego activos, luego completados
        const order = { overdue: 0, active: 1, completed: 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        // Dentro del mismo estado, por fecha límite más cercana
        if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
        return 0;
      });

      return res.json({ success: true, data: { payments: filtered } });
    }
    // --- FIN MODO DEMO ---

    let query = `
      SELECT *,
        CASE
          WHEN paid_installments >= total_installments THEN 'completed'
          WHEN due_date < CURRENT_DATE THEN 'overdue'
          ELSE 'active'
        END as status
      FROM pending_payments 
      WHERE user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      query = `
        SELECT * FROM (
          SELECT *,
            CASE
              WHEN paid_installments >= total_installments THEN 'completed'
              WHEN due_date < CURRENT_DATE THEN 'overdue'
              ELSE 'active'
            END as status
          FROM pending_payments 
          WHERE user_id = $1
        ) sub WHERE status = $${paramIndex}
      `;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY CASE WHEN status = \'overdue\' THEN 0 WHEN status = \'active\' THEN 1 ELSE 2 END, due_date ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: { payments: result.rows } });
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

    const installmentAmount = parseFloat(total_amount) / parseInt(total_installments);

    // --- MODO DEMO ---
    if (isDemoMode()) {
      const newPayment = {
        id: demoPendingIdCounter++,
        user_id: userId,
        description,
        total_amount: parseFloat(total_amount),
        installment_amount: Math.round(installmentAmount * 100) / 100,
        total_installments: parseInt(total_installments),
        paid_installments: 0,
        frequency, // 'once', 'monthly', 'custom'
        due_date,
        category: category || 'Otros',
        created_at: new Date().toISOString()
      };
      demoPendingPayments.push(newPayment);
      return res.status(201).json({
        success: true,
        message: 'Pago pendiente creado.',
        data: { payment: { ...newPayment, status: 'active' } }
      });
    }
    // --- FIN MODO DEMO ---

    const result = await pool.query(
      `INSERT INTO pending_payments (user_id, description, total_amount, installment_amount, total_installments, paid_installments, frequency, due_date, category)
       VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8)
       RETURNING *`,
      [userId, description, total_amount, Math.round(installmentAmount * 100) / 100, total_installments, frequency, due_date, category || 'Otros']
    );

    res.status(201).json({
      success: true,
      message: 'Pago pendiente creado.',
      data: { payment: { ...result.rows[0], status: 'active' } }
    });
  } catch (error) {
    console.error('Error al crear pago pendiente:', error);
    res.status(500).json({ success: false, message: 'Error al crear el pago pendiente.' });
  }
};

// PUT /api/pending-payments/:id/pay  — Registrar una cuota pagada
const payInstallment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // --- MODO DEMO ---
    if (isDemoMode()) {
      const payment = demoPendingPayments.find(p => p.id === parseInt(id) && p.user_id === userId);
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
      }
      if (payment.paid_installments >= payment.total_installments) {
        return res.status(400).json({ success: false, message: 'Este pago ya está completado.' });
      }
      payment.paid_installments += 1;
      const computedStatus = payment.paid_installments >= payment.total_installments ? 'completed' : 'active';
      return res.json({
        success: true,
        message: `Cuota ${payment.paid_installments}/${payment.total_installments} registrada.`,
        data: { payment: { ...payment, status: computedStatus } }
      });
    }
    // --- FIN MODO DEMO ---

    // Verificar existencia y propiedad
    const existing = await pool.query(
      'SELECT * FROM pending_payments WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    const payment = existing.rows[0];
    if (payment.paid_installments >= payment.total_installments) {
      return res.status(400).json({ success: false, message: 'Este pago ya está completado.' });
    }

    const result = await pool.query(
      `UPDATE pending_payments SET paid_installments = paid_installments + 1 WHERE id = $1 RETURNING *`,
      [id]
    );

    const updated = result.rows[0];
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

// PUT /api/pending-payments/:id — Editar pago pendiente
const updatePendingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, total_amount, total_installments, frequency, due_date, category } = req.body;
    const userId = req.user.id;

    const installmentAmount = parseFloat(total_amount) / parseInt(total_installments);

    // --- MODO DEMO ---
    if (isDemoMode()) {
      const index = demoPendingPayments.findIndex(p => p.id === parseInt(id) && p.user_id === userId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
      }
      demoPendingPayments[index] = {
        ...demoPendingPayments[index],
        description,
        total_amount: parseFloat(total_amount),
        installment_amount: Math.round(installmentAmount * 100) / 100,
        total_installments: parseInt(total_installments),
        frequency,
        due_date,
        category: category || 'Otros'
      };
      return res.json({
        success: true,
        message: 'Pago pendiente actualizado.',
        data: { payment: demoPendingPayments[index] }
      });
    }
    // --- FIN MODO DEMO ---

    const existing = await pool.query(
      'SELECT id FROM pending_payments WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    const result = await pool.query(
      `UPDATE pending_payments 
       SET description = $1, total_amount = $2, installment_amount = $3, total_installments = $4, frequency = $5, due_date = $6, category = $7
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [description, total_amount, Math.round(installmentAmount * 100) / 100, total_installments, frequency, due_date, category || 'Otros', id, userId]
    );

    res.json({
      success: true,
      message: 'Pago pendiente actualizado.',
      data: { payment: result.rows[0] }
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

    // --- MODO DEMO ---
    if (isDemoMode()) {
      const index = demoPendingPayments.findIndex(p => p.id === parseInt(id) && p.user_id === userId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
      }
      demoPendingPayments.splice(index, 1);
      return res.json({ success: true, message: 'Pago pendiente eliminado.' });
    }
    // --- FIN MODO DEMO ---

    const result = await pool.query(
      'DELETE FROM pending_payments WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pago pendiente no encontrado.' });
    }

    res.json({ success: true, message: 'Pago pendiente eliminado.' });
  } catch (error) {
    console.error('Error al eliminar pago pendiente:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el pago pendiente.' });
  }
};

module.exports = { getPendingPayments, createPendingPayment, payInstallment, updatePendingPayment, deletePendingPayment };
