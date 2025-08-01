class indexController {
  async renderIndexPage(req, res) {
    res.render("index", {
      title: "Soluciones tecnologicas .net",
    });
  }

  async renderQuoterPage(req, res) {
    res.render("quoter", {
      title: "Cotizador de paneles solares",
    });
  }
}

export default new indexController();
