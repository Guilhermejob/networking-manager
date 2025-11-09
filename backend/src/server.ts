import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';


function createServer() {

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (_req, res) => {
        res.send('Ta rodando!');
    });

    const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    };
    app.use(errorHandler);

    return app;
}


export default createServer;