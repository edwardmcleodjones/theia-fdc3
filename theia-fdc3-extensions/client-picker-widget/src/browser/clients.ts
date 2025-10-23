export interface ClientSummary {
  readonly clientId: string;
  readonly name: string;
  readonly segment: string;
  readonly location: string;
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
    notes: "Top equities customer",
  },
  {
    clientId: "cl-borealis-002",
    name: "Borealis Bank",
    segment: "Retail Banking",
    location: "Oslo, Norway",
  },
  {
    clientId: "cl-cascade-003",
    name: "Cascade Insurance",
    segment: "Insurance",
    location: "Seattle, USA",
    notes: "Interest in structured products",
  },
  {
    clientId: "cl-delta-004",
    name: "Delta Pension Fund",
    segment: "Pension Fund",
    location: "London, UK",
  },
  {
    clientId: "cl-ember-005",
    name: "Ember Trading",
    segment: "Broker Dealer",
    location: "Hong Kong, China",
    notes: "Active in APAC derivatives",
  },
  {
    clientId: "cl-frontier-006",
    name: "Frontier Wealth",
    segment: "Private Wealth",
    location: "Zurich, Switzerland",
  },
  {
    clientId: "cl-horizon-007",
    name: "Horizon Mutual",
    segment: "Mutual Fund",
    location: "Toronto, Canada",
  },
  {
    clientId: "cl-novar-008",
    name: "Novar Analytics",
    segment: "FinTech",
    location: "Austin, USA",
    notes: "Pilot for API-driven research",
  },
  {
    clientId: "cl-oceanic-009",
    name: "Oceanic Holdings",
    segment: "Family Office",
    location: "Singapore",
  },
  {
    clientId: "cl-solstice-010",
    name: "Solstice Partners",
    segment: "Hedge Fund",
    location: "Sydney, Australia",
    notes: "Focus on macro strategies",
  },
];

export const CLIENT_PICKER_OUTPUT_CHANNEL = "Client Picker";
