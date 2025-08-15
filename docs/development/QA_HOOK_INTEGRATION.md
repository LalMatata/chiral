# QA Agent Hook Integration Guide

## Overview
This document explains how to integrate the CHIRAL QA Engineer agent into Claude Code hooks for automated testing on code changes.

## Hook Configuration

### 1. Settings File Location
Add the following configuration to your Claude Code settings file:

**macOS**: `~/.claude/settings.json`
**Windows**: `%APPDATA%\.claude\settings.json`
**Linux**: `~/.claude/settings.json`

### 2. Hook Configuration

```json
{
  "hooks": {
    "after-edit": [
      {
        "command": "echo 'Running QA validation after code changes...'",
        "cwd": "/Users/hz/chiral_repo"
      },
      {
        "command": "claude-code --agent-type qa-engineer --prompt-file docs/development/QA_AGENT_PROMPT.md --auto-test",
        "cwd": "/Users/hz/chiral_repo",
        "timeout": 300000
      }
    ],
    "before-commit": [
      {
        "command": "echo 'Running pre-commit QA checks...'",
        "cwd": "/Users/hz/chiral_repo"
      },
      {
        "command": "claude-code --agent-type qa-engineer --prompt-file docs/development/QA_AGENT_PROMPT.md --critical-only",
        "cwd": "/Users/hz/chiral_repo",
        "timeout": 180000
      }
    ],
    "after-pull": [
      {
        "command": "echo 'Running QA validation after code updates...'",
        "cwd": "/Users/hz/chiral_repo"
      },
      {
        "command": "claude-code --agent-type qa-engineer --prompt-file docs/development/QA_AGENT_PROMPT.md --regression-test",
        "cwd": "/Users/hz/chiral_repo",
        "timeout": 600000
      }
    ]
  }
}
```

## Alternative Implementation (Direct Agent Call)

If you prefer to use the Task tool directly, here's the configuration:

```json
{
  "hooks": {
    "after-edit": [
      {
        "command": "echo 'Code changes detected - initiating QA validation'",
        "cwd": "/Users/hz/chiral_repo"
      }
    ]
  },
  "custom_agents": {
    "qa-engineer": {
      "prompt_file": "docs/development/QA_AGENT_PROMPT.md",
      "description": "Comprehensive QA testing for CHIRAL website",
      "auto_trigger": ["after-edit", "before-commit", "after-pull"]
    }
  }
}
```

## QA Agent Task Call

When you want to manually trigger the QA agent or integrate it with Claude Code's Task tool:

```javascript
// Task tool parameters
{
  "subagent_type": "general-purpose", // or "qa-engineer" if available
  "description": "Run comprehensive QA testing",
  "prompt": `You are the CHIRAL Website QA Engineer. Execute the complete testing protocol defined in /Users/hz/chiral_repo/docs/development/QA_AGENT_PROMPT.md

IMMEDIATE ACTIONS REQUIRED:
1. Run development server testing: pnpm run dev
2. Execute build validation: pnpm run build  
3. Run linting checks: pnpm run lint
4. Test all critical user paths
5. Validate responsive design
6. Check performance metrics
7. Generate comprehensive QA report

SPECIFIC AREAS TO TEST:
- All page navigation and routing
- Product image display functionality  
- Contact form multi-step process
- Mobile responsive design
- Animation synchronization
- Button alignment and consistency
- Brand element updates (logo, contact info, copyright)
- WhatsApp button removal validation

Provide a detailed QA report with:
- Executive summary (PASS/FAIL status)
- Critical issues (P0) requiring immediate attention
- High priority issues (P1) for next release  
- Performance scores and recommendations
- Sign-off recommendation for production readiness

Follow the testing protocol exactly as specified in the QA_AGENT_PROMPT.md file.`
}
```

## Trigger Scenarios

### 1. After Edit Hook
**Trigger**: Any file modification in the project
**Purpose**: Quick validation of changes
**Scope**: Focused testing on modified areas
**Timeout**: 5 minutes

### 2. Before Commit Hook  
**Trigger**: Before git commit execution
**Purpose**: Ensure code quality before version control
**Scope**: Critical path testing only
**Timeout**: 3 minutes

### 3. After Pull Hook
**Trigger**: After git pull or merge operations
**Purpose**: Regression testing for team changes
**Scope**: Full comprehensive testing suite
**Timeout**: 10 minutes

## QA Testing Commands

Create these npm scripts in your `package.json`:

```json
{
  "scripts": {
    "qa:full": "echo 'Running full QA suite...' && pnpm run dev & sleep 5 && pnpm run build && pnpm run lint",
    "qa:critical": "echo 'Running critical path tests...' && pnpm run build && pnpm run lint --max-warnings=0",
    "qa:performance": "echo 'Performance testing...' && pnpm run build && du -sh dist/",
    "qa:dev-test": "echo 'Development server test...' && timeout 30 pnpm run dev"
  }
}
```

## Integration with Claude Code

### Manual QA Agent Invocation

When working in Claude Code, you can trigger the QA agent with:

```
Please run the CHIRAL QA Engineer agent to test the website after my recent changes. Focus on:
- Verifying all modifications work correctly
- Testing responsive design
- Validating build process
- Checking for any regressions
```

### Automated Integration

The hooks will automatically trigger the QA agent when:
1. You save files (after-edit)
2. You create commits (before-commit)  
3. You pull changes (after-pull)

## QA Report Integration

### Slack/Teams Integration (Optional)
```bash
# Add to hook commands for team notifications
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"QA Report: CHIRAL Website - Status: PASSED/FAILED"}' \
YOUR_WEBHOOK_URL
```

### File-based Reporting
The QA agent will generate reports in:
- `docs/testing/qa-reports/YYYY-MM-DD-HH-MM-SS.md`
- Latest report: `docs/testing/qa-latest-report.md`

## Best Practices

1. **Keep QA prompt updated** as website features evolve
2. **Adjust timeouts** based on project complexity
3. **Monitor hook performance** to avoid development slowdown
4. **Review QA reports** before production deployments
5. **Customize test scope** based on change magnitude

## Troubleshooting

### Common Issues
- **Hook timeout**: Increase timeout values for complex projects
- **Permission errors**: Ensure proper file permissions for hook commands
- **Missing dependencies**: Verify all required tools are installed

### Debug Commands
```bash
# Test hook configuration
claude-code --test-hooks

# Validate QA agent prompt
claude-code --validate-agent qa-engineer

# Manual QA execution
claude-code --run-agent qa-engineer --project /Users/hz/chiral_repo
```

This integration ensures consistent quality validation with every code change, maintaining CHIRAL's high standards for their professional robotics website.