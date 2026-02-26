"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type PostDrawerProps = {
  open: boolean
  onClose: () => void
  post?: { title: string; content: string; status: string }
}

export function PostDrawer({ open, onClose, post }: PostDrawerProps) {
  if (!open) return null

  return (
    <>
      <button className="fixed inset-0 z-30 bg-black/20" onClick={onClose} aria-label="Close drawer" />
      <motion.div
        initial={{ x: 380 }}
        animate={{ x: 0 }}
        exit={{ x: 380 }}
        className="fixed right-0 top-0 z-40 h-full w-full max-w-sm border-l border-slate-200 bg-white p-5"
      >
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-textGray">{post?.status || 'Scheduled'}</p>
          <h3 className="mt-1 text-lg font-semibold text-textDark">{post?.title || 'Post details'}</h3>
          <p className="mt-3 text-sm text-textGray">{post?.content || 'Preview unavailable.'}</p>
          <div className="mt-5 flex gap-2">
            <Button className="flex-1">Edit</Button>
            <Button className="flex-1" variant="secondary">Reschedule</Button>
          </div>
          <Button variant="ghost" className="mt-2 w-full text-error">Delete</Button>
        </Card>
      </motion.div>
    </>
  )
}