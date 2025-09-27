#!/bin/bash

# ApplyMint AI DBML Tools
# Helper script for working with DBML files

set -e

DBML_FILE="applymint-schema.dbml"
OUTPUT_DIR="./dbml-outputs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}ApplyMint AI DBML Tools${NC}"
echo "========================"

# Check if dbml-cli is installed
if ! command -v dbml2sql &> /dev/null; then
    echo -e "${YELLOW}Warning: dbml2sql not found. Install with: npm install -g @dbml/cli${NC}"
    echo -e "${YELLOW}Continuing with basic validation...${NC}"
fi

# Validate DBML syntax
echo -e "\n${BLUE}1. Validating DBML syntax...${NC}"
if command -v dbml2sql &> /dev/null; then
    if dbml2sql "$DBML_FILE" --postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✓ DBML syntax is valid${NC}"
    else
        echo -e "${RED}✗ DBML syntax errors found${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ Skipping validation (dbml2sql not installed)${NC}"
fi

# Generate PostgreSQL SQL
echo -e "\n${BLUE}2. Generating PostgreSQL SQL...${NC}"
if command -v dbml2sql &> /dev/null; then
    dbml2sql "$DBML_FILE" --postgres > "$OUTPUT_DIR/schema-postgres.sql"
    echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/schema-postgres.sql${NC}"
else
    echo -e "${YELLOW}⚠ Skipping SQL generation (dbml2sql not installed)${NC}"
fi

# Generate MySQL SQL
echo -e "\n${BLUE}3. Generating MySQL SQL...${NC}"
if command -v dbml2sql &> /dev/null; then
    dbml2sql "$DBML_FILE" --mysql > "$OUTPUT_DIR/schema-mysql.sql"
    echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/schema-mysql.sql${NC}"
else
    echo -e "${YELLOW}⚠ Skipping MySQL generation (dbml2sql not installed)${NC}"
fi

# Generate SQLite SQL
echo -e "\n${BLUE}4. Generating SQLite SQL...${NC}"
if command -v dbml2sql &> /dev/null; then
    dbml2sql "$DBML_FILE" --sqlite > "$OUTPUT_DIR/schema-sqlite.sql"
    echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/schema-sqlite.sql${NC}"
else
    echo -e "${YELLOW}⚠ Skipping SQLite generation (dbml2sql not installed)${NC}"
fi

# Generate Mermaid diagram
echo -e "\n${BLUE}5. Generating Mermaid diagram...${NC}"
if command -v dbml-renderer &> /dev/null; then
    dbml-renderer "$DBML_FILE" -t mermaid > "$OUTPUT_DIR/diagram.mmd"
    echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/diagram.mmd${NC}"
    echo -e "${YELLOW}  → Use https://mermaid.live/ to view the diagram${NC}"
else
    echo -e "${YELLOW}⚠ Skipping Mermaid generation (dbml-renderer not installed)${NC}"
    echo -e "${YELLOW}  Install with: npm install -g @dbml/cli${NC}"
fi

# Generate DOT diagram
echo -e "\n${BLUE}6. Generating DOT diagram...${NC}"
if command -v dbml-renderer &> /dev/null; then
    dbml-renderer "$DBML_FILE" -t dot > "$OUTPUT_DIR/diagram.dot"
    echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/diagram.dot${NC}"
    echo -e "${YELLOW}  → Use Graphviz to render: dot -Tpng diagram.dot > diagram.png${NC}"
else
    echo -e "${YELLOW}⚠ Skipping DOT generation (dbml-renderer not installed)${NC}"
fi

# Generate SVG diagram (if supported)
echo -e "\n${BLUE}7. Generating SVG diagram...${NC}"
if command -v dbml-renderer &> /dev/null; then
    if dbml-renderer "$DBML_FILE" -t svg > "$OUTPUT_DIR/diagram.svg" 2>/dev/null; then
        echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/diagram.svg${NC}"
    else
        echo -e "${YELLOW}⚠ SVG generation not supported in this version${NC}"
    fi
fi

# Generate JSON schema
echo -e "\n${BLUE}8. Generating JSON schema...${NC}"
if command -v dbml-renderer &> /dev/null; then
    dbml-renderer "$DBML_FILE" -t json > "$OUTPUT_DIR/schema.json"
    echo -e "${GREEN}✓ Generated: $OUTPUT_DIR/schema.json${NC}"
else
    echo -e "${YELLOW}⚠ Skipping JSON generation (dbml-renderer not installed)${NC}"
fi

echo -e "\n${GREEN}🎉 DBML processing complete!${NC}"
echo -e "${BLUE}Output files created in: $OUTPUT_DIR/${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. View diagrams online: https://dbml.dbdiagram.io/"
echo "2. Use Mermaid diagrams: https://mermaid.live/"
echo "3. Render DOT files: brew install graphviz && dot -Tpng diagram.dot > diagram.png"
echo ""
echo -e "${BLUE}For more information, see DBML_README.md${NC}"