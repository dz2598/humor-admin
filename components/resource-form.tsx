import Link from "next/link";
import type { AdminResource } from "@/lib/admin-resources";

type Row = Record<string, unknown>;

export function ResourceForm({ resource, action, row, submitLabel }: { resource: AdminResource; action: (data: FormData) => void | Promise<void>; row?: Row; submitLabel: string }) {
  return <form action={action} className="editor-form">
    {resource.fields.map(field => field.kind === "checkbox" ?
      <label className="checkbox-field" key={field.name}><input name={field.name} type="checkbox" defaultChecked={Boolean(row?.[field.name])} /><span>{field.label}</span></label>
      : <label key={field.name}>{field.label}{field.help && <span>{field.help}</span>}{field.kind === "textarea" ?
        <textarea name={field.name} rows={5} required={field.required} defaultValue={String(row?.[field.name] ?? "")} /> :
        <input name={field.name} type={field.kind} required={field.required} defaultValue={String(row?.[field.name] ?? "")} />}</label>)}
    <div className="form-actions"><button className="primary-button" type="submit">{submitLabel}</button><Link className="secondary-button" href={`/observability/${resource.slug}`}>Cancel</Link></div>
  </form>;
}
