/* eslint-disable no-console */
import dotenv from 'dotenv';
import fs from 'fs';
import TypicalClient from './lib/TypicalClient';
import Database from './lib/database/database';

dotenv.config();

fs.mkdir('data', (err) => {
    if (err && err.code !== 'EEXIST') console.error(err);
});

const database = new Database();

new TypicalClient(database);
