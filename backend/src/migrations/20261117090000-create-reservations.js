'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false },
      phone: { type: Sequelize.STRING(30), allowNull: false },
      guests: { type: Sequelize.TINYINT.UNSIGNED, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      time: { type: Sequelize.STRING(5), allowNull: false },
      requests: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'declined'), allowNull: false, defaultValue: 'pending' },
      notified_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('reservations', ['date', 'time']);
    await queryInterface.addIndex('reservations', ['status']);
    await queryInterface.addIndex('reservations', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reservations');
  },
};
