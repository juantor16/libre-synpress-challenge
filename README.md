
# Libre Capital QA Challenge report


# 🖋️ Introduction
This document outlines the process, decisions, and challenges faced during the development of an automated test suite for the **Libre Capital QA Challenge**. The goal was to create a robust suite of end-to-end (e2e) tests for a decentralized application (DApp) on the Sepolia test network using **Synpress**, **Playwright**, and **MetaMask**.

# **📋 Table of Contents**
1.  [Project Objective](#🎯-project-objective)

2.  [Technologies Used](#🛠️-technologies-used)

3.  [Project Structure](#📦-project-structure)

4.  [Environment Setup](#⚙️-environment-setup)

5.  [Running Tests](#🚀-running-tests)

6.  [CI/CD Pipeline](#🔄-cicd-pipeline)

7.  [Additional Resources](#📎-additional-resources)

8.  [Author](#👤-author)


# **🎯 Project Objective**

The main objective was to automate the testing of a DApp interacting with smart contracts to ensure:

•  Automate the testing of a DApp for interacting with smart contracts on Sepolia. 

• dApp under test: [Link to dApp](https://qa-challange.netlify.app/)

•  Verify wallet connection, token balance retrieval, and deposit transactions.

•  Implement CI/CD using GitHub Actions for continuous testing.


# **🛠️ Technologies Used**

  

•  **Synpress (v4.0.3)**: Integrates Playwright with MetaMask for Web3 testing.

•  **Playwright**: For writing scalable e2e tests.

•  **TypeScript**: Ensuring type safety and maintainability.

•  **GitHub Actions**: Automating test execution.

## **📦 Project Structure**
```
📦Libre-synpress-challenge
 ┣ 📂reports
 ┣ 📂test
 ┃ ┣ 📂pages
 ┃ ┣ 📂playwright
 ┃ ┣ 📂utils
 ┃ ┗ 📂wallet-setup
 ┣ 📂test-results
 ┣ 📜.env.example
 ┣ 📜package.json
 ┣ 📜playwright.config.ts
 ┗ 📜README.md
```

**Project Structure Explanation**

•  **test/pages**: Page Object Model for DApp interactions.

•  **test/playwright**: Test scripts for specific functionalities.

•  **reports**: HTML reports for test execution.

•  **test-results**: Failure screenshots and traces.

•  **.github/workflows**: CI/CD configurations.

# **⚙️ Environment Setup**

**Requirements**

•  **Node.js**: v18+

•  **pnpm**: v8+

•  **MetaMask**: Installed as a browser extension
  

**Environment Variables**

Create a .env file with the following:

>     BASE_URL='https://qa-challange.netlify.app/'
>     SEED_PHRASE=''
>     METAMASK_PASSWORD=''

    

## **Installation**

1.  Clone the repository:

 

>     git clone https://github.com/librecapital/qa-challenge.git
>     cd libre-synpress-challenge

2.  Install dependencies:

>     pnpm install
  


# **🚀 Running Tests**

**Available Commands**

•  Run tests in **headful** mode:

> `pnpm run test:playwright:headful`

•  Run tests in **headless** mode:

> `pnpm run test:playwright:headless`

•  Run **regression** tests:

> pnpm run test:playwright:headful:regression

•  View test results in Playwright’s UI:

> pnpm run test:playwright:headless:ui


**Generating Reports**

•  Reports are generated in the reports/html directory. Open index.html to view results.

•  **Improvement Opportunity**: Hosting reports on a VPS for easy access.


# **🔄 CI/CD pipeline**

•  Uses **GitHub Actions** to automatically run tests on push and pull requests.

•  Artifacts are saved as HTML reports and test results for easy access.

**Secrets Used**

•  **SEED_PHRASE**: MetaMask recovery phrase.

•  **METAMASK_PASSWORD**: MetaMask password.


## **📎 Additional Resources**

•  [MetaMask Download](https://metamask.io/download/)

•  [Sepolia Faucet](https://sepoliafaucet.com)

•  [Playwright Documentation](https://playwright.dev/)

# **👤 Author**
**Juan Torres**

•  GitHub: [github.com/juantor16](https://github.com/juantor16)

•  LinkedIn: [linkedin.com/in/torres-juan-jose](https://www.linkedin.com/in/torres-juan-jose/)