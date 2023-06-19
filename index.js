const http = require("http");
const fs = require("fs");
const url = require("url");
const fillTemplate = require("./Modules/modules.js");

const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/templates-card.html`,
  "utf-8"
);
const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/templates-overview.html`,
  "utf-8"
);

const productTemplate = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const productsObj = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productsObjArr = JSON.parse(productsObj);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    let productsComponent = productsObjArr
      .map((product) => fillTemplate(product, cardTemplate))
      .join("");
    productsComponent = overviewTemplate.replace(
      /{%PRODUCT_CARDS%}/g,
      productsComponent
    );
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(productsComponent);
  } else if (pathname === "/product") {
    let pq = productsObjArr;

    let singleProductCompoent = fillTemplate(
      productsObjArr[Number(query.id)],
      productTemplate
    );

    res.writeHead(200, {
      "content-type": "text/html",
    });

    res.end(singleProductCompoent);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(productsObj);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });

    res.end("<h1>Page not found.</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening on port 3000");
});
