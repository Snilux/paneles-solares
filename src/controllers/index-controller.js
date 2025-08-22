import { validateQuoteSchema } from "../schemas/quoter.js";
import {
  validateCostumerSchema,
  validateEmailSchema,
} from "../schemas/customer.js";

import quoterModel from "../models/quoter-model.js";
import CostumerModel from "../models/costumer-model.js";
import sendContactEmail from "../utils/sendContactEmail.js";

import dotenv from "dotenv";
dotenv.config();

class indexController {
  async renderIndexPage(req, res) {
    res.render("index", {
      title: "Ahorra Con Paneles Solares",
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

    if (!dataQuote.success) {
      return res.status(400).json({
        message: "Datos de cotización inválidos",
      });
    }
    const { average, distance, rates, threads } = dataQuote.data;
    let quoteResult = true;
    let especialRates = ["gdmth", "gdmto", "gdbt"];
    let requireUVIEAndUIIE = false;

    if (especialRates.includes(rates.toLowerCase())) {
      requireUVIEAndUIIE = true;
    }

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
        requireUVIEAndUIIE,
        rates,
        average,
        threads,
      });
    } catch (error) {
      console.log("Error calculating quote:", error);
      return res.status(500).json({
        message:
          "Ocurrió un error al calcular la cotización. Inténtalo de nuevo más tarde.",
      });
    }
  }

  async saveQuoteData(req, res) {
    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    };

    const customerValid = validateCostumerSchema(customerData);

    if (!customerValid.success) {
      const flatErrors = Object.values(
        customerValid.error.flatten().fieldErrors
      ).flat();

      return res.status(400).json({
        error: "Datos del cliente inválidos",
        messages: flatErrors,
      });
    }

    const costumerExists = await CostumerModel.findCostumerByEmail(
      customerValid.data
    );
    let idCostumer;
    if (costumerExists === null) {
      //If the customer does not exist, save the customer data

      const saveCostumer = await CostumerModel.saveCostumerData(
        customerValid.data
      );
      if (saveCostumer.success === false) {
        return res.status(500).json({
          errorMessage: "Error al guardar los datos del cliente",
          error: saveCostumer.error,
        });
      }
      idCostumer = saveCostumer.id;
    } else {
      //If the customer exists, save the quote data with the existing customer ID
      idCostumer = costumerExists.id;
    }

    console.log(req.body.cotizacionData);
    const saveQuote = await quoterModel.saveQuotePanel(
      idCostumer,
      req.body.cotizacionData
    );

    if (saveQuote.success === false) {
      return res.status(500).json({
        errorMessage: "Error al guardar la cotización de cámaras",
        error: saveQuote,
      });
    }

    return res.status(200).json({
      success: true,
      successMessage:
        "Hemos recibido tu pedido. Te contactaremos pronto para coordinar la instalación.",
    });
  }

  async sendEmail(req, res) {
    const captchaToken = req.body["g-recaptcha-response"];

    if (!captchaToken) {
      return res.status(400).json({
        error: "Por favor, completa el reCAPTCHA.",
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    try {
      const verificationRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`,
        {
          method: "POST",
        }
      );

      const captchaResult = await verificationRes.json();

      if (!captchaResult.success) {
        return res.status(403).json({
          error: "Falló la verificación del reCAPTCHA. Inténtalo de nuevo.",
        });
      }

      const validateEmail = validateEmailSchema(req.body);

      if (!validateEmail.success) {
        const flatErrors = Object.values(
          validateEmail.error.flatten().fieldErrors
        ).flat();

        return res.status(400).json({
          error: "Datos del cliente inválidos",
          message: flatErrors,
        });
      }

      const { name, email, phone, message } = validateEmail.data;

      const mailRes = await sendContactEmail({ name, email, phone, message });

      if (!mailRes.success) {
        return res.status(500).json({
          error: "No se pudo enviar el correo. Inténtalo más tarde.",
        });
      }

      return res.status(200).json({
        message:
          "Se ha enviado el correo correctamente, te contactaremos en breve!",
      });
    } catch (error) {
      console.error("Error en reCAPTCHA o al enviar correo:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export default new indexController();
