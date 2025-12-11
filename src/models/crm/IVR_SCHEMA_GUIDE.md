# IVR Schema Guide

## Overview

This document describes the schema definitions for the IVR flow system. There are three main schemas:

1. **IVR Menu** (existing, updated) - Simple menu-based IVR
2. **IVR Flow** (new) - Complex flow-based IVR using automation
3. **Phone Routing** (new) - Routes phone numbers to flows based on business hours

## Schema Hierarchy

```
Phone Number → Phone Routing → IVR Flow → Automation Workflow → IVR Actions
```

## 1. Phone Routing Schema

**DataType:** `phone_routing`
**File:** `crm-phone-routing.ts`
**Purpose:** Maps phone numbers to IVR flows based on business hours

### Key Fields

```typescript
{
  phoneNumber: "+15551234567",           // E.164 format
  normalHoursFlowId: "flow-id",          // Required
  afterHoursFlowId: "flow-id",           // Optional
  holidayFlowId: "flow-id",              // Optional
  businessHours: {
    enabled: true,
    officeHours: [
      {
        dayOfWeek: ["Monday", "Tuesday", ...],
        timezone: "America/New_York",
        startTime: "09:00",
        endTime: "17:00"
      }
    ],
    holidays: [
      {
        date: "2025-12-25",
        name: "Christmas",
        closed: true
      }
    ],
    offDays: [
      {
        date: "2025-12-24",
        description: "Early closure"
      }
    ]
  }
}
```

### Business Hours Logic

1. Check if routing is enabled
2. Check off days (specific closed dates)
3. Check holidays (closed or custom hours)
4. Check office hours (day of week + time range)
5. Route to appropriate flow:
   - **Normal hours** → `normalHoursFlowId`
   - **After hours** → `afterHoursFlowId` (falls back to normal)
   - **Holiday** → `holidayFlowId` (falls back to after hours)

### Usage Stats

```typescript
stats: {
  totalCalls: 0,
  normalHoursCalls: 0,
  afterHoursCalls: 0,
  holidayCalls: 0,
  lastUsed: "2025-11-19T12:00:00Z"
}
```

## 2. IVR Flow Schema

**DataType:** `ivr_flow`
**File:** `crm-ivr-flow.ts`
**Purpose:** Points to automation workflow containing IVR actions

### Key Fields

```typescript
{
  displayName: "Business Hours IVR",
  automationId: "automation-123",        // Required - points to automation workflow
  settings: {
    defaultLanguage: "en-US",
    defaultVoice: "Polly.Joanna",
    recordCalls: true,
    maxInputAttempts: 3,
    inputTimeout: 5
  },
  enabled: true
}
```

### Settings

- **defaultLanguage** - Speech recognition language (en-US, es-ES, etc.)
- **defaultVoice** - Polly voice for text-to-speech
- **recordCalls** - Whether to record all calls in this flow
- **maxInputAttempts** - Max retries for user input
- **inputTimeout** - Seconds to wait for user input

### Usage Stats

```typescript
stats: {
  totalCalls: 0,
  lastUsed: "2025-11-19T12:00:00Z",
  averageDuration: 120,                  // seconds
  completionRate: 0.85                   // 85% completion
}
```

## 3. IVR Menu Schema (Updated)

**DataType:** `ivr_menu`
**File:** `crm-ivr-menu.ts`
**Purpose:** Simple menu-based IVR (original system)

### Key Updates

**Action Types** - Replaced generic actions with specific types:

```typescript
// OLD (confusing)
action: 'transfer' | 'automation' | 'payment'

// NEW (clear)
action:
  | 'transfer-phone'          // Transfer to phone number
  | 'transfer-agent'          // Transfer to agent
  | 'transfer-queue'          // Transfer to queue
  | 'ai-assistant'            // AI assistant
  | 'voicemail'               // Record voicemail
  | 'trigger-automation'      // Trigger automation
  | 'collect-payment'         // Collect payment
  | 'verify-caller'           // Verify caller identity
  | 'play-consent'            // Play consent recording
  | 'custom-webhook'          // Custom webhook
```

