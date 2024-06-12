# Commission Calculator

This project calculates commission fees for cash in and cash out operations based on the provided input data. It supports operations for both natural and juridical persons and applies different commission fee rules accordingly.

## Features

- Calculates commission fees for cash in operations with a limit.
- Calculates commission fees for cash out operations with different rules for natural and juridical persons.
- Handles weekly limits for free cash outs for natural persons.
- Rounds up commission fees to the smallest currency item (e.g., cents).

## Getting Started

### Prerequisites

- Node.js installed on your machine (version 12 or higher).

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/wladimir1982/commission-calculator.git
    cd commission-calculator
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To calculate commissions based on the input data in `input.json`, run the following command:

```bash
node app.js input.json
```

### Running Tests
To run the tests, use the following command:

```bash
npm test
```
### Code Explanation
`app.js`: This is the main script that reads the input file, processes each operation, and calculates the corresponding commission fees. It handles different commission rules for cash in and cash out operations and maintains a record of weekly cash out amounts for natural persons to apply the weekly limit correctly.

`app.test.js`: This file contains tests to verify the correctness of the commission calculation logic using Jest. It ensures that the output matches the expected results.

`input.json`: This file contains sample input data for testing purposes. It includes a series of operations with different dates, user types, and operation types.

### Code Details
Rounding Up: The `roundUp` function is used to round up the commission fee to the smallest currency item, ensuring that the fee is always rounded up to the nearest cent.
Weekly Limit Handling: The script keeps track of the total cash out amount per user per week. It uses this information to determine whether the current cash out operation exceeds the weekly free limit for natural persons and calculates the commission fee accordingly.
javascript

// Helper function to get the start of the week for a given date
```bash
function getWeekStart(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(date.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}
```
// Helper function to round up the amount to the smallest currency item (e.g., cents)
```bash
function roundUp(amount) {
  return Math.ceil(amount * 100) / 100;
}
```
The code above shows the `getWeekStart` function, which calculates the start of the week for a given date, and the roundUp function, which rounds up the commission fee to the nearest cent.

### License
This project is licensed under the MIT License.
