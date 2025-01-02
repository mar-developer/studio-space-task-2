const express = require("express");
const axios = require("axios");
const app = express();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get-report", (req, res) => {
  const status = "pending";
  let totalCount = 0;
  let dataCount = 12;
  let skip = 0;

  const agencies = ["Advertising, Brand & Creative", "Media, PR & Events"];

  const agencyCount = {
    AU: 0,
    GB: 0,
    US: 0,
    Others: 0,
  };

  async function getAgencyData(skip) {
    try {
      const response = await axios.get(
        `https://api.app.studiospace.com/listings/list-agencies?skip=${skip}`
      );

      const data = response.data[0];
      const totalCount = response.data[1];

      data.forEach((agency) => {
        const country = agency.locations[0].country.code;
        let hasAdvertising = false;
        let hasMedia = false;

        agency.agencyService.foreach((item) => {
          if (item.service.serviceGroup.name === agencies[0])
            hasAdvertising = true;

          if (item.service.serviceGroup.name === agencies[1]) 
            hasMedia = true;
        });

        console.log(hasAdvertising, hasMedia);
        if (hasAdvertising && hasMedia) agencyCount[country]++;
      });

      res.json(agencyCount);
    } catch (error) {
      res.status(500).send("Error fetching data");
    }
  }

  if (status === "pending") getAgencyData(skip);
  else res.json(agencyCount);
});
