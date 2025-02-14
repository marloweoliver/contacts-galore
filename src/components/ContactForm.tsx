'use client'

import React from 'react';
import { useContactStore } from '../lib/store';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Plus, Search, ArrowLeft, Trash2, Download } from 'lucide-react';

interface ContactFormProps {
    open: boolean;
    onClose: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ open, onClose }) => {
    const [name, setName] = React.useState('');
    const { addContact } = useContactStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addContact({
            name,
            fields: [],
        });
        setName('');
        onClose();
    };

    return (
        <div className=''>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className='bg-zinc-950 border-zinc-800'>
                    <DialogHeader>
                        <DialogTitle>Add New Contact</DialogTitle>
                        <DialogDescription>Add a new identity to store details about this individual.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className='flex flex-row justify-between gap-2'>
                            <Input
                                placeholder="Contact Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className='bg-zinc-800/50 border-zinc-700/50 text-zinc-100 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200'
                            />
                            <Button type="submit" size="icon" className='h-11' variant="ghost">
                                <Plus className='text-white h-8 w-8'/>
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
