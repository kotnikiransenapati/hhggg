/**
 * Service for Google Contacts integration via Google People API.
 * Adheres to Google Workspace Integration guidelines:
 * - Scope: https://www.googleapis.com/auth/contacts
 * - Token passed via Authorization Bearer header
 * - Explicit user confirmation modal for mutating operations
 */

export interface GoogleContactPerson {
  resourceName?: string;
  etag?: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  photoUrl?: string;
  category?: 'Farmer' | 'Logistics' | 'Mandi Coordinator' | 'Buyer' | 'Support';
}

export interface NewContactInput {
  givenName: string;
  familyName?: string;
  email?: string;
  phoneNumber?: string;
  organization?: string;
  jobTitle?: string;
  category?: string;
}

export const PRESET_FARM_CONTACTS: GoogleContactPerson[] = [
  {
    name: 'Ramesh Patel (Cluster Lead)',
    email: 'ramesh.patel@nashik-syndicate.org',
    phone: '+91 98230 44102',
    organization: 'Nashik Organic Syndicate #4',
    jobTitle: 'Heirloom Vine Tomato Grower',
    category: 'Farmer',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rajesh Sharma (Highland Orchards)',
    email: 'rajesh.sharma@himachal-orchards.in',
    phone: '+91 94180 88219',
    organization: 'Himachal Highland Orchards',
    jobTitle: 'Royal Delicious Apple Producer',
    category: 'Farmer',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bhavik & Anand Patel',
    email: 'bhavik@girvedic.org',
    phone: '+91 97240 11984',
    organization: 'Gir Vedic Gaushala',
    jobTitle: 'A2 Vedic Bilona Ghee & Raw Milk Collective',
    category: 'Farmer',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Subedar Manpreet Singh (Fleet Head)',
    email: 'reefer.dispatch@farmdirect.internal',
    phone: '+91 98112 77014',
    organization: 'Cold-Chain Reefer Logistics Fleet',
    jobTitle: 'Fleet Command & IoT Telemetry Officer',
    category: 'Logistics',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Meenakshi Sundaram',
    email: 'mandi.apmc@bangalore-agri.gov.in',
    phone: '+91 94480 33022',
    organization: 'Yeshwanthpur APMC Mandi Syndicate',
    jobTitle: 'Organic Grading & MSP Verification Officer',
    category: 'Mandi Coordinator',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export async function fetchGoogleContacts(accessToken: string): Promise<GoogleContactPerson[]> {
  const url = 'https://people.googleapis.com/v1/people/me/connections?pageSize=100&personFields=names,emailAddresses,phoneNumbers,organizations,photos,userDefined';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google People API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const connections = data.connections || [];

  return connections.map((person: any): GoogleContactPerson => {
    const name = person.names?.[0]?.displayName || 'Unnamed Contact';
    const email = person.emailAddresses?.[0]?.value || '';
    const phone = person.phoneNumbers?.[0]?.value || '';
    const org = person.organizations?.[0]?.name || '';
    const jobTitle = person.organizations?.[0]?.title || '';
    const photoUrl = person.photos?.[0]?.url || '';

    // Infer category
    let category: GoogleContactPerson['category'] = 'Farmer';
    const combined = `${name} ${org} ${jobTitle}`.toLowerCase();
    if (combined.includes('reefer') || combined.includes('driver') || combined.includes('logistics') || combined.includes('fleet')) {
      category = 'Logistics';
    } else if (combined.includes('mandi') || combined.includes('apmc') || combined.includes('officer')) {
      category = 'Mandi Coordinator';
    } else if (combined.includes('buyer') || combined.includes('consumer') || combined.includes('chef')) {
      category = 'Buyer';
    }

    return {
      resourceName: person.resourceName,
      etag: person.etag,
      name,
      email,
      phone,
      organization: org,
      jobTitle,
      photoUrl,
      category,
    };
  });
}

export async function createGoogleContact(
  accessToken: string,
  contact: NewContactInput
): Promise<GoogleContactPerson> {
  const url = 'https://people.googleapis.com/v1/people:createContact';

  const body: any = {
    names: [
      {
        givenName: contact.givenName,
        familyName: contact.familyName || '',
      },
    ],
  };

  if (contact.email) {
    body.emailAddresses = [{ value: contact.email, type: 'work' }];
  }

  if (contact.phoneNumber) {
    body.phoneNumbers = [{ value: contact.phoneNumber, type: 'mobile' }];
  }

  if (contact.organization || contact.jobTitle) {
    body.organizations = [
      {
        name: contact.organization || 'FarmDirect Network',
        title: contact.jobTitle || 'Organic Partner',
      },
    ];
  }

  if (contact.category) {
    body.userDefined = [
      {
        key: 'FarmDirectRole',
        value: contact.category,
      },
    ];
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create contact in Google Contacts (${response.status}): ${errorText}`);
  }

  const created = await response.json();
  return {
    resourceName: created.resourceName,
    etag: created.etag,
    name: created.names?.[0]?.displayName || `${contact.givenName} ${contact.familyName || ''}`.trim(),
    email: contact.email,
    phone: contact.phoneNumber,
    organization: contact.organization,
    jobTitle: contact.jobTitle,
    category: (contact.category as any) || 'Farmer',
  };
}

export async function deleteGoogleContact(accessToken: string, resourceName: string): Promise<void> {
  const url = `https://people.googleapis.com/v1/${resourceName}:deleteContact`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to delete contact from Google Contacts (${response.status}): ${errorText}`);
  }
}
