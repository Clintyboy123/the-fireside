// A table request from the website. It starts as "pending": the restaurant confirms it by phone or email.
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: false },
      guests: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time: { type: DataTypes.STRING(5), allowNull: false },
      requests: { type: DataTypes.TEXT, allowNull: true },
      // Pre-ordered dishes from the menu: [{ name, qty, price }]. The restaurant confirms these with the table.
      items: { type: DataTypes.JSON, allowNull: true },
      status: { type: DataTypes.ENUM('pending', 'confirmed', 'declined'), allowNull: false, defaultValue: 'pending' },
      notifiedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'reservations' }
  );

  return Reservation;
};
