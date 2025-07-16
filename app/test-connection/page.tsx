import { ConnectionTest } from "@/components/connection-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TestConnectionPage() {
  return (
    <div className="min-h-screen bg-arkus-gray flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-arkus-navy mb-2">TalentArk Database Connection</h1>
          <p className="text-gray-600">Verify your Supabase connection before proceeding</p>
        </div>

        <ConnectionTest />

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-arkus-navy mb-4">Setup Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              Create tables by running the SQL in <code className="bg-gray-100 px-1 rounded">supabase-tables.sql</code>
            </li>
            <li>
              Insert sample data by running <code className="bg-gray-100 px-1 rounded">supabase-seed-data.sql</code>
            </li>
            <li>
              Add your environment variables to <code className="bg-gray-100 px-1 rounded">.env.local</code>
            </li>
            <li>
              Install Supabase client:{" "}
              <code className="bg-gray-100 px-1 rounded">npm install @supabase/supabase-js</code>
            </li>
          </ol>
        </div>
        <div className="pt-4 border-t border-gray-200 bg-white rounded-lg p-6 border border-gray-200">
          <Link href="/config-supabase">
            <Button
              variant="outline"
              className="w-full border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
            >
              Configure Supabase Credentials
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
