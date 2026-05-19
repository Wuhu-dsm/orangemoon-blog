# SoraBlog 全栈博客实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建一个完整的全栈个人博客，包含 React + Vite 前端、Nest.js + MongoDB 后端、Redis 缓存、Elasticsearch 搜索、Bull 队列，支持 18 个 UI 页面和内置管理后台。

**Architecture:** 前后端分离，Docker Compose 部署。前端 React SPA 调用 REST API，后端 Nest.js 单体服务，MongoDB 主存储，Redis 缓存/限流/队列，ES 搜索索引，Bull 异步处理。

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Recharts + Zustand + TanStack Query + Nest.js 11 + Mongoose + Redis + Elasticsearch + Bull + Docker

