export type FieldKind = "text" | "textarea" | "number" | "checkbox" | "email" | "url";

export type ResourceField = {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
};

export type AdminResource = {
  slug: string;
  table: string;
  title: string;
  singular: string;
  description: string;
  eyebrow: string;
  mode: "read" | "update" | "crud";
  columns: { name: string; label: string }[];
  fields: ResourceField[];
  orderBy?: string;
};

export const adminResources: AdminResource[] = [
  {
    slug: "prompt-chains", table: "prompt_chains", title: "Prompt chains", singular: "prompt chain",
    description: "Edit the prompt pipelines used to produce AI media.", eyebrow: "PIPELINE CONTROL", mode: "update",
    columns: [{ name: "name", label: "Chain" }, { name: "description", label: "Description" }, { name: "status", label: "Status" }, { name: "created_at", label: "Created" }],
    fields: [
      { name: "name", label: "Chain name", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea", help: "Explain what this pipeline is designed to generate." },
      { name: "status", label: "Status", kind: "text", required: true, help: "Use active, draft, or archived." },
    ],
  },
  {
    slug: "prompt-chain-steps", table: "prompt_chain_steps", title: "Prompt chain steps", singular: "prompt step",
    description: "Edit the ordered instructions inside every prompt chain.", eyebrow: "PIPELINE CONTROL", mode: "update",
    columns: [{ name: "prompt_chain_id", label: "Chain ID" }, { name: "step_order", label: "Order" }, { name: "name", label: "Step" }, { name: "system_prompt", label: "System prompt" }, { name: "user_prompt_template", label: "User template" }],
    fields: [
      { name: "prompt_chain_id", label: "Prompt chain ID", kind: "number", required: true, help: "The chain this step belongs to." },
      { name: "step_order", label: "Step order", kind: "number", required: true, help: "Steps run from the lowest number to the highest." },
      { name: "name", label: "Step name", kind: "text", required: true },
      { name: "system_prompt", label: "System prompt", kind: "textarea", help: "The instruction sent to the model for this stage." },
      { name: "user_prompt_template", label: "User template", kind: "textarea", help: "Keep placeholders such as {{prompt}} and {{image_analysis}} intact." },
    ],
  },
  {
    slug: "prompt-chain-mix", table: "prompt_chain_mix", title: "Prompt chain mix", singular: "mix allocation",
    description: "Adjust which prompt chains are active and how traffic is allocated.", eyebrow: "READ / UPDATE", mode: "update",
    columns: [{ name: "prompt_chain_id", label: "Chain ID" }, { name: "weight", label: "Weight" }, { name: "enabled", label: "Enabled" }, { name: "updated_at", label: "Updated" }],
    fields: [{ name: "prompt_chain_id", label: "Prompt chain ID", kind: "number", required: true }, { name: "weight", label: "Traffic weight", kind: "number", required: true, help: "Use a value from 0 to 100." }, { name: "enabled", label: "Enabled", kind: "checkbox" }],
  },
  {
    slug: "terms", table: "terms", title: "Terms", singular: "term",
    description: "Manage vocabulary and definitions used by the humor system.", eyebrow: "FULL CONTROL", mode: "crud",
    columns: [{ name: "term", label: "Term" }, { name: "definition", label: "Definition" }, { name: "category", label: "Category" }, { name: "active", label: "Active" }],
    fields: [{ name: "term", label: "Term", kind: "text", required: true }, { name: "definition", label: "Definition", kind: "textarea", required: true }, { name: "category", label: "Category", kind: "text" }, { name: "active", label: "Active", kind: "checkbox" }],
  },
  {
    slug: "generation-requests", table: "generation_requests", title: "Generation requests", singular: "generation request",
    description: "Observe request status, prompts, timing, and ownership.", eyebrow: "READ ONLY", mode: "read",
    columns: [{ name: "status", label: "Status" }, { name: "user_id", label: "User" }, { name: "prompt_chain_id", label: "Chain ID" }, { name: "input_prompt", label: "Input prompt" }, { name: "created_at", label: "Requested" }, { name: "completed_at", label: "Completed" }], fields: [],
  },
  {
    slug: "generation-examples", table: "ai_generation_examples", title: "AI generation examples", singular: "generation example",
    description: "Curate examples used to evaluate and improve AI output.", eyebrow: "FULL CONTROL", mode: "crud",
    columns: [{ name: "title", label: "Title" }, { name: "prompt", label: "Prompt" }, { name: "output_text", label: "Output" }, { name: "image_url", label: "Image URL" }, { name: "created_at", label: "Created" }],
    fields: [{ name: "title", label: "Title", kind: "text", required: true }, { name: "prompt", label: "Prompt", kind: "textarea", required: true }, { name: "output_text", label: "Expected output", kind: "textarea" }, { name: "image_url", label: "Image URL", kind: "url" }, { name: "notes", label: "Notes", kind: "textarea" }],
  },
  {
    slug: "llm-models", table: "llm_models", title: "LLM models", singular: "LLM model",
    description: "Manage models available to generation pipelines.", eyebrow: "FULL CONTROL", mode: "crud",
    columns: [{ name: "name", label: "Model" }, { name: "model_key", label: "Model key" }, { name: "provider_id", label: "Provider ID" }, { name: "context_window", label: "Context" }, { name: "enabled", label: "Enabled" }],
    fields: [{ name: "provider_id", label: "Provider ID", kind: "number", required: true }, { name: "name", label: "Display name", kind: "text", required: true }, { name: "model_key", label: "Model key", kind: "text", required: true }, { name: "context_window", label: "Context window", kind: "number" }, { name: "enabled", label: "Enabled", kind: "checkbox" }],
  },
  {
    slug: "llm-providers", table: "llm_providers", title: "LLM providers", singular: "LLM provider",
    description: "Manage model providers without exposing secret credentials.", eyebrow: "FULL CONTROL", mode: "crud",
    columns: [{ name: "name", label: "Provider" }, { name: "api_base_url", label: "API base URL" }, { name: "enabled", label: "Enabled" }, { name: "created_at", label: "Created" }],
    fields: [{ name: "name", label: "Provider name", kind: "text", required: true }, { name: "api_base_url", label: "API base URL", kind: "url" }, { name: "enabled", label: "Enabled", kind: "checkbox" }],
  },
  {
    slug: "llm-responses", table: "llm_responses", title: "LLM responses", singular: "LLM response",
    description: "Inspect latency, token usage, and output from model calls.", eyebrow: "READ ONLY", mode: "read",
    columns: [{ name: "generation_request_id", label: "Request ID" }, { name: "step_order", label: "Step" }, { name: "step_name", label: "Stage" }, { name: "model_id", label: "Model ID" }, { name: "response_text", label: "Response" }, { name: "latency_ms", label: "Latency ms" }, { name: "input_tokens", label: "Input tokens" }, { name: "output_tokens", label: "Output tokens" }, { name: "created_at", label: "Created" }], fields: [],
  },
  {
    slug: "signup-domains", table: "allowed_signup_domains", title: "Allowed signup domains", singular: "signup domain",
    description: "Control which e-mail domains may create accounts.", eyebrow: "ACCESS CONTROL", mode: "crud",
    columns: [{ name: "domain", label: "Domain" }, { name: "enabled", label: "Enabled" }, { name: "created_at", label: "Created" }],
    fields: [{ name: "domain", label: "Domain", kind: "text", required: true, help: "Example: columbia.edu" }, { name: "enabled", label: "Enabled", kind: "checkbox" }],
  },
  {
    slug: "whitelisted-emails", table: "whitelisted_emails", title: "Whitelisted e-mail addresses", singular: "whitelisted e-mail",
    description: "Manage individual addresses allowed to bypass domain restrictions.", eyebrow: "ACCESS CONTROL", mode: "crud",
    columns: [{ name: "email", label: "E-mail" }, { name: "notes", label: "Notes" }, { name: "enabled", label: "Enabled" }, { name: "created_at", label: "Created" }],
    fields: [{ name: "email", label: "E-mail address", kind: "email", required: true }, { name: "notes", label: "Notes", kind: "textarea" }, { name: "enabled", label: "Enabled", kind: "checkbox" }],
  },
];

export function getAdminResource(slug: string) {
  return adminResources.find(resource => resource.slug === slug);
}
