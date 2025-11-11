export function sendInvitationEmail(email: string, { token, expiresAt }: { token: string; expiresAt?: Date | null }) {

    
    const webUrl = 'http://localhost:5173';
    const inviteLink = `${webUrl}/invite?token=${token}`;
    const expires = expiresAt ? expiresAt.toISOString() : 'no-expiry';

    console.log(`[SIMULATED EMAIL] To: ${email} | Invite: ${inviteLink} | Expires: ${expires}`);
}