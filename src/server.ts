import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/main";

const server = express();
server.use(cors());
server.use(helmet());
server.use(urlencoded({ extended: true }));
server.use(express.json());

//rotas
server.use(mainRouter);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
