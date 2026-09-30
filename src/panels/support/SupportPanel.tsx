import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services/firestoreService';

export const SupportPanel: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('T-1082');
  const [isArbitrating, setIsArbitrating] = useState<boolean>(false);
  const [isArbitrated, setIsArbitrated] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat message input
  const [replyText, setReplyText] = useState<string>(
    'Dear Priya, our micro-transit guarantee covers this entirely. Processing full ₹135 refund to your instant escrow wallet now...'
  );
  const [chatMessages, setChatMessages] = useState<{ role: string; author: string; text: string; time: string }[]>([]);

  // Tickets
  const [tickets, setTickets] = useState([
    {
      id: 'T-1082',
      title: 'Bruised Roma Tomatoes in Crate #02',
      orderId: 'FD-8921',
      customer: 'Priya Sharma',
      sla: '4m SLA',
      isUrgent: true,
      amount: 135,
      type: 'damage',
      category: 'Produce Damage',
      harvestTime: 'Harvested: 05:30 AM Today',
      status: 'open',
    },
    {
      id: 'T-1083',
      title: 'Van #14 Reefer Compressor Warning',
      orderId: 'APL-902',
      customer: 'IoT Auto-Trigger',
      sla: '11m SLA',
      isUrgent: true,
      amount: 12400,
      type: 'temp',
      category: 'Temp 8.1°C Spike',
      harvestTime: 'En-route: Vashi to Andheri',
      status: 'investigating',
    },
    {
      id: 'T-1084',
      title: 'Gate Security Crate Return Dispute',
      orderId: 'CRT-9912',
      customer: 'Vikram Mehra',
      sla: 'Normal SLA',
      isUrgent: false,
      amount: 60,
      type: 'crate',
      category: 'Deposit Refund',
      harvestTime: 'Apartment Complex B-102',
      status: 'open',
    },
    {
      id: 'T-1085',
      title: 'Wrong Geo-Fence Hub Dispatch',
      orderId: 'FD-8930',
      customer: 'Kavita Sundaram',
      sla: '18m SLA',
      isUrgent: false,
      amount: 420,
      type: 'dispatch',
      category: 'Re-route Route',
      harvestTime: 'Delivery Hub Navi Mumbai',
      status: 'open',
    },
  ]);

  // Sync real support tickets from Firestore
  useEffect(() => {
    const mapTicket = (t: any) => ({
      id: t.id,
      title: t.description || 'Customer Support Dispute',
      orderId: t.orderId || 'FD-8921',
      customer: t.customerName || 'Customer Patron',
      sla: t.priority === 'high' ? '4m SLA' : 'Normal SLA',
      isUrgent: t.priority === 'high',
      amount: 135,
      type: t.issueType === 'temperature_breach' ? 'temp' : (t.issueType === 'crispness_dispute' ? 'damage' : 'dispatch'),
      category: t.issueType?.replace('_', ' ').toUpperCase() || 'Dispute',
      harvestTime: t.createdAt || 'Today',
      status: t.status || 'open',
    });

    firestoreService.getSupportTickets().then((data) => {
      if (data && data.length > 0) {
        setTickets(data.map(mapTicket));
        setSelectedTicketId(data[0].id);
      }
    });

    const unsub = firestoreService.listenSupportTickets((realTickets) => {
      if (realTickets && realTickets.length > 0) {
        setTickets(realTickets.map(mapTicket));
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleIssueRefund = async () => {
    setIsArbitrating(true);
    setTimeout(async () => {
      setIsArbitrated(true);
      setIsArbitrating(false);
      triggerToast('Txn #ESC-8921-TX Completed! ₹135 credited to Priya Sharma. 100% farm payout released. Synced to Firestore.');

      try {
        await firestoreService.resolveSupportTicket(
          'TCK-401',
          'refunded',
          '100% Transit vibration damage refund issued from micro-transit reserve pool. Zero grower deduction.'
        );
      } catch (err) {
        console.error('Failed to resolve support ticket in Firestore:', err);
      }
    }, 1100);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        role: 'agent',
        author: 'Resolution Agent (You)',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    triggerToast('Broadcast sent to all 3 connected channels.');
    setReplyText('');
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterType === 'all') return true;
    if (filterType === 'temp') return t.type === 'temp';
    if (filterType === 'damage') return t.type === 'damage';
    if (filterType === 'dispatch') return t.type === 'dispatch' || t.type === 'crate';
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-8 pb-12 font-sans text-[#141b2b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141b2b] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Ambient Metrics Bar & Live Escrow Summary */}
      <section className="relative w-full rounded-2xl bg-slate-50 p-6 border border-slate-200 shadow-xs overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Title & Live Dispatch Indicator */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center justify-center p-1.5 bg-[#006c49] text-white rounded-lg shadow-xs">
                <span className="material-symbols-outlined text-[18px]">balance</span>
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Autonomous Mesh Arbitrage
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                Real-Time Concierge Triage
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#141b2b] tracking-tight">
              Triage &amp; Escrow Dispute Deck
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              Multi-node resolution workspace arbitrating producer ledger, transit logistics, and consumer guarantees under smart contract protocol.
            </p>
          </div>

          {/* KPI Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* SLA Target */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Resolution SLA</span>
                <span className="material-symbols-outlined text-[16px] text-emerald-700">timer</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-emerald-800">6m 40s</span>
                <span className="text-[10px] text-slate-400">/ &lt;12m target</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>

            {/* Active vs Today Resolved */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Active / Closed</span>
                <span className="material-symbols-outlined text-[16px] text-amber-600">flaky</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-900">4</span>
                <span className="text-xs text-slate-400">pending</span>
                <span className="text-xs text-emerald-700 font-bold ml-1">(18 done)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">94.8% first-touch resolve</p>
            </div>

            {/* Escrow On Hold */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Escrow on Hold</span>
                <span className="material-symbols-outlined text-[16px] text-blue-600">lock_clock</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-900">₹24,650</span>
              </div>
              <p className="text-[10px] text-blue-700 font-bold mt-2">3 pool allocations</p>
            </div>

            {/* Micro-Transit Pool Status */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Transit Buffer</span>
                <span className="material-symbols-outlined text-[16px] text-emerald-600">shield</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-900">₹1,84,200</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-bold mt-2">Zero-deductible mesh</p>
            </div>
          </div>
        </div>

        {/* Filter Pills / Status Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Quick Triage:</span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'all'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <span>All Active</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">4</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('temp')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'temp'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Temp Breach Alert</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-300 text-[10px] font-mono">1</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('damage')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'damage'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Damaged Produce</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-300 text-[10px] font-mono">2</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('dispatch')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'dispatch'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Address / Late Dispatch</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-300 text-[10px] font-mono">1</span>
          </button>

          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Auto-refreshed 8s ago</span>
            <button
              type="button"
              onClick={() => triggerToast('Triage queue refreshed from real IoT cluster feeds.')}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Feed"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tri-Pane High Performance Resolution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Ticket Live Queue (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-800 text-[20px]">inbox</span>
              <h2 className="text-base font-bold text-slate-900">Ticket Stream</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Queue: Live</span>
          </div>

          {/* Ticket Cards Stack */}
          <div className="flex flex-col gap-3">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicketId === t.id;
              return (
                <article
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 rounded-2xl bg-white transition-all cursor-pointer relative overflow-hidden border ${
                    isSelected
                      ? 'border-[#006c49] shadow-md ring-2 ring-[#006c49]'
                      : 'border-slate-200/80 shadow-2xs hover:shadow-md'
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      t.type === 'damage'
                        ? 'bg-rose-500'
                        : t.type === 'temp'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  ></div>

                  <div className="flex items-start justify-between gap-2 pl-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-400 font-bold">#{t.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.isUrgent
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.sla}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{t.title}</h3>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 font-mono whitespace-nowrap">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="mt-3 pl-2 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                      <span className="font-mono">Order #{t.orderId}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-800 font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-emerald-700">person</span>
                        {t.customer}
                      </span>
                      <span className="text-amber-700 font-medium">{t.category}</span>
                    </div>
                  </div>

                  <div className="mt-3 pl-2 pt-2 bg-slate-50 -mx-4 -mb-4 p-3 flex items-center justify-between text-[11px] border-t border-slate-100">
                    <span className="text-slate-500">{t.harvestTime}</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        isSelected ? 'text-[#006c49]' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? 'Active Focus' : 'Select'}
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified_user</span>
              <span>Instant Escrow Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Transit damages beneath ₹500 settle instantaneously via autonomous underwriting with 0% farmer deduction.
            </p>
          </div>
        </div>

        {/* CENTER PANE: 3-Way Live Omnichannel Communication Thread (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden min-h-[720px]">
          {/* Thread Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                  CRITICAL #T-1082
                </span>
                <span className="text-xs font-bold text-slate-900">Live Resolution Stream</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>3 Parties Connected</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
              <span className="font-mono font-medium">Order #FD-8921 • Roma Tomatoes (Organic 2.5kg Crate)</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Buyer
                </span>
                <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Farmer
                </span>
                <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Driver
                </span>
              </div>
            </div>
          </div>

          {/* Live Chat Messages Scroll Area */}
          <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto bg-white">
            {/* Auto-Dial Banner */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="text-xs text-slate-600 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Triage Bot System Auto-Dial</span>
                  <span className="text-[10px] font-mono text-slate-400">09:12 AM</span>
                </div>
                <p className="mt-0.5">
                  Buyer flagged crate defect upon delivery handover. Autonomous escrow arbitration session initialized with Ramesh Patel (Producer) and Santosh (Van #04 Reefer).
                </p>
              </div>
            </div>

            {/* STREAM 1: Customer (Priya Sharma) */}
            <div className="flex flex-col gap-1 items-start max-w-[95%]">
              <div className="flex items-center gap-2 pl-1 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white font-bold flex items-center gap-1 text-[10px]">
                  <span className="material-symbols-outlined text-[12px]">person</span> Buyer
                </span>
                <span className="font-bold text-slate-900">Priya Sharma</span>
                <span className="text-[10px] text-slate-400 font-mono">Mobile App Handshake • 09:14 AM</span>
              </div>
              <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border-l-4 border-l-emerald-600 border border-slate-200 text-slate-900 shadow-2xs space-y-3 w-full text-xs">
                <p>
                  &quot;The tomatoes on the top layer have soft bruises from transit vibration. 4 out of the 12 fruits are split and leaking juice onto the cardboard liner.&quot;
                </p>
                {/* Photo Proof */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
                    alt="Proof of damaged tomatoes"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-white text-[10px] font-semibold">
                      High-Res (4K)
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 bg-slate-950/85 backdrop-blur-md rounded-lg text-white text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>GPS &amp; EXIF Cryptographically Verified</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold">Match 99.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STREAM 2: Farmer (Ramesh Patel) */}
            <div className="flex flex-col gap-1 items-start max-w-[95%]">
              <div className="flex items-center gap-2 pl-1 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold flex items-center gap-1 text-[10px]">
                  <span className="material-symbols-outlined text-[12px]">agriculture</span> Producer
                </span>
                <span className="font-bold text-slate-900">Ramesh Patel</span>
                <span className="text-[10px] text-slate-400 font-mono">Nashik Hub Node • 09:17 AM</span>
              </div>
              <div className="p-4 rounded-2xl rounded-tl-sm bg-amber-50/40 border-l-4 border-l-amber-500 border border-amber-200/80 text-slate-900 shadow-2xs space-y-2 w-full text-xs">
                <p>
                  &quot;Field 4 tomatoes were firm at harvest 05:30 AM today morning. We graded them Grade-A with strict 18-point firmness check. Looks like this crate was placed directly beneath heavy pumpkin crate in van during loading.&quot;
                </p>
                <div className="flex items-center justify-between text-[11px] text-amber-900 pt-1 border-t border-amber-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Farm Gate Batch Harvest Audit #NAS-772 Signed
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 bg-white rounded-md border border-amber-200">
                    Firmness: 4.8 kg/cm²
                  </span>
                </div>
              </div>
            </div>

            {/* STREAM 3: Driver (Santosh Van #04) */}
            <div className="flex flex-col gap-1 items-start max-w-[95%]">
              <div className="flex items-center gap-2 pl-1 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 text-[10px]">
                  <span className="material-symbols-outlined text-[12px]">local_shipping</span> Driver
                </span>
                <span className="font-bold text-slate-900">Santosh (Van #04)</span>
                <span className="text-[10px] text-slate-400 font-mono">In-Cab Intercom • 09:19 AM</span>
              </div>
              <div className="p-4 rounded-2xl rounded-tl-sm bg-blue-50/40 border-l-4 border-l-blue-600 border border-blue-200/80 text-slate-900 shadow-2xs space-y-2 w-full text-xs">
                <p>
                  &quot;Road diversion near Thane had bad potholes and stop-and-go construction traffic. My apologies to Priya madam. The lower crates in row 3 have shock absorbers and are fine, but top crate took physical impact.&quot;
                </p>
                <div className="flex items-center justify-between text-[11px] text-blue-900 pt-1 border-t border-blue-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px]">speed</span>
                    Telematics Shock: 1.8G Spike at 07:44 AM (Thane Bypass)
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 bg-white rounded-md border border-rose-300 text-rose-700">
                    Impact Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Autonomous Finding Co-Pilot Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-900 flex items-start gap-3 shadow-xs">
              <span className="material-symbols-outlined text-[#006c49] text-[24px] shrink-0 mt-0.5">
                auto_awesome
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#006c49]">Autonomous Concierge Finding</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#006c49] text-white text-[10px] font-mono font-bold">
                    100% Certainty
                  </span>
                </div>
                <p className="text-slate-700">
                  Fault confirmed: <strong className="text-slate-900">Transit shock vibration</strong>, not harvest degradation. Producer liability: <strong>0%</strong>. Micro-transit pool covers full crate value. Instant credit recommended.
                </p>
              </div>
            </div>

            {/* Added agent messages */}
            {chatMessages.map((m, i) => (
              <div key={i} className="flex flex-col gap-1 items-end max-w-[95%] self-end">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700">{m.author}</span>
                  <span>• {m.time}</span>
                </div>
                <div className="p-3 bg-emerald-700 text-white rounded-2xl rounded-tr-none text-xs">
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Action Message Input Bar */}
          <form onSubmit={handleSendChat} className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Broadcast message to:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#006c49] rounded" />
                <span>All 3 Parties</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-slate-500">
                <input type="checkbox" className="accent-[#006c49] rounded" />
                <span>Internal Log Only</span>
              </label>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type resolution message to customer, farmer, and driver..."
                className="w-full pl-3 pr-24 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006c49] shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT PANE: Escrow Arbitration & Immediate Action Console (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* IoT Audit Trail Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c49] text-[22px]">sensors_krx</span>
                <h3 className="text-base font-bold text-[#141b2b]">IoT Audit Trail</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                Chain Intact
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block">Reefer Ambient Temp</span>
                <span className="text-base font-extrabold text-[#006c49] font-mono">3.8°C – 4.2°C</span>
                <span className="text-[10px] text-emerald-700 flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span> Cold-chain verified
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block">Brix Index (Sweetness)</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">6.4 Brix</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Refractometer logged
                </span>
              </div>
            </div>

            {/* Inline Temperature & Shock SVG Chart */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>Ambient Temp
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>Shock (G)
                  </span>
                </div>
                <span className="font-mono text-[11px]">05:30 - 09:10 AM</span>
              </div>

              <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col gap-1 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1">
                  <span className="text-emerald-700 font-bold">4.0°C Mean (Safe: 2-6°C)</span>
                  <span className="text-rose-600 font-bold">Critical Shock Zone (&gt;1.5G)</span>
                </div>

                <svg className="w-full h-20 overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 80">
                  {/* Danger Zone Band */}
                  <rect x="0" y="0" width="340" height="28" fill="#fee2e2" rx="2" />
                  <line x1="0" y1="28" x2="340" y2="28" stroke="#f87171" strokeDasharray="3,3" strokeWidth="1" />
                  <text x="6" y="20" fill="#dc2626" fontSize="9" fontFamily="monospace">
                    Shock Danger Threshold: 1.5G
                  </text>

                  {/* Temp Safe Band */}
                  <rect x="0" y="46" width="340" height="26" fill="#d1fae5" rx="2" />

                  {/* Shock curve with 07:44 AM pothole spike */}
                  <path
                    d="M0,70 L40,68 L80,71 L120,69 L160,70 L195,68 L208,69 L214,14 L220,70 L260,69 L300,71 L340,70"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />

                  {/* Smooth Reefer Temp curve */}
                  <path
                    d="M0,56 Q35,52 70,54 T140,53 T210,55 T280,52 L340,54"
                    fill="none"
                    stroke="#006c49"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Shock Spike Pin at 07:44 AM */}
                  <circle cx="214" cy="14" r="4.5" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                  <circle cx="214" cy="14" r="8" fill="#fecaca" className="animate-ping opacity-75" />
                  <line x1="214" y1="14" x2="214" y2="75" stroke="#f87171" strokeDasharray="2,2" strokeWidth="1" />
                </svg>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200 px-1">
                  <span>05:30 Harvest</span>
                  <span>06:45 Transit Start</span>
                  <span className="text-rose-600 font-bold">07:44 Pothole Hit</span>
                  <span>09:12 Handover</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Patel Organic Farms • Plot 4B</p>
                <p className="text-[11px] text-slate-500">PGS-India Certified #ORG-9921</p>
              </div>
              <span className="font-mono text-emerald-800 font-bold">Grade A Roma</span>
            </div>
          </div>

          {/* Arbitration Settlement Calculator Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c49] text-[22px]">calculate</span>
                <h3 className="text-base font-bold text-[#141b2b]">Arbitration Settlement</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                Split Formula: 100/100
              </span>
            </div>

            {/* Ledger Split Summary Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5 pb-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">Escrow Split Breakdown</span>
                  <span className="font-mono text-slate-500">Total Lot: ₹135.00</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                  <div className="bg-emerald-600 h-full w-1/2" title="100% Consumer Refund (₹135)"></div>
                  <div className="bg-amber-500 h-full w-[45%]" title="100% Farmer Farm-Gate Release (₹121.50)"></div>
                  <div className="bg-blue-600 h-full w-[5%]" title="Micro-Transit Buffer Absorption"></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="text-emerald-800 font-bold">Buyer +₹135</span>
                  <span className="text-amber-700 font-bold">Farmer ₹121.50</span>
                  <span className="text-blue-700 font-bold">Mesh Absorbs</span>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Buyer side */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-emerald-700 text-[15px]">person</span>
                    Customer Priya Sharma
                  </p>
                  <p className="text-[11px] text-emerald-700">100% Crate Value Refund</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-[#006c49]">+₹135.00</span>
                  <p className="text-[10px] text-slate-400">Instant Escrow Credit</p>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Farmer side */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-600 text-[15px]">agriculture</span>
                    Farmer Ramesh Patel
                  </p>
                  <p className="text-[11px] text-slate-500">Full Farm-Gate Payout (0% Penalty)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-slate-900">₹121.50</span>
                  <p className="text-[10px] text-slate-400">Harvest Ledger Released</p>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Underwriter deduction */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-blue-600 text-[15px]">shield</span>
                  Debit Micro-Transit Pool:
                </span>
                <span className="font-mono text-amber-700 font-bold">-₹135.00 (Zero Deductible)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">lock</span>
              <span>Dual multi-signature handshake ready. No banking wait period.</span>
            </div>

            {/* Action Buttons Stack */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleIssueRefund}
                disabled={isArbitrating || isArbitrated}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isArbitrated
                    ? 'bg-emerald-100 text-emerald-900 cursor-default'
                    : 'bg-[#006c49] hover:bg-[#005236] text-white active:scale-95'
                }`}
              >
                {isArbitrating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Executing Smart Contract Escrow...</span>
                  </>
                ) : isArbitrated ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    <span>Escrow Released &amp; Settled</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
                    <span>Issue ₹135 Instant Refund &amp; Release Escrow</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerToast('Replacement crate dispatched from Bandra West backup hub.')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-600">local_shipping</span>
                  <span>Dispatch Crate</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Connecting video verify call with hub inspector...')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006c49]">videocam</span>
                  <span>Video Verify</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerToast('Ticket #T-1082 closed as arbitrated and recorded in audit log.');
                  setIsArbitrated(true);
                }}
                className="py-2 px-3 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle_outline</span>
                <span>Close Ticket as Arbitrated</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
