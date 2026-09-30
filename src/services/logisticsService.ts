import { OrderRecord } from '../types';

export interface PincodeZoneResult {
  pincode: string;
  city: string;
  district: string;
  state: string;
  deliveryZone: 'Hyperlocal Sub-4C (Within 6 Hrs)' | 'Regional Cold Corridor (Same Day)' | 'National Express Air (Next Morning)';
  primaryCarrier: 'Delhivery Cold' | 'India Post Speed';
  estimatedTransitHours: number;
  availableSlots: string[];
}

export interface GstTaxInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  orderId: string;
  sellerGstin: string;
  sellerName: string;
  sellerAddress: string;
  buyerName: string;
  buyerAddress: string;
  hsnSummary: {
    hsnCode: string;
    description: string;
    taxableValue: number;
    cgstRate: number;
    cgstAmount: number;
    sgstRate: number;
    sgstAmount: number;
    total: number;
  }[];
  totalTaxable: number;
  totalCgst: number;
  totalSgst: number;
  grandTotal: number;
}

class LogisticsService {
  /**
   * Pincode Zone & Carrier Resolver
   */
  resolvePincode(pincode: string): PincodeZoneResult {
    const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);

    // Hyperlocal Mumbai Zone
    if (cleanPin.startsWith('400')) {
      return {
        pincode: cleanPin || '400050',
        city: 'Mumbai',
        district: 'Mumbai Suburban',
        state: 'Maharashtra',
        deliveryZone: 'Hyperlocal Sub-4C (Within 6 Hrs)',
        primaryCarrier: 'Delhivery Cold',
        estimatedTransitHours: 4,
        availableSlots: [
          'Sunrise Slot (07:00 AM – 09:30 AM)',
          'Midday Crisp (11:30 AM – 01:30 PM)',
          'Sunset Escrow (05:00 PM – 07:30 PM)',
        ],
      };
    }

    // Regional Pune / Nashik Zone
    if (cleanPin.startsWith('411') || cleanPin.startsWith('422')) {
      return {
        pincode: cleanPin,
        city: cleanPin.startsWith('411') ? 'Pune' : 'Nashik',
        district: cleanPin.startsWith('411') ? 'Pune' : 'Nashik Valley',
        state: 'Maharashtra',
        deliveryZone: 'Regional Cold Corridor (Same Day)',
        primaryCarrier: 'Delhivery Cold',
        estimatedTransitHours: 6,
        availableSlots: [
          'Farm Dispatch Direct (10:00 AM – 01:00 PM)',
          'Evening Hub Consolidation (04:30 PM – 07:00 PM)',
        ],
      };
    }

    // National Speed Post Express
    return {
      pincode: cleanPin || '560001',
      city: 'Metro Hub',
      district: 'Regional Capital',
      state: 'India',
      deliveryZone: 'National Express Air (Next Morning)',
      primaryCarrier: 'India Post Speed',
      estimatedTransitHours: 14,
      availableSlots: [
        'Priority Speed Post Parcel (Tomorrow Morning 10:00 AM)',
      ],
    };
  }

  /**
   * Generates official GST-compliant tax invoice
   */
  generateGstInvoice(order: OrderRecord, customerName: string, customerAddress: string): GstTaxInvoice {
    const invYear = new Date().getFullYear();
    const invNumber = `FD-INV-${invYear}-${order.id.replace('FD-', '')}`;
    const taxableValue = Number((order.subtotal * 0.95).toFixed(2));
    const cgstAmount = Number((taxableValue * 0.025).toFixed(2)); // 2.5% CGST
    const sgstAmount = Number((taxableValue * 0.025).toFixed(2)); // 2.5% SGST

    return {
      invoiceNumber: invNumber,
      invoiceDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      orderId: order.id,
      sellerGstin: '27AABCU9603R1ZM',
      sellerName: 'FarmDirect Organic Cooperative Mesh Private Limited',
      sellerAddress: 'Cold Dock 3, Kasara Cold Hub, Nashik Highway, MH 421601',
      buyerName: customerName,
      buyerAddress: customerAddress,
      hsnSummary: [
        {
          hsnCode: '07020000',
          description: 'Fresh Farm Produce & Cold-Chain Organic Dispatches',
          taxableValue,
          cgstRate: 2.5,
          cgstAmount,
          sgstRate: 2.5,
          sgstAmount,
          total: order.total,
        },
      ],
      totalTaxable: taxableValue,
      totalCgst: cgstAmount,
      totalSgst: sgstAmount,
      grandTotal: order.total,
    };
  }

  /**
   * Generates India Post / Delhivery 100mm thermal printable label data
   */
  generateAwbLabel(order: OrderRecord, customerName: string, customerAddress: string) {
    const carrier = order.total > 700 ? 'Delhivery Cold' : 'India Post Speed';
    const awb = carrier === 'Delhivery Cold'
      ? `DLV${Math.floor(1000000000 + Math.random() * 9000000000)}`
      : `IP${Math.floor(10000000 + Math.random() * 90000000)}IN`;

    return {
      awb,
      carrier,
      orderId: order.id,
      escrowLocked: order.escrowStatus === 'Locked',
      reeferTempRequirement: 'Sub-4.0°C Steady Solar-Monitored',
      shipTo: {
        name: customerName,
        address: customerAddress,
        phone: '+91 98201 44892',
      },
      packageWeight: `${(order.items.reduce((sum, i) => sum + i.quantity, 0) * 1.2).toFixed(1)} kg`,
      manifestDate: new Date().toLocaleDateString('en-IN'),
      routingHub: 'Bandra-West Central Hub Cold Dock #2',
    };
  }
}

export const logisticsService = new LogisticsService();
