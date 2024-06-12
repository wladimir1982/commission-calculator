const path = require('path');
const calculateCommissions = require('./app');

test('should calculate correct commissions', () => {
    const inputFile = path.resolve(__dirname, 'input.json');
    const expectedOutput = [
        '0.06',
        '0.90',
        '87.00',
        '3.00',
        '0.30',
        '0.30',
        '5.00',
        '0.00',
        '0.00',
    ];

    const result = calculateCommissions(inputFile);
    expect(result).toEqual(expectedOutput);
});
