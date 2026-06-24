import { auth } from '../lib/auth';

async function main() {
    await auth.api.signUpEmail({
        body: {
            name: 'John Doe',
            email: 'john-doe@cra.fr',
            password: 'password123',
        },
    });
    console.log('✅ Compte créé : john-doe@cra.fr / password123');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
