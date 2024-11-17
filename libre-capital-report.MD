# Libre Capital QA Challenge report


# 🖋️ Introduction
This document outlines the process, decisions, and challenges faced during the development of an automated test suite for the **Libre Capital QA Challenge**. By leveraging **Synpress**, **Playwright**, and **MetaMask**, we implemented a series of end-to-end (e2e) tests for a decentralized application (DApp) interacting with smart contracts on the Sepolia test network.

# **🎯 Project Objective**
The main objective of this challenge was to build a robust testing environment for the DApp using an automation approach to ensure the application’s integrity when interacting with smart contracts. The focus included:

 - Connecting and validating the MetaMask wallet.
 - Performing search and deposit operations with ERC20 tokens.
 - Verifying the correct execution of transactions on the Sepolia network.
 - Setup CI/CD Pipelines for remote execution.
 - Analyze and create extra scenarios based on the features of the dApp.

# **🛠️ Project Architecture and Structure**

## **🛠️ Technologies Used**

  
During the development of this project, I utilized a combination of modern tools and frameworks to ensure a robust testing environment for the decentralized application (DApp). The primary technologies used were:

**1. Synpress (v4.0.3)**
Synpress is a testing framework that combines **Playwright** with built-in MetaMask support, allowing seamless interaction with Web3 applications.
The decision to upgrade from **Synpress 3.7.3 to 4.0.3** was driven by the need to accommodate MetaMask updates and ensure compatibility with the latest features.

  

**2. Playwright**
Playwright was the core framework used for writing end-to-end tests due to its powerful capabilities such as handling multiple browser contexts, robust locator strategies, and built-in test reporting.
Playwright’s native features like trace viewer, video recording, and flexible test configurations made it the ideal choice for automating complex Web3 interactions.

**3. TypeScript**
TypeScript was chosen to leverage type safety and improve code maintainability. It also helped catch potential bugs at compile time, increasing the reliability of the test suite.

**Evaluating Cucumber Integration**

As part of the initial project setup, I explored integrating **Cucumber** with Synpress and Playwright to leverage Gherkin syntax for more readable test scenarios.

•  **Pros**: Cucumber provides human-readable test steps which can make test reports easier to understand, especially for non-technical stakeholders.

•  **Cons**: During implementation, I discovered that using Cucumber with Playwright introduced limitations:

Cucumber abstracts away some of the **native Playwright functionalities**, reducing the flexibility and power that Playwright offers.
 The integration added unnecessary complexity, which impacted the performance and efficiency of the tests.
 
  **Final Decision**
After weighing the pros and cons, I decided not to include Cucumber in this project. Instead, I chose to fully utilize Playwright’s native features, which are more efficient and better suited to the dynamic nature of Web3 applications.

**Future Enhancements**: If more readable test steps are needed in reports, Playwright offers various customization options, such as annotations, custom steps, or plugins. I am also open to developing a custom solution that could provide more understandable reports without sacrificing the power of Playwright.


## **Project Structure**
```
📦Libre-synpress-challenge
 ┣ 📂.github
 ┣ 📂reports
 ┣ 📂test
 ┃ ┗ 📂pages
 ┃ ┃ ┗ 📜HomePage.ts
 ┃ ┗ 📂playwright
 ┃ ┃ ┣ 📜01-app-access.spec.ts
 ┃ ┃ ┣ 📜02-search-erc20-token.spec.ts
 ┃ ┃ ┣ 📜03-deposit-erc20-token.spec.ts
 ┃ ┃ ┗ 📜04-app-access.spec.ts
 ┃ ┗ 📂utils
 ┃ ┃ ┗ 📜Utils.ts
 ┃ ┗ 📂wallet-setup
 ┃   ┗ 📜basic.setup.ts
 ┣ 📂test-results
 ┣ 📜.env.example
 ┣ 📜.gitignore
 ┣ 📜Licence
 ┣ 📜package.json
 ┣ 📜playwright.config.ts
 ┣ 📜pnpm-lock.yaml
 ┗ 📜README.md
```

