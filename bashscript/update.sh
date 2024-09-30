#!/bin/bash

set -e

# Directory paths
GAIANET_DIR="/home/ubuntu/gaianet"
QDRANT_SNAPSHOTS_DIR="$GAIANET_DIR/qdrant/snapshots/default"
LOG_FILE="$GAIANET_DIR/updates.log"

# Hugging Face repo ID
HF_REPO_ID="luniacllama/gaia-reviews-lks"

echo "Starting RAG model update process..."

# Change to the Gaianet directory
cd $GAIANET_DIR
echo "Changed to directory: $GAIANET_DIR"

# Run the Node.js script to fetch data and create markdown
cd nodescript
echo "Running fetchdata.js..."
node fetchdata.js
cd ..
echo "Finished running fetchdata.js"

# Delete existing collection
echo "Deleting existing collection..."
curl -X DELETE 'http://localhost:6333/collections/default'
echo "Existing collection deleted"

# Create new collection
echo "Creating new collection..."
curl -X PUT 'http://localhost:6333/collections/default' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "vectors": {
      "size": 768,
      "distance": "Cosine",
      "on_disk": true
    }
  }'
echo "New collection created"


# Use a known working file path for data
DATA_FILE="./data.md"
echo "data file path: $DATA_FILE"


echo "Running markdown embedding with data file..."
wasmedge --dir .:. --nn-preload "embedding:GGML:AUTO:nomic-embed-text-v1.5.f16.gguf" markdown_embed.wasm embedding default 768 $DATA_FILE --heading_level 1 --ctx_size 8192
echo "Markdown embedding with test file completed"

# Create snapshot
echo "Creating snapshot..."
SNAPSHOT_RESPONSE=$(curl -X POST 'http://localhost:6333/collections/default/snapshots')
echo "Snapshot response: $SNAPSHOT_RESPONSE"
SNAPSHOT_NAME=$(echo $SNAPSHOT_RESPONSE | jq -r '.result.name')
echo "Snapshot name: $SNAPSHOT_NAME"

# Create tar.gz of the snapshot
echo "Changing to snapshots directory: $QDRANT_SNAPSHOTS_DIR"
cd $QDRANT_SNAPSHOTS_DIR
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

TAR_NAME="${SNAPSHOT_NAME%.snapshot}.tar.gz"
echo "Creating tar.gz file: $TAR_NAME"
tar czvf $TAR_NAME $SNAPSHOT_NAME
echo "tar.gz file created"

# Upload to Hugging Face
echo "Uploading to Hugging Face..."
UPLOAD_RESPONSE=$(huggingface-cli upload $HF_REPO_ID $TAR_NAME $TAR_NAME)
echo "Upload response: $UPLOAD_RESPONSE"

# Update config.json
echo "Updating config.json..."
HUGGINGFACE_URL="https://huggingface.co/$HF_REPO_ID/resolve/main/$TAR_NAME"
jq --arg url "$HUGGINGFACE_URL" '.snapshot = $url' $GAIANET_DIR/config.json > $GAIANET_DIR/config.json.tmp && mv $GAIANET_DIR/config.json.tmp $GAIANET_DIR/config.json
echo "config.json updated"

# Restart the node 
echo "Restarting Gaianet node..."
gaianet init
gaianet stop
gaianet start

# Log the update completion
echo "[$(date '+%Y-%m-%d %H:%M:%S')] RAG model updated successfully!" >> "$LOG_FILE"
echo "Update process completed. Check $LOG_FILE for the log entry."