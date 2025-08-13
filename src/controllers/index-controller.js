import getConnection from "../db.js";
import quoterModel from "../models/quoter-model.js";
import { validateQuoteSchema } from "../schemas/quoter.js";

class indexController {
  async renderIndexPage(req, res) {
    res.render("index", {
      title: "Soluciones tecnologicas .net",
    });
  }

  async renderQuoterPage(req, res) {
    const dataQuoter = await quoterModel.getDataQuote("Tipo de tarifa");
    if (!dataQuoter || dataQuoter.length === 0) {
      return res.status(404).render("error", {
        title: "Error",
        message: "No se encontraron datos para la cotización.",
      });
    }

    res.render("quoter", {
      title: "Cotizador de paneles solares",
      dataQuoter,
    });
  }

  async calculateQuote(req, res) {
    const dataQuote = validateQuoteSchema(req.body);
    const connection = await getConnection();

    if (!dataQuote.success) {
      return res.status(400).json({
        message: "Datos de cotización inválidos",
      });
    }
    const { average, distance, rates, threads } = dataQuote.data;
    let quoteResult = true;
    if (distance > 15 || rates.toLowerCase() === "otro" || threads > 3) {
      quoteResult = false;
    }
    try {
      const [structure] = await quoterModel.getDataQuote(
        "Estructuras para paneles"
      );

      const [priceOfPanels] = await quoterModel.getDataQuote(
        "Capacidades de panel"
      );

      const panelProduction =
        ((parseInt(priceOfPanels.valor) * 5 * 60) / 1000) * 0.85;
      const numberOfPanels = Math.ceil(average / panelProduction);

      let numberOfStructures = numberOfPanels / parseInt(structure.valor);
      let priceOfStructures = numberOfStructures * structure.precio;
      let priceOfPanelsTotal = numberOfPanels * priceOfPanels.precio;
      // Dimension of the structure, add at the database
      let widthForStructure = (numberOfPanels * 118) / 100;
      let heightForStructure = 2.35;

      const invertor = await quoterModel.getDataQuote(
        "Capacidades de inversores"
      );

      let watts = numberOfPanels * parseInt(priceOfPanels.valor);
      let invertorCapacity = Math.ceil(watts / 1000);
      let invertorPrice = 0;
      const foundInvertor = invertor.find((inverter) => {
        const inverterValue = parseInt(inverter.valor);
        return inverterValue >= invertorCapacity;
      });

      if (foundInvertor) {
        invertorCapacity = foundInvertor.valor;
        invertorPrice = foundInvertor.precio;
      } else {
        quoteResult = false;
        console.log("No se encontró un inversor adecuado en la lista.");
      }

      const pipeline = await quoterModel.getDataQuote("Precio de tuberia");

      let typeOfPipe;
      let priceTotalOfPipe;
      if (numberOfPanels > 0 && numberOfPanels <= 12) {
        typeOfPipe = `3/4`;
        pipeline.forEach((pipe) => {
          if (pipe.valor === typeOfPipe) {
            priceTotalOfPipe = pipe.precio * distance;
          }
        });
      } else if (numberOfPanels >= 13 && numberOfPanels <= 20) {
        typeOfPipe = `1 1/4`;

        pipeline.forEach((pipe) => {
          if (pipe.valor === typeOfPipe) {
            priceTotalOfPipe = pipe.precio * distance;
          }
        });
      } else if (numberOfPanels >= 21 && numberOfPanels <= 30) {
        typeOfPipe = `1 3/4`;

        pipeline.forEach((pipe) => {
          if (pipe.valor === typeOfPipe) {
            priceTotalOfPipe = pipe.precio * distance;
          }
        });
      } else {
        quoteResult = false;
        typeOfPipe = "Necesita una cotización personalizada";
      }

      let [wire] = await quoterModel.getDataQuote("Precio de cable");
      let totalWire = distance * 3;
      let priceOfWire = totalWire * wire.precio;

      let priceTotal =
        priceOfPanelsTotal +
        priceOfStructures +
        parseFloat(invertorPrice) +
        priceTotalOfPipe +
        priceOfWire;

      let gains = (priceTotal * 2).toFixed(2);

      if (!quoteResult) {
        return res.status(400).json({
          success: false,
          message:
            "Necesita una cotización personalizada, Contáctenos para más detalles.",
        });
      }

      return res.status(200).json({
        message: "Cálculo exitoso",
        success: true,
        numberOfPanels,
        typeOfPanels: priceOfPanels.valor,
        priceOfPanelsTotal,
        priceOfStructures,
        widthForStructure,
        heightForStructure,
        invertorCapacity,
        invertorPrice,
        distance,
        typeOfPipe,
        priceTotalOfPipe,
        totalWire,
        priceOfWire,
        priceTotal: gains,
      });
    } catch (error) {
      console.log("Error calculating quote:", error);
      return res.status(500).json({
        message:
          "Ocurrió un error al calcular la cotización. Inténtalo de nuevo más tarde.",
      });
    } finally {
      connection.release();
    }
  }
}

export default new indexController();
