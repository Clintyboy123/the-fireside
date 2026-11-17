'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiries', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false },
      phone: { type: Sequelize.STRING(30), allowNull: true },
      subject: { type: Sequelize.STRING(60), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      notified_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('enquiries', ['created_at']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
  },
};
