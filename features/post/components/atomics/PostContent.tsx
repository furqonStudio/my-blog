type Props = {
  htmlContent: string
}

export const PostContent = ({ htmlContent }: Props) => {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
