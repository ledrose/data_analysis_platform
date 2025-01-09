'use client'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { title } from "process"


interface DeleteDialogProps {
    title: string,
    text: string,
    children?: React.ReactNode,
    onDeleteRelation: () => void,
    useOpenHook?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}
  


export function DeleteDialog({ text, children, onDeleteRelation, useOpenHook=useState(false)}: DeleteDialogProps) {
    return (
      <Dialog open={useOpenHook[0]} onOpenChange={useOpenHook[1]}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
                {text}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="destructive" onClick={onDeleteRelation}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }