'use strict';

// Dishes a guest added from the menu to pre-order with their table: [{ name, qty, price }].
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservations', 'items', { type: Sequelize.JSON, allowNull: true, after: 'requests' });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('reservations', 'items');
  },
};
