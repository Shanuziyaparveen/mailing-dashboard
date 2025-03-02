import { create } from 'zustand';
import { mailApi } from './api';

export type Mail = {
  id: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  date: string;
  body: string;
  read: boolean;
  labels: string[];
  folder: string;
  attachments?: {
    name: string;
    size: number;
    type: string;
  }[];
};

export type MailFolder = {
  id: string;
  name: string;
  icon: string;
  count?: number;
};

export const folders: MailFolder[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    icon: 'inbox',
  },
  {
    id: 'drafts',
    name: 'Drafts',
    icon: 'file',
  },
  {
    id: 'sent',
    name: 'Sent',
    icon: 'send',
  },
  {
    id: 'junk',
    name: 'Junk',
    icon: 'trash',
  },
  {
    id: 'trash',
    name: 'Trash',
    icon: 'trash-2',
  },
  {
    id: 'archive',
    name: 'Archive',
    icon: 'archive',
  },
];

export const labels = [
  {
    id: 'work',
    name: 'Work',
    color: 'bg-blue-500',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: 'bg-green-500',
  },
  {
    id: 'important',
    name: 'Important',
    color: 'bg-red-500',
  },
  {
    id: 'social',
    name: 'Social',
    color: 'bg-yellow-500',
  },
];

type MailState = {
  mails: Mail[];
  selectedMail: Mail | null;
  selectedFolder: string;
  isLoading: boolean;
  error: string | null;
  fetchMails: () => Promise<void>;
  selectMail: (mailId: string | null) => void;
  selectFolder: (folderId: string) => void;
  markAsRead: (mailId: string) => Promise<void>;
  deleteMail: (mailId: string) => Promise<void>;
  moveMail: (mailId: string, targetFolder: string) => Promise<void>;
};

export const useMail = create<MailState>((set, get) => ({
  mails: [],
  selectedMail: null,
  selectedFolder: 'inbox',
  isLoading: false,
  error: null,
  
  fetchMails: async () => {
    try {
      set({ isLoading: true, error: null });
      const mails = await mailApi.getAllMails();
      set({ mails, isLoading: false });
    } catch (error) {
      console.error('Error fetching mails:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch emails. Please try again.' 
      });
    }
  },
  
  selectMail: (mailId) => {
    if (!mailId) {
      set({ selectedMail: null });
      return;
    }
    
    const mail = get().mails.find((mail) => mail.id === mailId);
    set({ selectedMail: mail || null });
    
    // If mail exists and is not read, mark it as read
    if (mail && !mail.read) {
      get().markAsRead(mailId);
    }
  },
  
  selectFolder: (folderId) => {
    set({
      selectedFolder: folderId,
      selectedMail: null,
    });
  },
  
  markAsRead: async (mailId) => {
    try {
      await mailApi.markAsRead(mailId);
      
      set((state) => ({
        mails: state.mails.map((mail) =>
          mail.id === mailId ? { ...mail, read: true } : mail
        ),
      }));
    } catch (error) {
      console.error('Error marking mail as read:', error);
    }
  },
  
  deleteMail: async (mailId) => {
    try {
      await mailApi.deleteMail(mailId);
      
      set((state) => ({
        mails: state.mails.map((mail) =>
          mail.id === mailId ? { ...mail, folder: 'trash' } : mail
        ),
        selectedMail: null,
      }));
    } catch (error) {
      console.error('Error deleting mail:', error);
    }
  },
  
  moveMail: async (mailId, targetFolder) => {
    try {
      await mailApi.moveMail(mailId, targetFolder);
      
      set((state) => ({
        mails: state.mails.map((mail) =>
          mail.id === mailId ? { ...mail, folder: targetFolder } : mail
        ),
      }));
    } catch (error) {
      console.error('Error moving mail:', error);
    }
  },
}));