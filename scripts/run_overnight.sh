#!/bin/bash
# InsightHunt - Overnight Batch Processing
# 无人值守批量处理脚本，自动重试失败项

set -e

cd /Users/yaoguanghua/Projects/Skills/insighthunt

LOG_FILE="data/extracted/batch_log_$(date +%Y%m%d_%H%M%S).txt"

echo "🌙 InsightHunt Overnight Batch Processing" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"

# Process in batches of 20 to avoid memory issues
BATCH_SIZE=20
TOTAL_REMAINING=196

for ((batch=0; batch<TOTAL_REMAINING; batch+=BATCH_SIZE)); do
    echo "" | tee -a "$LOG_FILE"
    echo "📦 Processing batch starting at offset $batch..." | tee -a "$LOG_FILE"
    
    python3 scripts/bilingual_pipeline.py --count $BATCH_SIZE 2>&1 | tee -a "$LOG_FILE"
    
    # Brief pause between batches
    echo "⏳ Batch complete, sleeping 5s..." | tee -a "$LOG_FILE"
    sleep 5
done

echo "" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo "🎉 ALL PROCESSING COMPLETE!" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"
