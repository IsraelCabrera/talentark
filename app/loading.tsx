export default function Loading() {
  return (
    <div className="min-h-screen bg-arkus-gray flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arkus-red mx-auto mb-4"></div>
        <p className="text-arkus-navy">Loading TalentArk...</p>
      </div>
    </div>
  )
}
