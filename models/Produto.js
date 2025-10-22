import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Produto = db.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: { // CAMPO ADICIONADO
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true // Permitindo nulo, já que 'nome' é o principal
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'produtos'
});

export default Produto;