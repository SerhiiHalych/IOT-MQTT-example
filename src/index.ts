import express, { json, urlencoded } from "express";
import { MQTTBroker } from "./MQTTBrocker";
import page from "./page";

const mqttBroker = new MQTTBroker();

const app = express();

let currentPotentiometerValue = 0;

app.use(json());

app.use(urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/page", (req, res) => {
  res.setHeader("Content-type", "text/html");
  res.send(page);
});

app.get("/potentiometer", (req, res) => {
  res.send({
    potentiometerValue: currentPotentiometerValue,
  });
});

app.post("/display", (req, res) => {
  const { message } = req.body;

  mqttBroker.publish("iot-mqtt-example/lcd-display", message);

  res.status(200).send();
});

app.listen(Number(process.env.PORT) || 8080, async () => {
  console.info(`Server started`);

  await mqttBroker.connect();

  mqttBroker.subscribe("iot-mqtt-example/potentiometer", (value: string) => {
    currentPotentiometerValue = +value;
  });
});
