#!/usr/bin/env node

/**
 * Supabase Setup Script
 * ---------------------
 * This script helps set up Supabase for the DCS chatbot application.
 * It checks for required dependencies, installs them if needed,
 * and helps initialize the database structure.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Log with color
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Header
log('', colors.cyan);
log('╔═══════════════════════════════════════════╗', colors.cyan);
log('║         SUPABASE SETUP ASSISTANT          ║', colors.cyan);
log('║         for DCS Chatbot Project           ║', colors.cyan);
log('╚═══════════════════════════════════════════╝', colors.cyan);
log('', colors.cyan);

// Check if supabase-js is installed
async function checkSupabaseInstalled() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies['@supabase/supabase-js']) {
      log('✓ Supabase client is already installed.', colors.green);
      return true;
    } else {
      log('⚠ Supabase client is not installed in package.json.', colors.yellow);
      return false;
    }
  } catch (error) {
    log('⚠ Could not read package.json.', colors.yellow);
    return false;
  }
}

// Install Supabase client
async function installSupabaseClient() {
  return new Promise((resolve) => {
    rl.question('Do you want to install @supabase/supabase-js now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          log('Installing @supabase/supabase-js...', colors.cyan);
          execSync('npm install @supabase/supabase-js --save', { stdio: 'inherit' });
          log('✓ Supabase client installed successfully.', colors.green);
          resolve(true);
        } catch (error) {
          log(`✗ Failed to install Supabase client: ${error.message}`, colors.red);
          resolve(false);
        }
      } else {
        log('⚠ Skipping Supabase client installation.', colors.yellow);
        resolve(false);
      }
    });
  });
}

// Check for .env.local file
async function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
    const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
    
    if (hasSupabaseUrl && hasSupabaseKey) {
      log('✓ .env.local file exists with Supabase configuration.', colors.green);
      return true;
    } else {
      log('⚠ .env.local exists but is missing Supabase configuration.', colors.yellow);
      return false;
    }
  } else {
    log('⚠ .env.local file does not exist.', colors.yellow);
    return false;
  }
}

// Create or update .env.local file
async function setupEnvFile() {
  return new Promise((resolve) => {
    rl.question('Do you want to set up Supabase environment variables now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question('Enter your Supabase URL: ', (url) => {
          rl.question('Enter your Supabase anon key: ', (key) => {
            try {
              const envPath = path.join(process.cwd(), '.env.local');
              let envContent = '';
              
              if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf8');
              }
              
              // Update or add Supabase variables
              if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
                envContent += `\nNEXT_PUBLIC_SUPABASE_URL=${url}\n`;
              } else {
                envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_URL=.*/, `NEXT_PUBLIC_SUPABASE_URL=${url}`);
              }
              
              if (!envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
                envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${key}\n`;
              } else {
                envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${key}`);
              }
              
              fs.writeFileSync(envPath, envContent);
              log('✓ .env.local updated with Supabase configuration.', colors.green);
              resolve(true);
            } catch (error) {
              log(`✗ Failed to update .env.local: ${error.message}`, colors.red);
              resolve(false);
            }
          });
        });
      } else {
        log('⚠ Skipping environment variable setup.', colors.yellow);
        resolve(false);
      }
    });
  });
}

// Check for SQL setup file
async function checkSqlFile() {
  const sqlPath = path.join(process.cwd(), 'supabase-setup.sql');
  
  if (fs.existsSync(sqlPath)) {
    log('✓ supabase-setup.sql file exists.', colors.green);
    return true;
  } else {
    log('⚠ supabase-setup.sql file does not exist.', colors.yellow);
    return false;
  }
}

// Main function
async function main() {
  // Check if Supabase client is installed
  const isSupabaseInstalled = await checkSupabaseInstalled();
  if (!isSupabaseInstalled) {
    await installSupabaseClient();
  }
  
  // Check for environment variables
  const hasEnvFile = await checkEnvFile();
  if (!hasEnvFile) {
    await setupEnvFile();
  }
  
  // Check for SQL setup file
  const hasSqlFile = await checkSqlFile();
  if (!hasSqlFile) {
    log('✗ supabase-setup.sql file is missing. Please create it from the documentation.', colors.red);
  } else {
    log('\nNext steps:', colors.cyan);
    log('1. Go to your Supabase dashboard: https://app.supabase.com', colors.white);
    log('2. Select your project', colors.white);
    log('3. Go to the SQL Editor section', colors.white);
    log('4. Create a new query', colors.white);
    log('5. Copy and paste the contents of supabase-setup.sql', colors.white);
    log('6. Run the query to set up your database schema', colors.white);
    log('\nAfter completing these steps, restart your Next.js development server.', colors.yellow);
  }
  
  // Provide final instructions
  log('\nSetup assistant complete!', colors.green);
  
  rl.close();
}

// Run the script
main().catch(error => {
  log(`✗ Error: ${error.message}`, colors.red);
  rl.close();
}); 