"use client";

import { format } from "date-fns";
import { useMail } from "@/lib/mail";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Archive, ArchiveX, Clock, Forward, Reply, ReplyAll, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function MailDisplay() {
  const { selectedMail, selectMail, deleteMail, moveMail } = useMail();

  if (!selectedMail) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Select an email to view</h3>
          <p className="text-sm text-muted-foreground">
            Choose an email from the list to view its contents
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMail(selectedMail.id);
  };

  const handleArchive = () => {
    moveMail(selectedMail.id, "archive");
    selectMail(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => selectMail(null)}>
            <ArchiveX className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <h2 className="text-lg font-medium line-clamp-1">{selectedMail.subject}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Clock className="h-4 w-4" />
            <span className="sr-only">Snooze</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleArchive}>
            <Archive className="h-4 w-4" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-start gap-4 pb-4">
            <Avatar>
              <AvatarImage alt={selectedMail.from.name} />
              <AvatarFallback>
                {selectedMail.from.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{selectedMail.from.name}</div>
              <div className="line-clamp-1 text-sm text-muted-foreground">
                &lt;{selectedMail.from.email}&gt;
              </div>
              <div className="line-clamp-1 text-sm text-muted-foreground">
                to {selectedMail.to.map((to) => to.name).join(", ")}
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {format(new Date(selectedMail.date), "PPpp")}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>{selectedMail.body}</p>
            </div>
            {selectedMail.attachments && selectedMail.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMail.attachments.map((attachment) => (
                    <div
                      key={attachment.name}
                      className="flex items-center gap-2 rounded-md border p-2"
                    >
                      <div className="text-sm font-medium">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedMail.labels.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMail.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      <Separator />
      <div className="flex items-center p-4">
        <Button className="ml-auto" size="sm">
          <Reply className="mr-2 h-4 w-4" />
          Reply
        </Button>
        <Button variant="ghost" size="sm">
          <ReplyAll className="mr-2 h-4 w-4" />
          Reply All
        </Button>
        <Button variant="ghost" size="sm">
          <Forward className="mr-2 h-4 w-4" />
          Forward
        </Button>
      </div>
    </div>
  );
}