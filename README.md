# OpenClaw Agent

This is an AI agent that runs locally on your machine.

## Getting Started

1. **Run the agent**: 
   ```bash
   npm start
   ```

2. **Task Inbox**
   - Tasks are placed in `/workspace/tasks/inbox`
   - The agent will automatically process new tasks

## Project Overview

This project is an AI agent designed to run locally on your machine. It handles automated tasks through a simple workflow:

- Tasks are placed in the inbox directory
- The agent automatically processes new tasks
- Each task is executed in isolation on a dedicated branch
- Completed tasks are merged back into the main branch

