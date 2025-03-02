"use client";

import { useEffect } from "react";
import { useMail } from "@/lib/mail";
import { MailLayout } from "@/components/mail/mail-layout";
import { MailList } from "@/components/mail/mail-list";
import { MailDisplay } from "@/components/mail/mail-display";
import { MailSidebar } from "@/components/mail/mail-sidebar";
import { useToast } from "@/hooks/use-toast";

export default function MailPage() {
  const { selectFolder, fetchMails, isLoading, error } = useMail();
  const { toast } = useToast();

  useEffect(() => {
    // Set default folder on component mount
    selectFolder("inbox");
    
    // Fetch mails from the API
    fetchMails().catch((err) => {
      console.error("Failed to fetch mails:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load emails. Please try again.",
      });
    });
  }, [selectFolder, fetchMails, toast]);

  return (
    <MailLayout>
      <MailSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse">Loading emails...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-destructive">{error}</div>
          </div>
        ) : (
          <>
            <MailList />
            <MailDisplay />
          </>
        )}
      </div>
    </MailLayout>
  );
}