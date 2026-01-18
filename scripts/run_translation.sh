#!/bin/bash
# InsightHunt - Overnight Transcript Translation
# 无人值守批量翻译转录文本

set -e

cd /Users/yaoguanghua/Projects/Skills/insighthunt

LOG_FILE="data/transcripts/translation_log_$(date +%Y%m%d_%H%M%S).txt"
mkdir -p data/transcripts

echo "🌐 InsightHunt Transcript Translation" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"

# Process in batches of 10
BATCH_SIZE=10
TOTAL=297

for ((batch=0; batch<TOTAL; batch+=BATCH_SIZE)); do
    echo "" | tee -a "$LOG_FILE"
    echo "📦 Batch starting at offset $batch..." | tee -a "$LOG_FILE"
    
    python3 scripts/translate_transcripts.py --count $BATCH_SIZE 2>&1 | tee -a "$LOG_FILE"
    
    echo "⏳ Batch complete, sleeping 10s..." | tee -a "$LOG_FILE"
    sleep 10
done

echo "" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo "🎉 ALL TRANSCRIPTS TRANSLATED!" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"
