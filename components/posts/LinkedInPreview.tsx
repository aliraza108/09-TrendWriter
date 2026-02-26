import { MessageCircle, Repeat2, Send, ThumbsUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'

type LinkedInPreviewProps = {
  author?: string
  content: string
  time?: string
}

export function LinkedInPreview({ author = 'You', content, time = 'Now' }: LinkedInPreviewProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-lightBlue" />
        <div>
          <p className="text-sm font-semibold text-textDark">{author}</p>
          <p className="text-xs text-textGray">{time}</p>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm text-textDark">{content}</p>
      <div className="mt-4 flex items-center justify-around border-t pt-3 text-textGray">
        <span className="flex items-center gap-1 text-sm"><ThumbsUp size={16} /> Like</span>
        <span className="flex items-center gap-1 text-sm"><MessageCircle size={16} /> Comment</span>
        <span className="flex items-center gap-1 text-sm"><Repeat2 size={16} /> Repost</span>
        <span className="flex items-center gap-1 text-sm"><Send size={16} /> Share</span>
      </div>
    </Card>
  )
}