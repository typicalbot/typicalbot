/* eslint-disable no-console */
import dotenv from 'dotenv';
import fs from 'fs';
import TypicalClient from './lib/TypicalClient';

dotenv.config();

fs.mkdir('data', (err) => {
    if (err && err.code !== 'EEXIST') console.error(err);
});

new TypicalClient();
