#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Get PORT from environment, default to 3000 if not set or empty
let port = 3000;
if (process.env.PORT) {
  const portStr = process.env.PORT.trim();
  if (portStr !== '') {
    const parsedPort = parseInt(portStr, 10);
    if (!isNaN(parsedPort) && parsedPort > 0) {
      port = parsedPort;
    }
  }
}

// Use the local next binary from node_modules
const nextPath = path.join(__dirname, '..', 'node_modules', '.bin', 'next');

// Start Next.js with the port
const next = spawn(nextPath, ['start', '-p', port.toString()], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

next.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

next.on('exit', (code) => {
  process.exit(code || 0);
});

