#!/usr/bin/env node
console.log('=== Container Starting ===');
console.log('HOST:', process.env.HOST);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Working directory:', process.cwd());

import('fs').then(fs => {
    console.log('dist/server contents:', fs.readdirSync('./dist/server'));
    console.log('Starting server...');

    import('./dist/server/entry.mjs')
        .then(() => {
            console.log('Server module loaded successfully');
        })
        .catch(err => {
            console.error('Failed to load server:', err);
            process.exit(1);
        });
}).catch(err => {
    console.error('Startup error:', err);
    process.exit(1);
});
