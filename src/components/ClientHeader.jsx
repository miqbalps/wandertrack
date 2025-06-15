'use client';
import AuthButton from '@/components/auth-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import { hasEnvVars } from '@/lib/utils';

export default function ClientHeader() {
  return (
    !hasEnvVars ? <EnvVarWarning /> : <AuthButton />
  );
}