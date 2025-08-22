import getConnection from "../db.js";

class QuoterModel {
  constructor() {
    this.parametros_paneles = "parametros_paneles";
    this.valores_parametro_paneles = "valores_parametro_paneles";

    this.cotizacion_paneles = "cotizacion_paneles";
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

  async saveQuotePanel(id, dataQuote) {
    console.log(id);
    

    const connection = await getConnection();
    const query = `
      INSERT INTO ?? 
      (id_cliente, numero_paneles, tipo_panel, ancho_estructura, alto_estructura, inversor, distancia, tuberia, cable, total, tarifa,promedio, hilos, fecha )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    let total = parseFloat(dataQuote.priceTotal);
    const params = [
      this.cotizacion_paneles,
      id,
      dataQuote.numberOfPanels,
      dataQuote.typeOfPanels,
      dataQuote.widthForStructure,
      dataQuote.heightForStructure,
      dataQuote.invertorCapacity,
      dataQuote.distance,
      dataQuote.typeOfPipe,
      dataQuote.totalWire,
      total,
      dataQuote.rates,
      dataQuote.average,
      dataQuote.threads,
      new Date(),
    ];

    console.log(params);

    try {
      const result = await connection.query(query, params);
      if (result[0].affectedRows === 0) {
        return {
          errorMessage: "No se pudo guardar la cotización de cámaras",
          success: false,
        };
      }

      return {
        success: true,
        affectedRows: result[0].affectedRows,
      };
    } catch (error) {
      console.error("Error in saveQuoteCameraData:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
export default new QuoterModel();
