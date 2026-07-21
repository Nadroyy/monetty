'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Usuario Demo',
        email: 'demo@monetty.com',
        password: hashedPassword,
        monthly_income: 3500000,
        created_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'demo@monetty.com' }, {});
  }
};
