export interface ClientSummary {
  readonly clientId: string;
  readonly name: string;
  readonly segment: string;
  readonly location: string;
  readonly lastVisit: string;
  readonly notes?: string;
}

/**
 * Hard-coded list of representative clients for the MVP.
 * In a future iteration this can be replaced by a directory service.
 */
export const CLIENTS: ClientSummary[] = [
  {
    clientId: "cl-ace-001",
    name: "Acme Capital",
    segment: "Asset Management",
    location: "New York, USA",
    lastVisit: "2025-06-15",
    notes: "Top equities customer",
  },
  {
    clientId: "cl-borealis-002",
    name: "Borealis Bank",
    segment: "Retail Banking",
    location: "Oslo, Norway",
    lastVisit: "2025-07-01",
  },
  {
    clientId: "cl-cascade-003",
    name: "Cascade Insurance",
    segment: "Insurance",
    location: "Seattle, USA",
    lastVisit: "2025-06-20",
    notes: "Interest in structured products",
  },
  {
    clientId: "cl-delta-004",
    name: "Delta Pension Fund",
    segment: "Pension Fund",
    location: "London, UK",
    lastVisit: "2025-07-10",
  },
  {
    clientId: "cl-ember-005",
    name: "Ember Trading",
    segment: "Broker Dealer",
    location: "Hong Kong, China",
    lastVisit: "2025-07-18",
    notes: "Active in APAC derivatives",
  },
  {
    clientId: "cl-frontier-006",
    name: "Frontier Wealth",
    segment: "Private Wealth",
    location: "Zurich, Switzerland",
    lastVisit: "2025-07-12",
  },
  {
    clientId: "cl-horizon-007",
    name: "Horizon Mutual",
    segment: "Mutual Fund",
    location: "Toronto, Canada",
    lastVisit: "2025-06-28",
  },
  {
    clientId: "cl-novar-008",
    name: "Novar Analytics",
    segment: "FinTech",
    location: "Austin, USA",
    lastVisit: "2025-07-05",
    notes: "Pilot for API-driven research",
  },
  {
    clientId: "cl-oceanic-009",
    name: "Oceanic Holdings",
    segment: "Family Office",
    location: "Singapore",
    lastVisit: "2025-06-22",
  },
  {
    clientId: "cl-solstice-010",
    name: "Solstice Partners",
    segment: "Hedge Fund",
    location: "Sydney, Australia",
    lastVisit: "2025-07-08",
    notes: "Focus on macro strategies",
  },
];

export const CLIENT_PICKER_OUTPUT_CHANNEL = "Client Picker";
