#!/bin/bash
# Restart Claude translation routes after token refresh
# Scheduled to run at 00:40

cd /Users/yaoguanghua/Projects/Skills/insighthunt

echo "$(date): Restarting Claude translation routes..." >> /tmp/claude_restart.log

# Kill any existing Claude processes
pkill -f "unified_translate.py claude" 2>/dev/null
sleep 2

# Restart Claude routes (slots 0-4)
for i in 0 1 2 3 4; do
    nohup python3 scripts/unified_translate.py claude $i > /tmp/claude_$i.log 2>&1 &
    echo "Started Claude slot $i (PID: $!)" >> /tmp/claude_restart.log
done

echo "$(date): Claude routes restarted successfully" >> /tmp/claude_restart.log

# Show current progress
python3 -c "import json; d=json.load(open('data/transcripts/retranslation_progress.json')); print(f'Current progress: {len(d[\"completed\"])}/125')" >> /tmp/claude_restart.log
