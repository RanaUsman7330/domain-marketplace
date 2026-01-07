// Update the folder structure:
// Rename /app/admin/domains/[id]/ to /app/admin/domains/[name]/
// Update the page component to handle name parameter:

// In /app/admin/domains/[name]/page.tsx
export default function AdminDomainDetailPage({ params }: { params: { name: string } }) {
  // Use params.name instead of params.id
  const domainName = decodeURIComponent(params.name)
  // Rest of the code remains same but fetch by name instead of ID
}