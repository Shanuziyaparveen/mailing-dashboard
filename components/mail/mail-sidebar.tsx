"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMail, folders, labels } from "@/lib/mail";
import { DivideIcon as LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function MailSidebar() {
  const { mails, selectedFolder, selectFolder } = useMail();

  const folderCounts = useMemo(() => {
    return folders.reduce((counts, folder) => {
      counts[folder.id] = mails.filter(mail => mail.folder === folder.id).length;
      return counts;
    }, {} as Record<string, number>);
  }, [mails]);

  const getIcon = (iconName: string): LucideIcon => {
    return (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || LucideIcons.Mail;
  };

  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-background">
      <div className="p-4">
        <Button className="w-full justify-start gap-2">
          <LucideIcons.PenSquare className="h-4 w-4" />
          Compose
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <h3 className="px-4 text-sm font-medium text-muted-foreground">Folders</h3>
          <div className="mt-2 space-y-1">
            {folders.map((folder) => {
              const Icon = getIcon(folder.icon);
              return (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    selectedFolder === folder.id && "bg-secondary"
                  )}
                  onClick={() => selectFolder(folder.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 truncate">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {folderCounts[folder.id] || 0}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="px-2 py-2">
          <h3 className="px-4 text-sm font-medium text-muted-foreground">Labels</h3>
          <div className="mt-2 space-y-1">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center px-4 py-2 text-sm"
              >
                <span
                  className={cn("mr-2 h-2 w-2 rounded-full", label.color)}
                ></span>
                <span className="flex-1 truncate">{label.name}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}