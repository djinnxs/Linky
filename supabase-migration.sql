-- Migration: Add provider-agnostic subscription fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT DEFAULT '';
