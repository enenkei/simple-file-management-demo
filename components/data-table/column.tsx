"use client"

import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import Link from "next/link"
import FileCardMenu from "../file-card-menu"
import { fileTypeIcons } from "../file-card"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
    id: string
    name: string
    type: string
    email: string
    downloadUrl : string
    createdAt : Date
}

export const columns: ColumnDef<File>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        header: "Name",
        cell : ({row}) => {
            return (
                <div className='flex justify-start font-semibold text-zinc-800'>{row.original.name}</div>
            )
        }
    },
    {
        header: "File Type",
        cell : ({row}) => {
            return (
                <div className='flex justify-center'>{fileTypeIcons[row.original.type!]}</div>
            )
        }
    },
    {
        header: "Download URL",
        cell : ({row}) => {
            return (
                <Link href={row.original.downloadUrl} target="_blank" className="text-blue-800 underline">Download</Link>
            )
        }
    },
    {
        header: "Created At",
        cell : ({row}) => {
            return (
                <div className="text-muted-foreground font-semibold">{moment(row.original.createdAt).format('MM-DD-yy HH:mm')}</div>
            )
        }
    }
]