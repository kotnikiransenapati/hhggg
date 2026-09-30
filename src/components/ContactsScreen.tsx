import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  GoogleContactPerson,
  NewContactInput,
  PRESET_FARM_CONTACTS,
  fetchGoogleContacts,
  createGoogleContact,
  deleteGoogleContact,
} from '../services/googleContactsService.ts';
import { GoogleContactsConfirmModal } from './GoogleContactsConfirmModal.tsx';

export const ContactsScreen: React.FC = () => {
  const { user, googleAccessToken, signInWithGoogle, isLoading: authLoading } = useAuth();

  const [googleContacts, setGoogleContacts] = useState<GoogleContactPerson[]>([]);
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false);
  const [contactsError, setContactsError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add Contact Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newContact, setNewContact] = useState<NewContactInput>({
    givenName: '',
    familyName: '',
    email: '',
    phoneNumber: '',
    organization: '',
    jobTitle: '',
    category: 'Farmer',
  });

  // User Confirmation Modal for Destructive/Mutating Operations
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    actionType: 'create' | 'delete';
    title: string;
    description: string;
    itemName: string;
    payload?: any;
  }>({
    isOpen: false,
    actionType: 'create',
    title: '',
    description: '',
    itemName: '',
  });

  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load Google Contacts whenever googleAccessToken changes or is available
  useEffect(() => {
    if (googleAccessToken) {
      loadGoogleContacts(googleAccessToken);
    }
  }, [googleAccessToken]);

  const loadGoogleContacts = async (token: string) => {
    setLoadingContacts(true);
    setContactsError(null);
    try {
      const contacts = await fetchGoogleContacts(token);
      setGoogleContacts(contacts);
    } catch (err: any) {
      console.error('Error fetching Google Contacts:', err);
      setContactsError(err.message || 'Failed to fetch contacts from Google People API');
    } finally {
      setLoadingContacts(false);
    }
  };

  // Trigger confirmation modal for adding a preset farm partner to Google Contacts
  const handleRequestAddPreset = (preset: GoogleContactPerson) => {
    if (!googleAccessToken) {
      setStatusMessage('Please sign in with Google to sync contacts to your account.');
      return;
    }

    setConfirmModalState({
      isOpen: true,
      actionType: 'create',
      title: 'Add Farm Contact to Google Contacts',
      description: `You are about to add ${preset.name} (${preset.organization || 'Farmer Collective'}) with phone ${preset.phone || 'N/A'} into your connected Google Contacts directory.`,
      itemName: preset.name,
      payload: {
        givenName: preset.name,
        email: preset.email,
        phoneNumber: preset.phone,
        organization: preset.organization,
        jobTitle: preset.jobTitle,
        category: preset.category,
      },
    });
  };

  // Trigger confirmation modal for creating a new custom contact
  const handleRequestCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.givenName.trim()) return;

    if (!googleAccessToken) {
      setStatusMessage('Please sign in with Google first.');
      return;
    }

    setConfirmModalState({
      isOpen: true,
      actionType: 'create',
      title: 'Create Contact in Google Contacts',
      description: `You are creating a new contact for ${newContact.givenName} ${newContact.familyName || ''} in your Google Workspace account.`,
      itemName: `${newContact.givenName} ${newContact.familyName || ''}`.trim(),
      payload: { ...newContact },
    });
    setIsAddModalOpen(false);
  };

  // Trigger confirmation modal for deleting a contact
  const handleRequestDelete = (contact: GoogleContactPerson) => {
    if (!contact.resourceName) return;

    setConfirmModalState({
      isOpen: true,
      actionType: 'delete',
      title: 'Delete Google Contact',
      description: `Are you sure you want to permanently delete "${contact.name}" from your Google Contacts address book? This action cannot be reversed.`,
      itemName: contact.name,
      payload: { resourceName: contact.resourceName },
    });
  };

  // Execute the confirmed operation with Google People API
  const handleExecuteConfirmedAction = async () => {
    if (!googleAccessToken) return;

    setIsProcessingAction(true);
    setStatusMessage(null);

    try {
      if (confirmModalState.actionType === 'create') {
        const payload: NewContactInput = confirmModalState.payload;
        const created = await createGoogleContact(googleAccessToken, payload);
        setGoogleContacts((prev) => [created, ...prev]);
        setStatusMessage(`Successfully added "${created.name}" to your Google Contacts!`);
        // Reset form
        setNewContact({
          givenName: '',
          familyName: '',
          email: '',
          phoneNumber: '',
          organization: '',
          jobTitle: '',
          category: 'Farmer',
        });
      } else if (confirmModalState.actionType === 'delete') {
        const { resourceName } = confirmModalState.payload;
        await deleteGoogleContact(googleAccessToken, resourceName);
        setGoogleContacts((prev) => prev.filter((c) => c.resourceName !== resourceName));
        setStatusMessage(`Contact "${confirmModalState.itemName}" was deleted from Google Contacts.`);
      }
      setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error('Error executing Google Contacts mutation:', err);
      setStatusMessage(`Error: ${err.message || 'Operation failed'}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Combined contacts (Google Contacts + Verified FarmDirect Directory)
  const combinedContacts: (GoogleContactPerson & { source: 'google' | 'verified_collective' })[] = [
    ...googleContacts.map((c) => ({ ...c, source: 'google' as const })),
    ...PRESET_FARM_CONTACTS.map((c) => ({ ...c, source: 'verified_collective' as const })),
  ];

  // Filtering
  const filteredContacts = combinedContacts.filter((c) => {
    const matchesCategory =
      filterCategory === 'All' ||
      (filterCategory === 'Google Contacts' && c.source === 'google') ||
      (filterCategory === 'Verified Collectives' && c.source === 'verified_collective') ||
      c.category === filterCategory;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      (c.organization && c.organization.toLowerCase().includes(term)) ||
      (c.jobTitle && c.jobTitle.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">contacts</span>
              Google Workspace Contacts Integration
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
              People API (v1)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Directory &amp; Contacts
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            View, organize, and sync your network of certified organic farmers, refrigerated fleet drivers, APMC Mandi coordinators, and direct buyers with your Google Contacts address book.
          </p>
        </div>

        {/* Auth / Action Button */}
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              onClick={() => signInWithGoogle()}
              disabled={authLoading}
              className="gsi-material-button px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <div className="w-4 h-4">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span>Sign in with Google to Sync Contacts</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => googleAccessToken && loadGoogleContacts(googleAccessToken)}
                disabled={loadingContacts}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Reload Google Contacts"
              >
                <span className={`material-symbols-outlined text-[16px] ${loadingContacts ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>Refresh Google Contacts</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Contact</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast Message */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Connection Notice / Google Contacts Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Verified Collectives</p>
              <p className="text-xl font-extrabold text-slate-900">{PRESET_FARM_CONTACTS.length} Partners</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Organic smallholders, cold-chain transport drivers, and mandi coordinators.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined">cloud_sync</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Your Google Contacts</p>
              <p className="text-xl font-extrabold text-slate-900">
                {user ? `${googleContacts.length} Synced` : 'Not Connected'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            {user
              ? 'Connected to your primary Google Workspace / Gmail account.'
              : 'Sign in to access and manage your Google Contacts in this app.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Permission Security</p>
              <p className="text-xl font-extrabold text-slate-900">User Confirmed</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Strict user confirmation modals guard all create, update, and delete actions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, crop, mandi, or phone..."
            className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            'All',
            'Farmer',
            'Logistics',
            'Mandi Coordinator',
            'Google Contacts',
            'Verified Collectives',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error or Notice Display */}
      {contactsError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0">warning</span>
          <div>
            <p className="font-bold">Google Contacts Sync Notice</p>
            <p className="mt-0.5">{contactsError}</p>
            <p className="mt-1 text-slate-600">
              Ensure you have granted contacts access during Google sign-in. You can click &quot;Sign in with Google&quot; again to refresh permissions.
            </p>
          </div>
        </div>
      )}

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContacts.map((contact, idx) => {
          const isGoogle = contact.source === 'google';
          return (
            <div
              key={contact.resourceName || `${contact.name}-${idx}`}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header row with badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {contact.photoUrl ? (
                      <img
                        src={contact.photoUrl}
                        alt={contact.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-100">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{contact.name}</h3>
                      <p className="text-xs text-emerald-800 font-medium">
                        {contact.jobTitle || contact.organization || 'Agricultural Partner'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isGoogle
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isGoogle ? 'Google Contact' : 'Verified'}
                  </span>
                </div>

                {/* Info Fields */}
                <div className="space-y-1.5 text-xs text-slate-600 my-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {contact.organization && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">domain</span>
                      <span className="truncate">{contact.organization}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                      <span className="font-medium text-slate-800">{contact.phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                      <span className="truncate text-slate-700">{contact.email}</span>
                    </div>
                  )}
                  {contact.category && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">label</span>
                      <span className="text-[11px] font-semibold text-slate-500">{contact.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                      title="Direct Call"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      title="Send Email"
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                    </a>
                  )}
                </div>

                <div>
                  {!isGoogle ? (
                    <button
                      type="button"
                      onClick={() => handleRequestAddPreset(contact)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">person_add</span>
                      <span>Sync to Google</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(contact)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Delete from Google Contacts"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <span className="material-symbols-outlined text-5xl text-slate-300">contacts</span>
          <h3 className="text-base font-bold text-slate-900 mt-3">No contacts found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or category filter, or sign in to sync your personal Google Contacts.
          </p>
        </div>
      )}

      {/* Add Custom Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[22px]">person_add</span>
                <h3 className="font-bold text-base text-slate-900">Add New Agricultural Contact</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestCreateNew} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newContact.givenName}
                    onChange={(e) => setNewContact({ ...newContact, givenName: e.target.value })}
                    placeholder="e.g. Ramesh"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newContact.familyName}
                    onChange={(e) => setNewContact({ ...newContact, familyName: e.target.value })}
                    placeholder="e.g. Patel"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newContact.phoneNumber}
                  onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                  placeholder="+91 98230 00000"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="ramesh@nashik-syndicate.org"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Farm / Collective / Org</label>
                  <input
                    type="text"
                    value={newContact.organization}
                    onChange={(e) => setNewContact({ ...newContact, organization: e.target.value })}
                    placeholder="e.g. Nashik Organic Syndicate"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title / Role</label>
                  <input
                    type="text"
                    value={newContact.jobTitle}
                    onChange={(e) => setNewContact({ ...newContact, jobTitle: e.target.value })}
                    placeholder="e.g. Tomato Producer"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Directory Category</label>
                <select
                  value={newContact.category}
                  onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Farmer">Farmer / Producer</option>
                  <option value="Logistics">Reefer Cold-Chain Logistics</option>
                  <option value="Mandi Coordinator">APMC Mandi Coordinator</option>
                  <option value="Buyer">Direct Buyer / Wholesale</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Proceed to Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Explicit User Confirmation Modal for Destructive / Mutating Operations */}
      <GoogleContactsConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleExecuteConfirmedAction}
        title={confirmModalState.title}
        description={confirmModalState.description}
        actionType={confirmModalState.actionType}
        itemName={confirmModalState.itemName}
        isProcessing={isProcessingAction}
      />
    </div>
  );
};
