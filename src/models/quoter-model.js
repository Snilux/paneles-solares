import getConnection from "../db.js";
class QuoterModel {
  constructor() {
    this.parametros_paneles = "parametros_paneles";
    this.valores_parametro_paneles = "valores_parametro_paneles";
  }

  async getDataQuote(data) {
    const connection = await getConnection();
    const query = `SELECT 
    pp.nombre,
    vpp.valor,
    vpp.precio
    FROM 
    ?? pp
    JOIN 
    ?? vpp ON pp.id = vpp.parametro_id
    WHERE 
    pp.nombre = ?;`;

    try {
      const [rows] = await connection.query(query, [
        this.parametros_paneles,
        this.valores_parametro_paneles,
        data,
      ]);
      return rows;
    } catch (error) {
      console.log("Error fetching quote:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
export default new QuoterModel();
