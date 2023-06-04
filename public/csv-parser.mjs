import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const stream = fs.createReadStream('/Users/rjkigner/projects/pest-map/public/harvest.csv');

    stream
        .pipe(csv())
        .on('data', async (row) => {
            const harvestData = {
                name: row.name,
                year: parseInt(row.year),
                harvest_percent: parseFloat(row.harvest_percent),
            };

            try {
                await prisma.harvest.create({ data: harvestData });
                console.log(`Added ${harvestData.county_name} to the database.`);
            } catch (error) {
                console.error(`Error adding ${harvestData.county_name} to the database.`);
                console.error(error);
            }
        })
        .on('end', async () => {
            await prisma.$disconnect();
            console.log('CSV file successfully processed');
        });
}

main();
