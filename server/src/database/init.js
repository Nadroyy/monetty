/**
 * Script para inicializar la base de datos con Sequelize
 * Ejecutar: npm run db:migrate && npm run db:seed
 * 
 * Este archivo es legacy — las migraciones de Sequelize reemplazan la inicialización manual.
 * Se mantiene como referencia y para casos donde se necesite recrear la BD manualmente.
 */

const { sequelize } = require('../models');

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida.');

    // Sincronizar todos los modelos (crear tablas)
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas exitosamente.');

    console.log('\n📋 Para usar migraciones en su lugar, ejecute:');
    console.log('   npm run db:migrate');
    console.log('   npm run db:seed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
  }
};

initDB();