**Automation Parameters** - Added for trigger-automation action:

```typescript
automationParams: {
  useCallerPhone: true,              // Pass caller's phone to automation
  collectInput: true,                // Collect additional input first
  inputPrompt: "Enter your order number",
  inputDigits: 6,
  inputName: "orderId",
  staticParams: {                    // Fixed parameters
    source: "ivr",
    priority: "high"
  }
}
```

**Business Hours** - Now uses arrays instead of individual day objects:

```typescript
// OLD
businessHours: {
  monday: { startTime: "09:00", endTime: "17:00" },
  tuesday: { startTime: "09:00", endTime: "17:00" },
  // ... repeat for each day
}

// NEW
businessHours: {
  officeHours: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timezone: "America/New_York",
      startTime: "09:00",
      endTime: "17:00"
    }
  ],
  holidays: [...],
  offDays: [...]
}
```

## Data Flow Examples

### Example 1: Simple Phone Routing

```typescript
// 1. Create IVR Flow
const ivrFlow = {
  displayName: "Main IVR",
  automationId: "auto-123",
  settings: {
    defaultLanguage: "en-US",
    recordCalls: true
  }
};

// 2. Create Phone Routing
const phoneRouting = {
  phoneNumber: "+15551234567",
  normalHoursFlowId: ivrFlow.id,
  businessHours: { enabled: false }  // Always use same flow
};

// 3. When call comes in:
// - Twilio hits /ivr/incoming
// - IVR orchestrator finds phone routing by phone number
// - Routes to normalHoursFlowId (no business hours check)
// - Executes automation workflow
// - Returns TwiML
```

### Example 2: Business Hours Routing

```typescript
// 1. Create flows
const businessHoursFlow = { displayName: "Business Hours", automationId: "auto-123" };
const afterHoursFlow = { displayName: "After Hours", automationId: "auto-456" };
const holidayFlow = { displayName: "Holiday", automationId: "auto-789" };

// 2. Create phone routing with business hours
const phoneRouting = {
  phoneNumber: "+15551234567",
  normalHoursFlowId: businessHoursFlow.id,
  afterHoursFlowId: afterHoursFlow.id,
  holidayFlowId: holidayFlow.id,
  businessHours: {
    enabled: true,
    officeHours: [
      {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timezone: "America/New_York",
        startTime: "09:00",
        endTime: "17:00"
      }
    ],
    holidays: [
      { date: "2025-12-25", name: "Christmas", closed: true }
    ],
    offDays: [
      { date: "2025-12-24", description: "Early closure" }
    ]
  }
};

// 3. When call comes in at 10:00 AM EST on Monday:
// - businessHours.enabled = true
// - Current time within officeHours
// - Routes to businessHoursFlow

// 4. When call comes in at 6:00 PM EST on Monday:
// - businessHours.enabled = true
// - Current time outside officeHours
// - Routes to afterHoursFlow

// 5. When call comes in on Dec 25:
// - businessHours.enabled = true
// - Date matches holiday
// - Routes to holidayFlow
```

### Example 3: IVR Flow with Automation

```typescript
// 1. Create automation workflow
const automation = {
  id: "auto-123",
  name: "Customer Service IVR",
  steps: [
    {
      id: "step-1",
      actionType: "ivr_speak",
      config: {
        message: "Thank you for calling {{company.name}}",
        nextStepId: "step-2"
      }
    },
    {
      id: "step-2",
      actionType: "ivr_menu",
      config: {
        greeting: "For sales, press 1. For support, press 2.",
        options: [
          { digit: "1", label: "Sales" },
          { digit: "2", label: "Support" }
        ],
        saveAs: "menuSelection",
        nextStepId: "step-3"
      }
    },
    {
      id: "step-3",
      actionType: "if_then",  // Existing automation action
      config: {
        condition: "{{menuSelection}} === '1'",
        thenStepId: "step-sales",
        elseStepId: "step-support"
      }
    },
    {
      id: "step-sales",
      actionType: "ivr_transfer",
      config: {
        transferType: "queue",
        queueName: "sales",
        announcement: "Transferring to sales"
      }
    },
    {
      id: "step-support",
      actionType: "ivr_transfer",
      config: {
        transferType: "queue",
        queueName: "support",
        announcement: "Transferring to support"
      }
    }
  ]
};

// 2. Create IVR flow pointing to automation
const ivrFlow = {
  displayName: "Main IVR",
  automationId: automation.id,
  settings: {
    defaultLanguage: "en-US",
    recordCalls: true
  }
};

// 3. Create phone routing
const phoneRouting = {
  phoneNumber: "+15551234567",
  normalHoursFlowId: ivrFlow.id
};
```

