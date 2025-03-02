"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useMail } from "@/lib/mail";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function MailList() {
  const { mails, selectedFolder, selectedMail, selectMail, markAsRead } = useMail();

  const filteredMails = useMemo(() => {
    return mails
      .filter((mail) => mail.folder === selectedFolder)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [mails, selectedFolder]);

  const handleSelectMail = (mailId: string) => {
    selectMail(mailId);
    markAsRead(mailId);
  };

  if (filteredMails.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No emails found in this folder.
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen border-r">
      <div className="flex flex-col">
        {filteredMails.map((mail) => (
          <div key={mail.id}>
            <button
              className={cn(
                "flex flex-col items-start gap-2 border-b p-4 text-left transition-colors hover:bg-muted/50",
                selectedMail?.id === mail.id && "bg-muted",
                !mail.read && "bg-muted/50"
              )}
              onClick={() => handleSelectMail(mail.id)}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{mail.from.name}</div>
                  {!mail.read && (
                    <Badge variant="secondary" className="ml-auto">
                      New
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(mail.date), "MMM dd")}
                </div>
              </div>
              <div className="text-sm font-medium">{mail.subject}</div>
              <div className="line-clamp-1 text-xs text-muted-foreground">
                {mail.body.substring(0, 100)}...
              </div>
              {mail.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {mail.labels.map((label) => (
                    <Badge key={label} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </button>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}