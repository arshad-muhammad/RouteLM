# RouteLM — Reliable AI Gateway and Smart Model Failover

RouteLM is an easy-to-use, powerful AI Gateway designed to make your AI applications reliable. It automatically manages API keys, monitors latency, and handles model errors (like rate limits or server downtime) by switching to backup models instantly.

---

## 🌟 Key Features

- **Model Interactive Playground**: Test, compare, and fine-tune different AI models side-by-side with immediate response tracking.
- **Failover & Retry Policies**: Set smart backup rules (e.g., if Model A returns a rate limit error, switch to Model B instantly).
- **Secure Gateways Vault**: Save and manage your API keys safely inside our hardware-inspired environment.
- **Provider Connections**: Link your chosen AI providers to easily sync systems.
- **Real-time Telemetry & Logs**: Easily check response status codes, latencies, and look for failover alerts.
- **Team Privileges**: Add operators and set workspace access rules (Owner, Administrator, Read-Only, or Auditor).
- **Billing Ledger**: Track usage stats and calculate API expenses transparently.

---

## 🚀 Quickstart Guide

RouteLM makes it simple to manage your routing policies in a few steps:

### 1. Register or Import Connections
Access the **Provider Connections** tab to link your Gemini or other API configurations with our gateway.

### 2. Define Failover Rules
Go to **Failover Policies**, design standard rules for when a model experiences latency or error responses:
```json
{
  "policyId": "fast_gemini_fallback",
  "triggerOnStatusCodes": [429, 500, 503],
  "latencyThresholdMs": 1500,
  "fallbacks": ["gemini-2.5-flash", "gemini-2.1-flash-lite"]
}
```

### 3. Run side-by-side tests
Run live prompts in the **Playground** to see how quickly the model answers, how much it costs, and check whether redundant backup routers are active in real-time.

---

## 🛠️ Local Development

To run this console layout locally:

```bash
# 1. Install required packages
npm install

# 2. Run the development server
npm run dev

# 3. Compile and build the platform UI
npm run build
```

This applet runs seamlessly with modern React, Tailwind CSS, and highly responsive animations. All security controls are simulated in our secure local sandbox.