## Database Records

### Phone Routing Record

```json
{
  "pk": "org#ORG123",
  "sk": "phone_routing#ROUTE_ID",
  "dataType": "phone_routing",
  "data": {
    "id": "route-id",
    "name": "main_phone_routing",
    "displayName": "Main Phone Routing",
    "phoneNumber": "+15551234567",
    "normalHoursFlowId": "flow-123",
    "afterHoursFlowId": "flow-456",
    "businessHours": { ... },
    "enabled": true,
    "stats": { ... }
  }
}
```

### IVR Flow Record

```json
{
  "pk": "org#ORG123",
  "sk": "ivr_flow#FLOW_ID",
  "dataType": "ivr_flow",
  "data": {
    "id": "flow-id",
    "name": "business_hours_ivr",
    "displayName": "Business Hours IVR",
    "automationId": "auto-123",
    "settings": {
      "defaultLanguage": "en-US",
      "defaultVoice": "Polly.Joanna",
      "recordCalls": true,
      "maxInputAttempts": 3,
      "inputTimeout": 5
    },
    "enabled": true,
    "stats": { ... }
  }
}
```

## Migration from Old IVR Menu

For customers using the old IVR menu system, you can:

1. **Keep using IVR Menu** - Still works for simple cases
2. **Migrate to IVR Flow** - Create automation workflow from menu options

### Migration Example

```typescript
// OLD: IVR Menu
const oldMenu = {
  greeting: "Press 1 for sales, 2 for support",
  options: [
    { digit: "1", label: "Sales", action: "transfer-phone", phoneNumber: "+15559999999" },
    { digit: "2", label: "Support", action: "transfer-agent", agentIdentity: "support-agent" }
  ]
};

// NEW: IVR Flow (automation)
const automation = {
  steps: [
    { actionType: "ivr_speak", config: { message: "Welcome" } },
    {
      actionType: "ivr_menu",
      config: {
        greeting: "Press 1 for sales, 2 for support",
        options: [
          { digit: "1", label: "Sales" },
          { digit: "2", label: "Support" }
        ],
        saveAs: "selection"
      }
    },
    {
      actionType: "if_then",
      config: {
        condition: "{{selection}} === '1'",
        thenStepId: "transfer-sales",
        elseStepId: "transfer-support"
      }
    },
    {
      id: "transfer-sales",
      actionType: "ivr_transfer",
      config: { transferType: "phone", phoneNumber: "+15559999999" }
    },
    {
      id: "transfer-support",
      actionType: "ivr_transfer",
      config: { transferType: "agent", agentIdentity: "support-agent" }
    }
  ]
};
```

## 4. IVR Routing Schema (Simple Menu System)

**DataType:** `ivr_routing`
**File:** `crm-ivr-routing.ts`
**Purpose:** Simple menu-based IVR routing without requiring automation workflows

This is the recommended approach for most customers who need straightforward phone menu systems.

### Key Concepts

**Menu-Based Navigation:**
- Define reusable menus with unique IDs
- Menus reference each other via `actionParams`
- Same digit can do different things at different menu levels
- Entry points defined in `menuAssignments`

### Schema Structure

