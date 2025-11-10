export function sendInvitationEmail(email: string, { token, expiresAt }: { token: string; expiresAt?: Date | null }) {

    
    const webUrl = process.env.WEB_URL || 'http://localhost:3000';
    const inviteLink = `${webUrl}/invite?token=${token}`;
    const expires = expiresAt ? expiresAt.toISOString() : 'no-expiry';

    console.log(`[SIMULATED EMAIL] To: ${email} | Invite: ${inviteLink} | Expires: ${expires}`);
}