**Project Structure Explanation**

 - **test/pages**: Contains classes to model the pages and their interactions.

 -  **test/playwright**: Contains test files for different functionalities.
 -  **test/wallet-setup**: Configuration for the MetaMask wallet.
 - **reports**: HTML reports generated after running the tests.
 - **test-results**: Screenshots and traces of failures for debugging.
 - **.github/workflows**: CI/CD pipeline configuration using GitHub Actions.

# **⚙️ Environment Setup**

**Requirements**

•  **Node.js**: v18+

•  **pnpm**: v8+

•  **MetaMask**: Installed as a browser extension

•  **Docker** (optional)

  

**Environment Variables**

Create a .env file with the following:

>     BASE_URL='https://qa-challange.netlify.app/'
>     SEED_PHRASE=''
>     METAMASK_PASSWORD=''

    

## **Installation**

1.  Clone the repository:

 

>     git clone https://github.com/librecapital/qa-challenge.git

2.  Install dependencies:

>     pnpm install
  


## **🚀 Running Tests**
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

Reports are automatically generated in the reports/html directory. Open the ireports/html/ndex.html file to view the results only after an execution as finished.

**Opportunity for improvement:** We can serve these reports on a vps so that the latest report is always visible, updating such report after each execution.


# **🔄 CI/CD with GitHub Actions**
**Workflow Configuration**

File: .github/workflows/e2e-tests.yml

    name: E2E Tests
    
    on:
      push:
        branches:
          - main
      pull_request:
        branches:
          - '**'
    
    jobs:
      e2e-tests:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: pnpm/action-setup@v2
            with:
              version: 8
          - uses: actions/setup-node@v4
            with:
              node-version: '18'
              cache: 'pnpm'
          - name: Install dependencies
            run: pnpm install
          - name: Run E2E tests
            run: xvfb-run pnpm run test:playwright:headful:regression
**Secrets Used**

•  **SEED_PHRASE**: MetaMask recovery phrase.

•  **METAMASK_PASSWORD**: MetaMask password.

## **🛠️ Design Decisions**

•  Opted for a **monolithic repository** to encapsulate the automation suite in one place.

•  Leveraged **Synpress** to take advantage of Playwright and MetaMask integration.

•  Reports are automatically generated and archived as artifacts in GitHub Actions for easy access.


# **🚧 Challenges and Issues**

  

During this project, I encountered multiple technical challenges that required quick adaptation and problem-solving to overcome.

  

**Synpress Compatibility and MetaMask Updates**

  

Initially, I began working with **Synpress version 3.7.3**, as it was the most stable version I had used in the past. However, while covering the initial scenarios, I faced compatibility issues due to a **MetaMask update**, which caused existing locators to fail.

  

To resolve this, I decided to migrate to **Synpress version 4.0.3**, which required a complete overhaul of my previous setup due to significant changes in the new version’s structure and configurations. This involved reconfiguring the entire environment, updating tests to align with new selectors, and ensuring compatibility with MetaMask’s updated interface.

  

**iCloud Sync Issue**

  

Midway through implementing the first set of tests, I experienced a data loss issue caused by **iCloud synchronization**, which unexpectedly wiped my workspace. This forced me to rebuild the project environment from scratch. Despite the setback, this process allowed me to optimize the setup and improve efficiency in re-implementing the tests.

  

**Outcome**

  

Once the environment was reconfigured and updated to Synpress 4.0.3, I was able to rapidly complete the remaining test scenarios. The switch to the latest Synpress version ultimately improved test stability and compatibility with the updated MetaMask extension.

  

**Key Technical Solutions:**

  

•  **Environment Migration**: Successfully migrated from Synpress 3.7.3 to 4.0.3 to accommodate the latest MetaMask updates.

•  **Selector Updates**: Refactored locators and configurations to align with the updated MetaMask interface.

•  **Optimized Setup**: Rebuilt the project setup, which led to a more streamlined and efficient testing process.