```typescript
{
  // Multiple phone numbers can use same routing
  phoneNumbers: ["+15551234567", "+15559876543"],

  routingType: "simple_menu",  // or "automation_flow"

  // Define all menus once
  menus: [
    {
      id: "welcome-menu",
      name: "Welcome Menu",
      greeting: "Welcome. Press 1 for English. Para Español, oprima 2.",
      language: "en-US",
      voice: "alice",
      options: [
        { digit: "1", label: "English", action: "menu", actionParams: "main-menu-english" },
        { digit: "2", label: "Spanish", action: "menu", actionParams: "main-menu-spanish" }
      ],
      timeout: 5,
      maxRetries: 3
    },
    {
      id: "main-menu-english",
      name: "Main Menu - English",
      greeting: "Press 1 for Sales, 2 for Support, 3 for Billing",
      language: "en-US",
      voice: "alice",
      options: [
        { digit: "1", label: "Sales", action: "transfer-phone", actionParams: "+15551111111" },
        { digit: "2", label: "Support", action: "menu", actionParams: "support-submenu" },
        { digit: "3", label: "Billing", action: "transfer-queue", actionParams: "billing-queue" }
      ]
    },
    {
      id: "support-submenu",
      name: "Support Submenu",
      greeting: "Press 1 for Technical Support, 2 for Account Help, 9 for Main Menu",
      options: [
        { digit: "1", label: "Technical", action: "transfer-agent", actionParams: "tech-agent-1" },
        { digit: "2", label: "Account", action: "menu", actionParams: "account-help-menu" },
        { digit: "9", label: "Main Menu", action: "menu", actionParams: "main-menu-english" }
      ]
    }
  ],

  // Assign entry point menus for different time periods
  menuAssignments: {
    normalHours: "welcome-menu",      // Entry point during business hours
    afterHours: "after-hours-menu",   // Entry point outside business hours
    holiday: "holiday-menu"           // Entry point on holidays
  },

  // Global settings (can be overridden per menu)
  menuSettings: {
    language: "en-US",
    voice: "alice",
    recordCalls: false,
    voicemailEnabled: true,
    voicemailEmail: "support@company.com"
  },

  // Business hours configuration
  businessHours: {
    enabled: true,
    officeHours: [
      {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timezone: "America/New_York",
        startTime: "09:00",
        endTime: "17:00"
      }
    ],
    holidays: [
      { date: "2025-12-25", name: "Christmas", closed: true }
    ]
  }
}
```

### Menu Action Types

Each menu option has an `action` and `actionParams`:

- **transfer-phone** - `actionParams`: Phone number (E.164 format)
- **transfer-agent** - `actionParams`: Agent ID
- **transfer-queue** - `actionParams`: Queue name
- **menu** - `actionParams`: Menu ID to navigate to
- **voicemail** - `actionParams`: Email address for voicemail
- **trigger-automation** - `actionParams`: Automation workflow ID
- **ai-assistant** - `actionParams`: AI assistant configuration
- **collect-payment** - `actionParams`: Payment connector ID
- **hangup** - `actionParams`: Optional goodbye message

### Multi-Level Menu Navigation Example

```typescript
{
  menus: [
    {
      id: "main-menu",
      greeting: "Press 1 for Sales, 2 for Support, 3 for Billing, 4 for Language",
      options: [
        { digit: "1", label: "Sales", action: "transfer-phone", actionParams: "+15551111111" },
        { digit: "2", label: "Support", action: "menu", actionParams: "support-submenu" },
        { digit: "3", label: "Billing", action: "menu", actionParams: "billing-submenu" },
        { digit: "4", label: "Language", action: "menu", actionParams: "language-menu" }
      ]
    },
    {
      id: "support-submenu",
      greeting: "Press 1 for Technical, 2 for Account Help",
      options: [
        { digit: "1", label: "Technical", action: "transfer-queue", actionParams: "tech-queue" },
        { digit: "2", label: "Account", action: "menu", actionParams: "account-help-menu" }
      ]
    },
    {
      id: "account-help-menu",
      greeting: "Press 1 to reset password, 2 to update billing",
      options: [
        { digit: "1", label: "Reset Password", action: "trigger-automation", actionParams: "auto-reset-pwd" },
        { digit: "2", label: "Update Billing", action: "transfer-agent", actionParams: "billing-agent" }
      ]
    }
  ],
  menuAssignments: {
    normalHours: "main-menu"
  }
}
```

