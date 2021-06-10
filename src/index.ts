import dotenv from 'dotenv';
dotenv.config();

import * as Sentry from '@sentry/node';
import './bot';

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		tracesSampleRate: 1.0
	});
}

