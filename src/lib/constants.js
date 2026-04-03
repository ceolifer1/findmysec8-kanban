export const LABELS = {
  tenant: { name: "Tenant", color: "#f59e0b" },
  agent: { name: "Agent/Broker", color: "#8b5cf6" },
  platform: { name: "Platform", color: "#06b6d4" },
  infra: { name: "Infrastructure", color: "#ef4444" },
  design: { name: "Design", color: "#ec4899" },
  seo: { name: "SEO/Marketing", color: "#22c55e" },
  content: { name: "Content", color: "#f97316" },
  social: { name: "Social Media", color: "#3b82f6" },
  branding: { name: "Branding", color: "#a855f7" },
  analytics: { name: "Analytics", color: "#14b8a6" },
};

export const PRIORITY = {
  high: { emoji: "🔴", label: "High" },
  medium: { emoji: "🟡", label: "Medium" },
  low: { emoji: "🟢", label: "Low" },
};

export const DEFAULT_COLUMNS = {
  development: [
    { name: "Backlog", emoji: "📋", position: 0 },
    { name: "Design", emoji: "🎨", position: 1 },
    { name: "Development", emoji: "⚙️", position: 2 },
    { name: "Testing", emoji: "🧪", position: 3 },
    { name: "Deployed", emoji: "🚀", position: 4 },
  ],
  marketing: [
    { name: "Ideas", emoji: "💡", position: 0 },
    { name: "Planning", emoji: "📝", position: 1 },
    { name: "In Progress", emoji: "🔄", position: 2 },
    { name: "Review", emoji: "👀", position: 3 },
    { name: "Published", emoji: "✅", position: 4 },
  ],
  general: [
    { name: "To Do", emoji: "📋", position: 0 },
    { name: "In Progress", emoji: "🔄", position: 1 },
    { name: "Review", emoji: "👀", position: 2 },
    { name: "Done", emoji: "✅", position: 3 },
  ],
};

export const AVATAR_COLORS = [
  "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444", "#ec4899",
  "#22c55e", "#f97316", "#3b82f6", "#a855f7", "#14b8a6",
];
