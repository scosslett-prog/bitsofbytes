-- Licence subscriptions paid by invoice (billing function, action "invoice") are marked so the site
-- can say "paid by invoice" and not offer the card billing portal for them.
alter table public.subscriptions add column if not exists collection text not null default 'charge_automatically';
