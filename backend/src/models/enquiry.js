// A message from the contact page.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Enquiry',
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      subject: { type: DataTypes.STRING(60), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      notifiedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'enquiries' }
  );
