const fs = require('fs');
const path = require('path');
const { CASH_IN, CASH_OUT, NATURAL, JURIDICAL } = require('./constants');

// Commission fee configurations
const CASH_IN_FEE = { percents: 0.03, max: { amount: 5, currency: 'EUR' } };
const CASH_OUT_NATURAL_FEE = { percents: 0.3, week_limit: { amount: 1000, currency: 'EUR' } };
const CASH_OUT_JURIDICAL_FEE = { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } };

// Helper function to parse date string into Date object
function parseDate(dateStr) {
    return new Date(dateStr);
}

// Helper function to get the start of the week for a given date
function getWeekStart(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(date.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

// Helper function to round up the amount to the smallest currency item (e.g., cents)
function roundUp(amount) {
    return Math.ceil(amount * 100) / 100;
}

// Main function to calculate commissions
function calculateCommissions(inputFile) {
    const operations = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const userWeeklyCashOuts = {};
    const result = [];

    operations.forEach((op) => {
        const date = parseDate(op.date);
        const userId = op.user_id;
        const userType = op.user_type;
        const opType = op.type;
        const amount = op.operation.amount;

        let fee = 0;

        if (opType === CASH_IN) {
            fee = Math.min(amount * CASH_IN_FEE.percents / 100, CASH_IN_FEE.max.amount);
        } else if (opType === CASH_OUT) {
            if (userType === NATURAL) {
                const weekStart = getWeekStart(new Date(date.getTime()));
                const weekKey = `${userId}-${weekStart.toISOString().slice(0, 10)}`;

                if (!userWeeklyCashOuts[weekKey]) {
                    userWeeklyCashOuts[weekKey] = 0;
                }

                const totalWeeklyAmount = userWeeklyCashOuts[weekKey];
                const remainingFreeAmount = Math.max(0, CASH_OUT_NATURAL_FEE.week_limit.amount - totalWeeklyAmount);
                const chargeableAmount = Math.max(0, amount - remainingFreeAmount);

                fee = chargeableAmount * CASH_OUT_NATURAL_FEE.percents / 100;

                userWeeklyCashOuts[weekKey] += amount;
            } else if (userType === JURIDICAL) {
                fee = Math.max(amount * CASH_OUT_JURIDICAL_FEE.percents / 100, CASH_OUT_JURIDICAL_FEE.min.amount);
            }
        }

        const roundedFee = roundUp(fee);
        result.push(roundedFee.toFixed(2));
    });

    return result;
}

// If the script is run directly from the command line
if (require.main === module) {
    const inputFile = process.argv[2];
    if (inputFile) {
        const result = calculateCommissions(path.resolve(__dirname, inputFile));
        console.log('AAAAAAA @@@: ', result.join('\n'));
    } else {
        console.error('Please provide the path to the input file as a command line argument.');
        process.exit(1);
    }
}

module.exports = calculateCommissions;
