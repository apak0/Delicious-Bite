/**
 * DeliciousBite Restaurant Order System Setup Script
 *
 * This script helps with initial project setup by:
 * - Checking for required dependencies
 * - Setting up environment variables
 * - Initializing Supabase if needed
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

console.log(`${colors.cyan}
╔════════════════════════════════════════════════════╗
║                                                    ║
║  DeliciousBite Restaurant Order System             ║
║  Setup Assistant                                   ║
║                                                    ║
╚════════════════════════════════════════════════════╝
${colors.reset}
`);

// Check for Node.js version
const nodeVersion = process.version;
console.log(`${colors.blue}Checking Node.js version...${colors.reset}`);
console.log(`Detected Node.js ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1).split(".")[0]) < 16) {
  console.log(
    `${colors.red}Error: Node.js version 16 or higher is required.${colors.reset}`
  );
  process.exit(1);
}

console.log(`${colors.green}✓ Node.js version OK${colors.reset}\n`);

// Check for required NPM packages
console.log(`${colors.blue}Checking required packages...${colors.reset}`);
try {
  execSync("npm list @supabase/supabase-js", { stdio: "ignore" });
  console.log(`${colors.green}✓ Supabase package found${colors.reset}`);
} catch (e) {
  console.log(
    `${colors.yellow}⚠ Supabase package not found. Installing...${colors.reset}`
  );
  try {
    execSync("npm install @supabase/supabase-js", { stdio: "inherit" });
  } catch (err) {
    console.log(
      `${colors.red}Error installing Supabase package.${colors.reset}`
    );
    process.exit(1);
  }
}

// Check for environment variables
console.log(`\n${colors.blue}Checking environment variables...${colors.reset}`);
const envPath = path.join(__dirname, ".env");

if (!fs.existsSync(envPath)) {
  console.log(
    `${colors.yellow}⚠ .env file not found. Creating from example...${colors.reset}`
  );

  const exampleEnvPath = path.join(__dirname, ".env.example");
  if (fs.existsSync(exampleEnvPath)) {
    fs.copyFileSync(exampleEnvPath, envPath);
    console.log(
      `${colors.green}✓ Created .env file from example${colors.reset}`
    );
    console.log(
      `${colors.yellow}⚠ Please update the values in .env with your Supabase credentials${colors.reset}`
    );
  } else {
    console.log(
      `${colors.red}Error: .env.example file not found.${colors.reset}`
    );
    process.exit(1);
  }
} else {
  console.log(`${colors.green}✓ .env file exists${colors.reset}`);
}

// Setup complete
console.log(`\n${colors.green}✓ Setup complete!${colors.reset}`);
console.log(`
${colors.cyan}Next steps:${colors.reset}
1. ${colors.yellow}Make sure your Supabase credentials are correct in .env file${colors.reset}
2. ${colors.yellow}Run 'npm run dev' to start the development server${colors.reset}
3. ${colors.yellow}Access the application at http://localhost:5173${colors.reset}

${colors.cyan}For any issues, please refer to the documentation or contact support.${colors.reset}
`);
