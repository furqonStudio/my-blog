import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import PostDataTable from '@/features/post/components/PostDataTable'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const Posts = () => {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
              <div className="">
                <Button asChild>
                  <Link
                    href="/admin/posts/add"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Link>
                </Button>
              </div>
              <PostDataTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Posts
