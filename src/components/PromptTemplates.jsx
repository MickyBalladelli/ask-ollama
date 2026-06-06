const templates = [
  {
    name: 'Explain image',
    prompt: 'Explain this image. Mention important objects, text, layout, and likely meaning.'
  },
  {
    name: 'Summarize PDF',
    prompt: 'Summarize this document. Include key points, decisions, dates, names, and numbers.'
  },
  {
    name: 'Code review',
    prompt: 'Review this code. Lead with bugs and risks, then suggest small fixes.'
  },
  {
    name: 'Extract tasks',
    prompt: 'Extract action items, owners, deadlines, and open questions.'
  }
]

export default function PromptTemplates({ onApply }) {
  return (
    <select
      aria-label="Prompt templates"
      defaultValue=""
      onChange={event => {
        if (event.target.value) {
          onApply(event.target.value)
          event.target.value = ''
        }
      }}
    >
      <option value="">Template</option>
      {templates.map(template => (
        <option key={template.name} value={template.prompt}>
          {template.name}
        </option>
      ))}
    </select>
  )
}
