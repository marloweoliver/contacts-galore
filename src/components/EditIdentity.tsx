'use client'

import React from 'react';
import { useContactStore } from '../lib/store';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Plus, Search, ArrowLeft, Trash2, Download, Save } from 'lucide-react';

interface ContactFormProps {
    open: boolean;
    onClose: () => void;
    selectedContactId: string;
}

export const EditIdentity: React.FC<ContactFormProps> = ({ open, onClose, selectedContactId }) => {
    const [who, setWhoState] = React.useState('');
    const { setWho } = useContactStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setWho(selectedContactId, who);
        setWhoState('');
        onClose();
    };

    return (
        <div className=''>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className='bg-zinc-950 border-zinc-800'>
                    <DialogHeader>
                        <DialogTitle>Edit Identity</DialogTitle>
                        <DialogDescription>Edit this person's relation to you.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className='flex flex-col justify-between gap-2'>
                            <Input
                                placeholder="Contact Name"
                                value={who}
                                onChange={(e) => setWhoState(e.target.value)}
                                required
                                className='bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200'
                            />
                            <div className="flex justify-end gap-3 pt-5">
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl px-4 h-11"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl px-4 h-11 transition-all duration-200"
                                    type="submit"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
