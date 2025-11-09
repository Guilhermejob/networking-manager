import 'dotenv/config';
import createServer from './server';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = createServer();

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
})