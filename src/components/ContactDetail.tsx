'use'
import React, { useState } from 'react';
import { useContactStore } from '../lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowLeft, Trash2, Download } from 'lucide-react';
import { FieldEditor } from './FieldEditor';
import { motion } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { jsPDF } from 'jspdf'; // For PDF export
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { SelectGroup } from '@radix-ui/react-select';

export const ContactDetail: React.FC = () => {
    const { contacts, selectedContactId, fieldSearchQuery, setFieldSearchQuery, addField, setSelectedContact, deleteContact } = useContactStore();
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'markdown'>('pdf');

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    if (!selectedContact) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-400">
                Select a contact to view details
            </div>
        );
    }

    const filteredFields = selectedContact.fields
        .filter(field =>
            field.label.toLowerCase().includes(fieldSearchQuery.toLowerCase()) ||
            field.value.toLowerCase().includes(fieldSearchQuery.toLowerCase())
        )
        .sort((a, b) => {
            return sortDirection === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
        });

    const handleExport = () => {
        if (exportFormat === 'markdown') {
            const markdownContent = `# ${selectedContact.name}\n\n` +
                selectedContact.fields.map(field => `**${field.label}:** ${field.value}\n`).join('\n');
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedContact.name}.md`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(selectedContact.name, 20, 20);
            doc.setFontSize(12);
            let y = 30;
            selectedContact.fields.forEach(field => {
                doc.text(`${field.label}: ${field.value}`, 20, y);
                y += 10;
            });
            doc.save(`${selectedContact.name}.pdf`);
        }
        setShowExportDialog(false);
        toast({
            description: "Download has been initiated.",
        });
    };

    return (
        <motion.div
            className="fixed inset-0 bg-zinc-950 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Card className="flex-1 border-0 rounded-none bg-zinc-950">
                <CardHeader className="flex flex-row sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 items-center justify-between border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedContact(null)}
                            className="rounded-full hover:bg-zinc-900 text-zinc-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <p className="text-zinc-200 font-medium">{selectedContact.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full hover:bg-zinc-900 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-zinc-200">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-zinc-400">
                                        This action cannot be undone. This will permanently delete this contact and remove any data locally.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                                        Nevermind
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => deleteContact(selectedContactId)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete it! 🗑️
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full hover:bg-zinc-900 text-zinc-400"
                            onClick={() => setShowExportDialog(true)}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="w-full p-4">
                    <div className="relative flex mb-4 items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search fields..."
                                value={fieldSearchQuery}
                                onChange={(e) => setFieldSearchQuery(e.target.value)}
                                className="pl-9 bg-zinc-900 border-none text-zinc-300 placeholder:text-zinc-500 rounded-xl"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            className="rounded-xl bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            onClick={() => addField(selectedContact.id, { label: 'New Field', value: '' })}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {filteredFields.map((field) => (
                            <FieldEditor
                                key={field.id}
                                contactId={selectedContact.id}
                                field={field}
                                selectedFieldId={selectedFieldId}
                                setSelectedFieldId={setSelectedFieldId}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-zinc-200">Select Export Format</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Please choose the file type you want to export the contact as:
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="px-4 flex items-center gap-2">
                        <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'pdf' | 'markdown')}>
                            <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                                <SelectValue placeholder="Select a filetype" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectGroup>
                                    <SelectLabel className="text-zinc-400">File Types</SelectLabel>
                                    <SelectItem value="pdf" className="text-zinc-300">PDF</SelectItem>
                                    <SelectItem value="markdown" className="text-zinc-300">Markdown</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleExport}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Export
                        </Button>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};