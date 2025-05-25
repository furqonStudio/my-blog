import { SiteHeader } from '@/components/site-header'
import PostDataTable from '@/features/post/components/PostDataTable'

const Posts = () => {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PostDataTable />
          </div>
        </div>
      </div>
    </>
  )
}

export default Posts
