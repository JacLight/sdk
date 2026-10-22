# AppMint Banking models — NOT Business Made

These `banking_*` models are **AppMint Banking**: a full bank sold only as API services. The
server is appengine `src/banking/`.

**They are not Business Made's bank records.** Business Made keeps a business's own books with
the `bank_*` models (`bank_account`, `bank_connection`, `bank_transaction`, `bank_transfer`:
Plaid feeds, payroll ACH, reconciliation). The two never share records or code.

- Don't use `banking_*` models for Business Made features, or `bank_*` models for the bank.
- Don't rename `banking_*` to `bank_*`. Those names are taken.
- Money is whole cents and rates are basis points everywhere in these models.
