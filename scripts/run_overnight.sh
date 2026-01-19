#!/bin/bash
# =============================================================
# InsightHunt Translation - Overnight Keep-Alive Script
# =============================================================
# 保活机制：
# 1. caffeinate 阻止系统休眠
# 2. 脚本崩溃自动重启
# 3. 详细日志记录
# 4. 网络错误重试
# =============================================================

cd /Users/yaoguanghua/Projects/Skills/insighthunt

LOG_FILE="data/transcripts/overnight_$(date +%Y%m%d_%H%M%S).log"
BATCH_SIZE=10
MAX_RETRIES=3
RETRY_DELAY=60

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "${GREEN}🌙 开始过夜翻译任务${NC}"
log "📁 日志文件: $LOG_FILE"
log "📦 每批数量: $BATCH_SIZE"

# 确保 caffeinate 在运行
ensure_caffeinate() {
    if ! pgrep -x caffeinate > /dev/null; then
        log "${YELLOW}☕ 启动 caffeinate 防止休眠${NC}"
        caffeinate -i -s -d &
        sleep 1
    fi
}

# 检查翻译进度
check_progress() {
    local total=$(ls data/transcripts/*.json 2>/dev/null | wc -l | tr -d ' ')
    local translated=$(grep "transcript_zh" data/transcripts/*.json 2>/dev/null | wc -l | tr -d ' ')
    log "📊 进度: $translated / $total 已翻译"
}

# 运行翻译批次
run_batch() {
    local retry=0
    while [ $retry -lt $MAX_RETRIES ]; do
        log "🔄 开始翻译批次 (尝试 $((retry+1))/$MAX_RETRIES)"
        
        # 运行翻译脚本
        python3 scripts/translate_transcripts.py --count $BATCH_SIZE 2>&1 | tee -a "$LOG_FILE"
        local exit_code=${PIPESTATUS[0]}
        
        if [ $exit_code -eq 0 ]; then
            log "${GREEN}✅ 批次完成${NC}"
            return 0
        else
            log "${RED}❌ 批次失败 (exit code: $exit_code)${NC}"
            retry=$((retry+1))
            if [ $retry -lt $MAX_RETRIES ]; then
                log "${YELLOW}⏳ 等待 ${RETRY_DELAY}s 后重试...${NC}"
                sleep $RETRY_DELAY
            fi
        fi
    done
    
    log "${RED}❌ 批次在 $MAX_RETRIES 次尝试后仍失败${NC}"
    return 1
}

# 主循环
main() {
    ensure_caffeinate
    check_progress
    
    local batch_count=0
    local fail_count=0
    local max_fails=5
    
    while true; do
        batch_count=$((batch_count+1))
        log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log "🔢 批次 #$batch_count"
        
        # 确保防休眠还在运行
        ensure_caffeinate
        
        # 运行批次
        if run_batch; then
            fail_count=0
        else
            fail_count=$((fail_count+1))
            if [ $fail_count -ge $max_fails ]; then
                log "${RED}💀 连续失败 $max_fails 次，暂停 10 分钟${NC}"
                sleep 600
                fail_count=0
            fi
        fi
        
        # 检查是否全部完成
        local remaining=$(python3 -c "
import json, os
files = [f for f in os.listdir('data/transcripts') if f.endswith('.json')]
count = sum(1 for f in files if 'transcript_zh' not in json.load(open(f'data/transcripts/{f}')))
print(count)
" 2>/dev/null || echo "999")
        
        if [ "$remaining" = "0" ]; then
            log "${GREEN}🎉 全部翻译完成！${NC}"
            break
        fi
        
        log "📌 剩余: $remaining 个待翻译"
        
        # 批次间隔
        log "⏳ 休息 15 秒..."
        sleep 15
    done
    
    log "${GREEN}🏁 过夜任务完成${NC}"
    check_progress
}

# 捕获中断信号
trap 'log "${YELLOW}⚠️ 收到中断信号，正在退出...${NC}"; exit 0' SIGINT SIGTERM

# 启动
main
