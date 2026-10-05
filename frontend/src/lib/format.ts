const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

const qualityLabels: Record<string, string> = {
  '360p': 'SD',
  '480p': 'SD',
  sd: 'SD',
  '720p': 'HD',
  hd: 'HD',
  '1080p': 'Full HD',
  fhd: 'Full HD',
  '2160p': '4K',
  '4k': '4K',
}

export function formatDate(iso: string | null): string {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return dateFormatter.format(date)
}

export function qualityLabel(q: string): string {
  const key = q.trim().toLowerCase()
  if (!key) return '-'
  return qualityLabels[key] ?? q.trim().toUpperCase()
}
