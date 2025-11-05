#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Collaborative Code Editor...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js ${nodeVersion.trim()} is installed`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js 16 or higher.');
  process.exit(1);
}
// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm ${npmVersion.trim()} is installed`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm.');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/collaborative-editor

# Client Configuration
REACT_APP_SERVER_URL=http://localhost:5000
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
} else {
  console.log('✅ .env file already exists');
}
// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}
// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });
  console.log('✅ Client dependencies installed');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}
console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start MongoDB (if not using Docker):');
console.log('   - Install MongoDB locally, or');
console.log('   - Use Docker: docker run -d -p 27017:27017 --name mongo mongo:6');
console.log('\n2. Start the development server:');
console.log('   npm run dev');
console.log('\n3. Open your browser and navigate to:');


console.log('   http://localhost:3000');
console.log('\n4. Create a room and start coding collaboratively!');
console.log('\n🐳 Alternative: Use Docker Compose for easy setup:');
console.log('   docker-compose up --build'); 