**Call Flow:**
1. Caller dials in → Starts at `"main-menu"` (entry point)
2. Presses `2` → Routes to `"support-submenu"` (actionParams = "support-submenu")
3. Presses `2` again → Routes to `"account-help-menu"` (actionParams = "account-help-menu")
4. Presses `1` → Triggers automation workflow `"auto-reset-pwd"`

**Note:** The same digit (`2`) does different things at each level because each menu's options explicitly define where to go via `actionParams`.

### Multi-Language Support

**Pattern 1: Language Selection Menu**

```typescript
{
  menus: [
    {
      id: "welcome-menu",
      name: "Language Selection",
      greeting: "Welcome. Press 1 for English. Para Español, oprima 2. Pour le français, appuyez sur 3.",
      language: "en-US",
      options: [
        { digit: "1", label: "English", action: "menu", actionParams: "main-menu-en" },
        { digit: "2", label: "Spanish", action: "menu", actionParams: "main-menu-es" },
        { digit: "3", label: "French", action: "menu", actionParams: "main-menu-fr" }
      ]
    },
    {
      id: "main-menu-en",
      name: "Main Menu - English",
      greeting: "Press 1 for Sales, 2 for Support, 3 for Billing",
      language: "en-US",
      voice: "alice",
      options: [
        { digit: "1", label: "Sales", action: "transfer-phone", actionParams: "+15551111111" },
        { digit: "2", label: "Support", action: "menu", actionParams: "support-menu-en" }
      ]
    },
    {
      id: "main-menu-es",
      name: "Main Menu - Spanish",
      greeting: "Presione 1 para Ventas, 2 para Soporte, 3 para Facturación",
      language: "es-ES",
      voice: "man",
      options: [
        { digit: "1", label: "Ventas", action: "transfer-phone", actionParams: "+15551111111" },
        { digit: "2", label: "Soporte", action: "menu", actionParams: "support-menu-es" }
      ]
    }
  ],
  menuAssignments: {
    normalHours: "welcome-menu"  // Entry point is language selection
  }
}
```

**Call Flow:**
1. Call comes in → Starts at `"welcome-menu"` (language selection)
2. Hears: "Welcome. Press 1 for English. Para Español, oprima 2."
3. Caller presses `2` for Spanish
4. Routes to `"main-menu-es"` (Spanish main menu)
5. All subsequent menus are in Spanish language tree
6. Can create complete menu hierarchies for each language

### Business Hours Routing

```typescript
{
  menus: [
    { id: "business-hours-menu", ... },
    { id: "after-hours-menu", greeting: "We're closed. Press 1 for voicemail...", ... },
    { id: "holiday-menu", greeting: "Happy holidays! Press 1 for voicemail...", ... }
  ],
  menuAssignments: {
    normalHours: "business-hours-menu",
    afterHours: "after-hours-menu",
    holiday: "holiday-menu"
  },
  businessHours: {
    enabled: true,
    officeHours: [
      {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timezone: "America/New_York",
        startTime: "09:00",
        endTime: "17:00"
      }
    ],
    holidays: [
      { date: "2025-12-25", name: "Christmas", closed: true }
    ]
  }
}
```

### When to Use Simple Menu vs Automation Flow

**Use Simple Menu (`routingType: "simple_menu"`):**
- Straightforward "press digit for option" flows
- Multi-level menus with submenus
- Multi-language support
- Direct transfers to phones, agents, or queues
- Most common use case (80%+ of customers)

**Use Automation Flow (`routingType: "automation_flow"`):**
- Complex conditional logic beyond simple menus
- Integration with CRM data lookups
- Dynamic routing based on customer data
- Advanced call flows with loops and branches
- AI-powered interactions

## Summary

- **ivr_routing** (NEW) - Simple menu-based routing (recommended for most cases)
- **phone_routing** - Routes phone numbers to flows based on business hours
- **ivr_flow** - Points to automation workflow with IVR actions
- **ivr_menu** - Simple menu system (legacy, still supported)
- **automation** - Workflow containing IVR action steps

The new IVR Routing schema provides the best balance of simplicity and power for most use cases!
