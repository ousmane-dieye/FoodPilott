# Security Spec for FoodPilot

## 1. Data Invariants
- An order must have a valid `userId` matching the creator.
- A user's `role` can only be set by the system or an admin (not self-assigned during creation).
- Order status transitions must follow: `pending -> preparing -> ready -> completed`.
- Menu prices and stocks must be positive numbers.

## 2. Dirty Dozen Payloads (Rejection Targets)
1. **Self-Promotion:** A student trying to update their own role to 'ADMIN'.
2. **Order Forgery:** A student creating an order for another user's `userId`.
3. **Price Manipulation:** A student trying to create an order with a total of `1.0`.
4. **Stock Injection:** A cook trying to set negative stock levels.
5. **Shadow Field:** Adding a `isVerified: true` field to a user profile to bypass future checks.
6. **Orphan Order:** Creating an order for a menu item that doesn't exist.
7. **Identity Spoofing:** Reading another user's private allergies.
8. **Resource Exhaustion:** Creating a 1MB string in the menu description.
9. **State Shortcut:** Moving an order from `pending` directly to `completed`.
10. **ID Poisoning:** Using a 1KB string as a document ID.
11. **PII Leak:** An authenticated user trying to `list` all users without admin rights.
12. **Double Dip:** Trying to cancel an order that is already `preparing`.

## 3. RBAC Mapping
- **ADMIN:** Full CRUD on `/users`, `/menus`, `/stocks`, `/orders`.
- **COOK:** Read on `/menus`, Read/Update on `/orders` (only status), Read on `/stockAlerts`.
- **STUDENT:** Read on `/menus`, Create on `/orders`, Read/Update on OWN `/users/{userId}` (restricted fields).
