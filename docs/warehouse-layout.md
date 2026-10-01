# Warehouse Hub Layout

## Hub Operational Layout

The following layout represents a simulated logistics hub designed for inbound, sorting, cross-docking and outbound operations.

```text
┌──────────────────────────────────────────────┐
│                  INBOUND                     │
│        Receiving → Scanning → QC             │
├──────────────────────────────────────────────┤
│                                              │
│                 SORTING AREA                 │
│                                              │
│   HCM   │   BD   │   LA   │   TN   │   DN   │
│                                              │
├──────────────────────┬───────────────────────┤
│   EXCEPTION AREA     │    CROSS-DOCKING      │
│ Damage / Wrong Sort  │ Consolidation         │
├──────────────────────┴───────────────────────┤
│                  OUTBOUND                    │
│        Staging → Loading → Dispatch          │
└──────────────────────────────────────────────┘
