# Security Specification & Test Protocol

## 1. Data Invariants
- `produce_items`: Publicly readable by all users; writes restricted to verified admins.
- `orders`: Customers can read and create their own orders. Status updates allowed for escrow release by the buyer, or full updates by verified admins.
- `farm_clusters`: Publicly readable by all users; writes restricted to verified admins.
- `farmer_dispatches`: Readable by all users and farmers; creation and status updates allowed by farmers and admins.
- `fleet_telemetry`: Publicly readable by clients for real-time tracking; updates allowed by authenticated operators and admins.
- `support_tickets`: Read and write permitted for customer dispute resolution and support executives.
- `users`: Private user profile readable and updatable ONLY by the owner (`request.auth.uid == userId`) or admin.

## 2. The Dirty Dozen Payloads
1. Anonymous user attempting to alter produce item prices.
2. Non-owner attempting to read another customer's private profile (/users/{userId}).
3. User attempting to tamper with another user's order escrowStatus.
4. Setting a 1MB payload string in `vanNumber` or `orderId` (ID poisoning guard).
5. Attempting to bypass strict keys by injecting ghost fields (`__ghost_hack: true`).
6. Unauthenticated write to `fleet_telemetry`.
7. Client trying to inject unverified admin email without email_verified == true.
8. Overwriting immutable order creation records with altered payment totals.
9. Attempting to update `farmer_dispatches` without valid status enum.
10. Attempting to delete `produce_items` catalog without admin privileges.
11. Reading private user PII via unauthenticated list queries.
12. Creating orders with negative total amounts.
