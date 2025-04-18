"use client";

import React from "react";
import { TableRow, TableCell } from "@heroui/table";
import { Column } from "@/components/globals/types";
import { Videos as Record, VideosRow as Row } from "./Types";
import DestroyModal from "@/components/globals/DestroyModal";
import {
  destroy,
} from "@/components/admin/videos/Action";
import UpdateModal from "./UpdateModal";
import VideoPlayer from "./VideoPlayer";

const getRecord = (records: Record[], id: string): Record | undefined => {
  return records.find((record) => String(record.id) === id);
};

const RenderCell = (
  record: Record | undefined,
  column: string,
  row: Row,
) => {
  if (!record) return null;

  switch (column) {
    case "videoPath":
      return record.videoPath ? (
        <VideoPlayer videoPath={record.videoPath} poster="/images/logowithbg.png" />
      ) : (
        "No Video"
      );
    case "actions":
      return (
        <div className="relative items-center space-x-4">
          <UpdateModal record={record} />
          <DestroyModal title="Videos" action={destroy} id={String(record.id)} />
        </div>
      );

    default:
      return row[column as keyof Row] ?? "";
  }
};

const RenderBody = (
  records: Record[],
  columns: Column[],
  rows: Row[],
) => {
  return (
    <>
      {rows.map((row) => {
        const record = getRecord(records, row.id);
        return (
          <TableRow key={row.id} className="items-center">
            {columns.map((column) => (
              <TableCell key={column.key}>
                {RenderCell(record, column.key, row)}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  );
};

export default RenderBody;
