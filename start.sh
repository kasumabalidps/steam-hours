#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}╔════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║         Steam Bot - Installation           ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════╝${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed!${NC}"
    echo -e "${YELLOW}Please install npm and try again${NC}"
    exit 1
fi

if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install dependencies!${NC}"
        exit 1
    fi
    echo -e "${GREEN}Dependencies installed successfully!${NC}"
fi

if [ ! -f "config.json" ]; then
    echo -e "${RED}Error: config.json not found!${NC}"
    echo -e "${YELLOW}Please ensure config.json exists in the root directory${NC}"
    exit 1
fi

echo -e "${GREEN}Starting Steam Bot...${NC}"
node bot.js 